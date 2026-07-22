using System.Linq;
using System.Reflection;
using FluentAssertions;
using MedFlow.Api.Controllers;
using MedFlow.Api.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Xunit;

namespace MedFlow.Tests.Api;

public class RateLimitingTests
{
    [Fact]
    public void AddRateLimiting_ShouldRegisterRateLimiterOptions()
    {
        // Arrange
        var services = new ServiceCollection();
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["RateLimiting:PermitLimit"] = "50",
                ["RateLimiting:WindowInMinutes"] = "2",
                ["RateLimiting:AuthPermitLimit"] = "5",
                ["RateLimiting:UploadPermitLimit"] = "10"
            })
            .Build();

        // Act
        services.AddRateLimiting(configuration);
        var provider = services.BuildServiceProvider();
        var options = provider.GetService<IOptions<RateLimiterOptions>>();

        // Assert
        options.Should().NotBeNull();
        options!.Value.RejectionStatusCode.Should().Be(429);
    }

    [Fact]
    public void AuthController_ShouldHaveEnableRateLimitingAttributeWithAuthPolicy()
    {
        // Arrange
        var type = typeof(AuthController);

        // Act
        var attribute = type.GetCustomAttribute<EnableRateLimitingAttribute>();

        // Assert
        attribute.Should().NotBeNull();
        attribute!.PolicyName.Should().Be("auth");
    }

    [Fact]
    public void ExamsController_UploadExam_ShouldHaveEnableRateLimitingAttributeWithUploadPolicy()
    {
        // Arrange
        var method = typeof(ExamsController).GetMethod(nameof(ExamsController.UploadExam));

        // Act
        var attribute = method?.GetCustomAttribute<EnableRateLimitingAttribute>();

        // Assert
        attribute.Should().NotBeNull();
        attribute!.PolicyName.Should().Be("upload");
    }
}
