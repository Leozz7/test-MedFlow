using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using MedFlow.Infrastructure.Persistence;
using MedFlow.Infrastructure.RabbitMQ;

namespace MedFlow.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<MedFlow.Application.Common.Interfaces.ICurrentUserService, MedFlow.Api.Services.CurrentUserService>();

        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

        services.AddEndpointsApiExplorer();

        // Swagger
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new Microsoft.OpenApi.OpenApiInfo { Title = "MedFlow API", Version = "v1" });

            c.AddSecurityDefinition("bearer", new Microsoft.OpenApi.OpenApiSecurityScheme
            {
                Type = Microsoft.OpenApi.SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "JWT Authorization header usando o esquema Bearer. Exemplo: \"{token}\""
            });

            c.AddSecurityRequirement(document => new Microsoft.OpenApi.OpenApiSecurityRequirement
            {
                [new Microsoft.OpenApi.OpenApiSecuritySchemeReference("bearer", document)] = new List<string>()
            });
        });

        services.AddHealthChecks()
            .AddCheck<PostgresHealthCheck>("PostgreSQL")
            .AddCheck<RabbitMQHealthCheck>("RabbitMQ");

        // JWT Authentication
        JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

        var jwtKey = configuration["Jwt:Key"]
                     ?? throw new InvalidOperationException("Jwt:Key não configurado.");

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                    ValidateIssuer = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = configuration["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    RoleClaimType = System.Security.Claims.ClaimTypes.Role,
                    NameClaimType = "sub"
                };

                // Retorna 401 em JSON padronizado
                options.Events = new JwtBearerEvents
                {
                    OnChallenge = async context =>
                    {
                        context.HandleResponse();
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "application/problem+json";
                        await context.Response.WriteAsJsonAsync(new
                        {
                            title = "Unauthorized",
                            status = 401,
                            detail = "Token ausente ou inválido."
                        });
                    },
                    OnForbidden = async context =>
                    {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        context.Response.ContentType = "application/problem+json";
                        await context.Response.WriteAsJsonAsync(new
                        {
                            title = "Forbidden",
                            status = 403,
                            detail = "Você não tem permissão para acessar este recurso."
                        });
                    }
                };
            });

        services.AddAuthorization();

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
        var queueLimit = configuration.GetValue<int>("RateLimiting:QueueLimit", 0);

        var authPermitLimit = configuration.GetValue<int>("RateLimiting:AuthPermitLimit", 10);
        var authWindowMinutes = configuration.GetValue<int>("RateLimiting:AuthWindowInMinutes", 1);

        var uploadPermitLimit = configuration.GetValue<int>("RateLimiting:UploadPermitLimit", 20);
        var uploadWindowMinutes = configuration.GetValue<int>("RateLimiting:UploadWindowInMinutes", 1);

        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.OnRejected = async (context, token) =>
            {
                context.HttpContext.Response.Headers.RetryAfter = "60";
                await context.HttpContext.Response.WriteAsJsonAsync(new
                {
                    type = "rate_limit_exceeded",
                    title = "Too Many Requests",
                    status = StatusCodes.Status429TooManyRequests,
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
                        QueueLimit = queueLimit
                    }));

            options.AddPolicy("auth", context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "fallback",
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = authPermitLimit,
                        Window = TimeSpan.FromMinutes(authWindowMinutes),
                        QueueLimit = 0
                    }));

            options.AddPolicy("upload", context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "fallback",
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = uploadPermitLimit,
                        Window = TimeSpan.FromMinutes(uploadWindowMinutes),
                        QueueLimit = 0
                    }));
        });

        return services;
    }
}
