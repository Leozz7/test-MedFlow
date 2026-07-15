using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

namespace MedFlow.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        services.AddHealthChecks();
        
        // Remove RabbitMQ for now until configured

        return services;
    }

    public static IServiceCollection AddCorsPolicy(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var allowedOrigins = configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>()
            ?? ["http://localhost:3000", "http://localhost:5173"];

        services.AddCors(options =>
        {
            options.AddPolicy("MedFlowPolicy", policy =>
            {
                policy
                    .SetIsOriginAllowed(_ => true)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
                    .WithExposedHeaders(
                        "X-CSRF-TOKEN",
                        "Retry-After",
                        "X-RateLimit-Limit",
                        "X-RateLimit-Remaining");
            });

            options.AddPolicy("HealthCheckPolicy", policy =>
            {
                policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            });
        });

        return services;
    }

    public static IServiceCollection AddRateLimiting(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var permitLimit = configuration.GetValue<int>("RateLimiting:PermitLimit", 100);
        var windowMinutes = configuration.GetValue<int>("RateLimiting:WindowInMinutes", 1);

        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.OnRejected = async (context, token) =>
            {
                await context.HttpContext.Response.WriteAsJsonAsync(new
                {
                    type = "rate_limit_exceeded",
                    message = "Limite de requisições excedido. Tente novamente mais tarde.",
                    retryAfter = $"{windowMinutes} minute",
                    path = context.HttpContext.Request.Path.ToString()
                }, token);
            };

            options.AddPolicy("fixed", context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "fallback",
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = permitLimit,
                        Window = TimeSpan.FromMinutes(windowMinutes),
                        QueueLimit = configuration.GetValue<int>("RateLimiting:QueueLimit", 0)
                    }));
        });

        return services;
    }
}
