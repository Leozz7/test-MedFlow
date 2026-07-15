using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Infrastructure.Persistence;
using MedFlow.Infrastructure.Persistence.Interceptors;
using MedFlow.Infrastructure.Persistence.Repositories;

namespace MedFlow.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Interceptor
        services.AddScoped<AuditableEntitySaveChangesInterceptor>();

        // DbContext
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IExamRepository, ExamRepository>();

        return services;
    }
}
