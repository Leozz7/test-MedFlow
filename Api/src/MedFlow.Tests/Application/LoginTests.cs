using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using NSubstitute;
using FluentAssertions;
using MedFlow.Application.Features.Users.Commands.Login;
using MedFlow.Application.Interfaces.Auth;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Domain.Entities;
using MedFlow.Domain.Enums;
using MedFlow.Domain.Exceptions;

namespace MedFlow.Tests.Application;

public class LoginTests
{
    private readonly IUserRepository _userRepository = Substitute.For<IUserRepository>();
    private readonly IPasswordHasher _passwordHasher = Substitute.For<IPasswordHasher>();
    private readonly ITokenService _tokenService = Substitute.For<ITokenService>();
    private readonly LoginHandler _handler;
    private readonly LoginValidator _validator;

    public LoginTests()
    {
        _handler = new LoginHandler(_userRepository, _passwordHasher, _tokenService);
        _validator = new LoginValidator();
    }

    #region Handler Tests

    [Fact]
    public async Task Handler_WithNonExistingEmail_ShouldThrowUnauthorizedException()
    {
        // Arrange
        var query = new LoginQuery("notfound@medflow.com", "password123");
        _userRepository.GetByEmailAsync(query.Email, Arg.Any<CancellationToken>())
            .Returns((User?)null);

        // Act
        Func<Task> act = async () => await _handler.Handle(query, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedException>();
        _passwordHasher.DidNotReceive().VerifyPassword(Arg.Any<string>(), Arg.Any<string>());
        _tokenService.DidNotReceive().GenerateToken(Arg.Any<User>());
    }

    [Fact]
    public async Task Handler_WithIncorrectPassword_ShouldThrowUnauthorizedException()
    {
        // Arrange
        var query = new LoginQuery("john@medflow.com", "wrongpassword");
        var user = new User("John Doe", query.Email, "correcthash", UserRole.DOCTOR);
        
        _userRepository.GetByEmailAsync(query.Email, Arg.Any<CancellationToken>())
            .Returns(user);
        _passwordHasher.VerifyPassword(query.Password, user.PasswordHash)
            .Returns(false);

        // Act
        Func<Task> act = async () => await _handler.Handle(query, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedException>();
        _passwordHasher.Received(1).VerifyPassword(query.Password, user.PasswordHash);
        _tokenService.DidNotReceive().GenerateToken(Arg.Any<User>());
    }

    [Fact]
    public async Task Handler_WithValidCredentials_ShouldReturnJwtToken()
    {
        // Arrange
        var query = new LoginQuery("john@medflow.com", "correctpassword");
        var user = new User("John Doe", query.Email, "correcthash", UserRole.DOCTOR);
        var expectedToken = "jwt.token.here";

        _userRepository.GetByEmailAsync(query.Email, Arg.Any<CancellationToken>())
            .Returns(user);
        _passwordHasher.VerifyPassword(query.Password, user.PasswordHash)
            .Returns(true);
        _tokenService.GenerateToken(user).Returns(expectedToken);

        // Act
        var token = await _handler.Handle(query, CancellationToken.None);

        // Assert
        token.Should().Be(expectedToken);
        _passwordHasher.Received(1).VerifyPassword(query.Password, user.PasswordHash);
        _tokenService.Received(1).GenerateToken(user);
    }

    #endregion

    #region Validator Tests

    [Fact]
    public void Validator_WithValidQuery_ShouldBeValid()
    {
        // Arrange
        var query = new LoginQuery("john@medflow.com", "password123");

        // Act
        var result = _validator.Validate(query);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validator_WithEmptyEmail_ShouldHaveValidationError(string? email)
    {
        // Arrange
        var query = new LoginQuery(email!, "password123");

        // Act
        var result = _validator.Validate(query);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Email" && e.ErrorMessage == "O e-mail é obrigatório.");
    }

    [Theory]
    [InlineData("invalid-email")]
    [InlineData("invalid@")]
    public void Validator_WithInvalidEmailFormat_ShouldHaveValidationError(string email)
    {
        // Arrange
        var query = new LoginQuery(email, "password123");

        // Act
        var result = _validator.Validate(query);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Email" && e.ErrorMessage == "O formato do e-mail é inválido.");
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validator_WithEmptyPassword_ShouldHaveValidationError(string? password)
    {
        // Arrange
        var query = new LoginQuery("john@medflow.com", password!);

        // Act
        var result = _validator.Validate(query);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Password" && e.ErrorMessage == "A senha é obrigatória.");
    }

    #endregion
}
