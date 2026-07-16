using System.Linq;
using MedFlow.Api.Middlewares;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Serilog;

namespace MedFlow.Api.Extensions;

public static class ApplicationBuilderExtensions
{
    public static WebApplication UseApiPipeline(this WebApplication app)
    {
        app.UseForwardedHeaders();

        // Tratamento global de exceções (deve vir antes dos demais middlewares)
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        // Middleware de Log do Serilog para requisições HTTP (tempo de execução, status code, etc)
        app.UseSerilogRequestLogging(options =>
        {
            options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} respondeu {StatusCode} em {Elapsed:0.0000} ms";
        });

        app.UseHttpsRedirection();
        app.UseCors("MedFlowPolicy");
        app.UseRateLimiter();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers().RequireRateLimiting("fixed");

        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "MedFlow API v1"));

        app.MapCustomHealthChecks();

        return app;
    }

    private static void MapCustomHealthChecks(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapHealthChecks("/health/live", new HealthCheckOptions
        {
            Predicate = _ => false
        });

        // Endpoint principal de Health Check executando todas as verificações de conexão (Postgres e RabbitMQ)
        endpoints.MapHealthChecks("/health", new HealthCheckOptions
        {
            AllowCachingResponses = false,
            ResponseWriter = async (context, report) =>
            {
                context.Response.ContentType = "application/json";
                var response = new
                {
                    status = report.Status.ToString(),
                    checks = report.Entries.Select(entry => new
                    {
                        name = entry.Key,
                        status = entry.Value.Status.ToString(),
                        description = entry.Value.Description,
                        duration = entry.Value.Duration.TotalMilliseconds + "ms",
                        exception = entry.Value.Exception?.Message
                    }).ToList()
                };
                await context.Response.WriteAsJsonAsync(response);
            }
        });

        endpoints.MapHealthChecks("/health/ready", new HealthCheckOptions());
    }
}
