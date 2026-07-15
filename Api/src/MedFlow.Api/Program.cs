using MedFlow.Api.Extensions;
using MedFlow.Application;
using MedFlow.Infrastructure;
using MedFlow.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

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

app.Run();
