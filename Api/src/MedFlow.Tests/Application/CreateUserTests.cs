using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using NSubstitute;
using FluentAssertions;
using FluentValidation.Results;
using MedFlow.Application.Features.Users.Commands.CreateUser;
using MedFlow.Application.Interfaces.Auth;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Domain.Entities;
using MedFlow.Domain.Enums;
using MedFlow.Domain.Exceptions;

namespace MedFlow.Tests.Application;

public class CreateUserTests
{
    private readonly IUserRepository _userRepository = Substitute.For<IUserRepository>();
    private readonly IPasswordHasher _passwordHasher = Substitute.For<IPasswordHasher>();
    private readonly CreateUserHandler _handler;
    private readonly CreateUserValidator _validator;

    public CreateUserTests()
    {
        _handler = new CreateUserHandler(_userRepository, _passwordHasher);
        _validator = new CreateUserValidator();
    }

    #region Handler Tests

    [Fact]
    public async Task Handler_WithExistingEmail_ShouldThrowConflictException()
    {
        // Arrange
        var command = new CreateUserCommand("John Doe", "john@medflow.com", "password123", UserRole.DOCTOR);
        _userRepository.ExistsByEmailAsync(command.Email, Arg.Any<CancellationToken>())
            .Returns(true);

        // Act
        Func<Task> act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<ConflictException>()
            .WithMessage("O e-mail informado já está em uso.");

        _passwordHasher.DidNotReceive().HashPassword(Arg.Any<string>());
        _userRepository.DidNotReceive().Add(Arg.Any<User>());
        await _userRepository.DidNotReceive().SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handler_WithValidNewUser_ShouldHashPasswordAddUserAndSave()
    {
        // Arrange
        var command = new CreateUserCommand("John Doe", "john@medflow.com", "password123", UserRole.DOCTOR);
        var passwordHash = "hashed_password_123";

        _userRepository.ExistsByEmailAsync(command.Email, Arg.Any<CancellationToken>())
            .Returns(false);
        _passwordHasher.HashPassword(command.Password).Returns(passwordHash);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeEmpty();

        _passwordHasher.Received(1).HashPassword(command.Password);
        _userRepository.Received(1).Add(Arg.Is<User>(u =>
            u.Name == command.Name &&
            u.Email == command.Email &&
            u.PasswordHash == passwordHash &&
            u.Role == command.Role));
        await _userRepository.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    #endregion

    #region Validator Tests

    [Fact]
    public void Validator_WithValidCommand_ShouldBeValid()
    {
        // Arrange
        var command = new CreateUserCommand("John Doe", "john@medflow.com", "password123", UserRole.DOCTOR);

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Validator_WithEmptyName_ShouldHaveValidationError(string? name)
    {
        // Arrange
        var command = new CreateUserCommand(name!, "john@medflow.com", "password123", UserRole.DOCTOR);

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name" && e.ErrorMessage == "O nome é obrigatório.");
    }

    [Fact]
    public void Validator_WithNameTooLong_ShouldHaveValidationError()
    {
        // Arrange
        var name = new string('A', 151);
        var command = new CreateUserCommand(name, "john@medflow.com", "password123", UserRole.DOCTOR);

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name" && e.ErrorMessage == "O nome não pode exceder 150 caracteres.");
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validator_WithEmptyEmail_ShouldHaveValidationError(string? email)
    {
        // Arrange
        var command = new CreateUserCommand("John Doe", email!, "password123", UserRole.DOCTOR);

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Email" && e.ErrorMessage == "O e-mail é obrigatório.");
    }

    [Theory]
    [InlineData("invalid-email")]
    [InlineData("invalid@")]
    [InlineData("@invalid.com")]
    public void Validator_WithInvalidEmailFormat_ShouldHaveValidationError(string email)
    {
        // Arrange
        var command = new CreateUserCommand("John Doe", email, "password123", UserRole.DOCTOR);

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Email" && e.ErrorMessage == "O e-mail fornecido não é válido.");
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validator_WithEmptyPassword_ShouldHaveValidationError(string? password)
    {
        // Arrange
        var command = new CreateUserCommand("John Doe", "john@medflow.com", password!, UserRole.DOCTOR);

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Password" && e.ErrorMessage == "A senha é obrigatória.");
    }

    [Fact]
    public void Validator_WithPasswordTooShort_ShouldHaveValidationError()
    {
        // Arrange
        var command = new CreateUserCommand("John Doe", "john@medflow.com", "12345", UserRole.DOCTOR);

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Password" && e.ErrorMessage == "A senha deve ter pelo menos 6 caracteres.");
    }

    [Fact]
    public void Validator_WithInvalidRoleValue_ShouldHaveValidationError()
    {
        // Arrange
        var command = new CreateUserCommand("John Doe", "john@medflow.com", "password123", (UserRole)99);

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Role" && e.ErrorMessage == "O perfil do usuário é inválido.");
    }

    #endregion
}
