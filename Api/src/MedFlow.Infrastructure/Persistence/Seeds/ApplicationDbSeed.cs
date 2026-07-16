using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MedFlow.Application.Common.Security;
using MedFlow.Domain.Entities;
using MedFlow.Domain.Enums;

namespace MedFlow.Infrastructure.Persistence;

public static class ApplicationDbContextSeed
{
    public static async Task SeedDefaultUserAsync(
        ApplicationDbContext context,
        IPasswordHasher passwordHasher,
        IConfiguration configuration,
        ILogger logger)
    {
        try
        {
            if (context.Database.IsNpgsql())
            {
                await context.Database.MigrateAsync();
            }

            var adminEmail = configuration["Seed:AdminEmail"];
            var adminPassword = configuration["Seed:AdminPassword"];

            if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword) || 
                adminEmail == "OVERRIDE_ME_VIA_ENV" || adminPassword == "OVERRIDE_ME_VIA_ENV")
            {
                logger.LogWarning("Admin seed credentials (Seed:AdminEmail or Seed:AdminPassword) not found in configuration or not overridden. Skipping admin user creation.");
                return;
            }

            if (await context.Users.AnyAsync(u => u.Email == adminEmail))
            {
                logger.LogInformation("Admin user with email {Email} already exists. Skipping creation.", adminEmail);
                return;
            }

            var passwordHash = passwordHasher.Hash(adminPassword);

            var adminUser = new User(
                name: "System Administrator",
                email: adminEmail,
                passwordHash: passwordHash,
                role: UserRole.ATTENDANT);

            context.Users.Add(adminUser);
            await context.SaveChangesAsync();

            logger.LogInformation("Successfully created admin user: {Email}", adminEmail);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }
}
