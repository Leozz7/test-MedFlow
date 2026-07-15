using Microsoft.AspNetCore.Diagnostics.HealthChecks;

namespace MedFlow.Api.Extensions;

public static class ApplicationBuilderExtensions
{
    public static WebApplication UseApiPipeline(this WebApplication app)
    {
        app.UseForwardedHeaders();
        app.UseHttpsRedirection();
        app.UseCors("MedFlowPolicy");
        app.UseRateLimiter();
        
        // Ativar quando tivermos Authentication
        // app.UseAuthentication();
        // app.UseAuthorization();

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
        
        endpoints.MapHealthChecks("/health/ready", new HealthCheckOptions());
    }
}
