using MedFlow.Api.Extensions;
using MedFlow.Application;
using MedFlow.Infrastructure;
using MedFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("Iniciando o host do MedFlow...");

    var builder = WebApplication.CreateBuilder(args);

    // Integrar o Serilog no Host do ASP.NET Core
    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext());

    // API Services
    builder.Services.AddApiServices(builder.Configuration);
    builder.Services.AddCorsPolicy(builder.Configuration);
    builder.Services.AddRateLimiting(builder.Configuration);

    // Forwarded Headers
    builder.Services.Configure<Microsoft.AspNetCore.Builder.ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders = Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedFor | 
                                   Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedProto;
        options.KnownIPNetworks.Clear();
        options.KnownProxies.Clear();
    });

    // Infrastructure & Application
    builder.Services.AddApplication();
    builder.Services.AddInfrastructureServices(builder.Configuration);

    var app = builder.Build();

    // Pipeline
    app.UseApiPipeline();

    // Apply migrations and seed database on startup
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger("Program");
        try
        {
            logger.LogInformation("Applying pending database migrations...");
            var context = services.GetRequiredService<ApplicationDbContext>();
            
            if (context.Database.IsNpgsql())
            {
                await context.Database.MigrateAsync();
                logger.LogInformation("Database migrations applied successfully.");
            }

            var passwordHasher = services.GetRequiredService<MedFlow.Application.Common.Security.IPasswordHasher>();
            var configuration = services.GetRequiredService<IConfiguration>();
            
            await ApplicationDbContextSeed.SeedDefaultUserAsync(context, passwordHasher, configuration, logger);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred during database migration or seeding.");
        }
    }

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "O host do MedFlow terminou inesperadamente.");
}
finally
{
    Log.CloseAndFlush();
}
