using MedFlow.Application.Common.Security;
using MedFlow.Application.Interfaces.Messaging;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Infrastructure.Authentication;
using MedFlow.Infrastructure.Persistence;
using MedFlow.Infrastructure.Persistence.Interceptors;
using MedFlow.Infrastructure.Persistence.Repositories;
using MedFlow.Infrastructure.RabbitMQ;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MedFlow.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Interceptor
        services.AddScoped<AuditableEntitySaveChangesInterceptor>();

        // DbContext
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IExamRepository, ExamRepository>();

        // PasswordHasher interno (Argon2id) – registrado como Application.Common.Security.IPasswordHasher
        services.AddSingleton<IPasswordHasher>(sp => new PasswordHasher(configuration));

        // Adaptador que expõe Application.Interfaces.Auth.IPasswordHasher
        services.AddSingleton<MedFlow.Application.Interfaces.Auth.IPasswordHasher>(sp =>
            new PasswordHasherAdapter(sp.GetRequiredService<IPasswordHasher>()));

        // Token JWT
        services.AddSingleton<MedFlow.Application.Interfaces.Auth.ITokenService, TokenService>();

        // RabbitMQ Fila & Mensageria
        services.AddTransient<IMessagePublisher, RabbitMQMessagePublisher>();
        services.AddHostedService<ExamProcessingBackgroundService>();

        return services;
    }
}
