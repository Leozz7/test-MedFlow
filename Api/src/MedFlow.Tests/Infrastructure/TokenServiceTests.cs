using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using Xunit;
using NSubstitute;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using MedFlow.Infrastructure.Authentication;
using MedFlow.Domain.Entities;
using MedFlow.Domain.Enums;

namespace MedFlow.Tests.Infrastructure;

public class TokenServiceTests
{
    private readonly IConfiguration _configuration = Substitute.For<IConfiguration>();

    public TokenServiceTests()
    {
        // 32-character key for HMAC-SHA256
        _configuration["Jwt:Key"].Returns("super_secret_key_123_456_789_000");
        _configuration["Jwt:Issuer"].Returns("MedFlow");
        _configuration["Jwt:Audience"].Returns("MedFlowUsers");
        _configuration["Jwt:ExpirationHours"].Returns("3");
    }

    [Fact]
    public void Constructor_WithMissingKey_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var config = Substitute.For<IConfiguration>();
        config["Jwt:Key"].Returns((string?)null);

        // Act
        Action act = () => new TokenService(config);

        // Assert
        act.Should().Throw<InvalidOperationException>()
            .WithMessage("Jwt:Key não está configurado.");
    }

    [Fact]
    public void Constructor_WithMissingIssuer_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var config = Substitute.For<IConfiguration>();
        config["Jwt:Key"].Returns("some_key");
        config["Jwt:Issuer"].Returns((string?)null);

        // Act
        Action act = () => new TokenService(config);

        // Assert
        act.Should().Throw<InvalidOperationException>()
            .WithMessage("Jwt:Issuer não está configurado.");
    }

    [Fact]
    public void Constructor_WithMissingAudience_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var config = Substitute.For<IConfiguration>();
        config["Jwt:Key"].Returns("some_key");
        config["Jwt:Issuer"].Returns("some_issuer");
        config["Jwt:Audience"].Returns((string?)null);

        // Act
        Action act = () => new TokenService(config);

        // Assert
        act.Should().Throw<InvalidOperationException>()
            .WithMessage("Jwt:Audience não está configurado.");
    }

    [Fact]
    public void GenerateToken_WithValidUser_ShouldReturnValidJwtWithCorrectClaims()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);
        var user = new User("Dr. Robert", "robert@medflow.com", "hash", UserRole.DOCTOR);

        // Act
        var tokenString = tokenService.GenerateToken(user);

        // Assert
        tokenString.Should().NotBeNullOrWhiteSpace();

        var handler = new JwtSecurityTokenHandler();
        handler.CanReadToken(tokenString).Should().BeTrue();

        var jwtToken = handler.ReadJwtToken(tokenString);

        // Verify standard claims
        jwtToken.Issuer.Should().Be("MedFlow");
        jwtToken.Audiences.Should().Contain("MedFlowUsers");
        jwtToken.ValidTo.Should().BeAfter(DateTime.UtcNow.AddHours(2.9));
        jwtToken.ValidTo.Should().BeBefore(DateTime.UtcNow.AddHours(3.1));

        // Verify custom claims (sub, email, role)
        var subClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
        subClaim.Should().Be(user.Id.ToString());

        var emailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Email)?.Value;
        emailClaim.Should().Be(user.Email);

        var roleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "role")?.Value;
        roleClaim.Should().Be("DOCTOR");
    }
}
