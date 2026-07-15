using System.Reflection;
using FluentValidation;
using MediatR;
using MedFlow.Application.Behaviors;
using Microsoft.Extensions.DependencyInjection;

namespace MedFlow.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        // Registra o MediatR e aponta para o assembly atual para descobrir os Handlers
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));

        // Registra o Pipeline Behavior de validação
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

        // Registra todos os validadores do FluentValidation
        services.AddValidatorsFromAssembly(assembly);

        return services;
    }
}
