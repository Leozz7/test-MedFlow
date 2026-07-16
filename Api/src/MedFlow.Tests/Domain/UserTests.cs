using System;
using Xunit;
using FluentAssertions;
using MedFlow.Domain.Entities;
using MedFlow.Domain.Enums;
using MedFlow.Domain.Exceptions;

namespace MedFlow.Tests.Domain;

public class UserTests
{
    [Fact]
    public void Constructor_WithValidParameters_ShouldCreateUser()
    {
        // Arrange
        var name = "Dr. John Doe";
        var email = "john.doe@medflow.com";
        var passwordHash = "hashedpassword123";
        var role = UserRole.DOCTOR;

        // Act
        var user = new User(name, email, passwordHash, role);

        // Assert
        user.Should().NotBeNull();
        user.Id.Should().NotBeEmpty();
        user.Name.Should().Be(name);
        user.Email.Should().Be(email);
        user.PasswordHash.Should().Be(passwordHash);
        user.Role.Should().Be(role);
        user.Created.Should().BeBefore(DateTime.UtcNow.AddSeconds(1));
    }

    [Theory]
    [InlineData("", "john@medflow.com", "hash")]
    [InlineData("   ", "john@medflow.com", "hash")]
    [InlineData(null, "john@medflow.com", "hash")]
    public void Constructor_WithInvalidName_ShouldThrowDomainException(string? name, string email, string passwordHash)
    {
        // Act
        Action act = () => new User(name!, email, passwordHash, UserRole.ATTENDANT);

        // Assert
        act.Should().Throw<DomainException>()
            .WithMessage("O nome não pode ser vazio.");
    }

    [Theory]
    [InlineData("John Doe", "", "hash")]
    [InlineData("John Doe", "   ", "hash")]
    [InlineData("John Doe", null, "hash")]
    public void Constructor_WithInvalidEmail_ShouldThrowDomainException(string name, string? email, string passwordHash)
    {
        // Act
        Action act = () => new User(name, email!, passwordHash, UserRole.ATTENDANT);

        // Assert
        act.Should().Throw<DomainException>()
            .WithMessage("O e-mail não pode ser vazio.");
    }

    [Theory]
    [InlineData("John Doe", "john@medflow.com", "")]
    [InlineData("John Doe", "john@medflow.com", "   ")]
    [InlineData("John Doe", "john@medflow.com", null)]
    public void Constructor_WithInvalidPasswordHash_ShouldThrowDomainException(string name, string email, string? passwordHash)
    {
        // Act
        Action act = () => new User(name, email, passwordHash!, UserRole.ATTENDANT);

        // Assert
        act.Should().Throw<DomainException>()
            .WithMessage("A senha não pode ser vazia.");
    }

    [Fact]
    public void UpdatePassword_WithValidPassword_ShouldUpdatePasswordHash()
    {
        // Arrange
        var user = new User("John Doe", "john@medflow.com", "oldhash", UserRole.ATTENDANT);
        var newHash = "newhash123";

        // Act
        user.UpdatePassword(newHash);

        // Assert
        user.PasswordHash.Should().Be(newHash);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void UpdatePassword_WithInvalidPassword_ShouldThrowDomainException(string? newHash)
    {
        // Arrange
        var user = new User("John Doe", "john@medflow.com", "oldhash", UserRole.ATTENDANT);

        // Act
        Action act = () => user.UpdatePassword(newHash!);

        // Assert
        act.Should().Throw<DomainException>()
            .WithMessage("A nova senha não pode ser vazia.");
    }

    [Fact]
    public void Update_WithValidParameters_ShouldUpdateUserProperties()
    {
        // Arrange
        var user = new User("John Doe", "john@medflow.com", "hash", UserRole.ATTENDANT);
        var newName = "Jane Doe";
        var newEmail = "jane@medflow.com";
        var newRole = UserRole.DOCTOR;

        // Act
        user.Update(newName, newEmail, newRole);

        // Assert
        user.Name.Should().Be(newName);
        user.Email.Should().Be(newEmail);
        user.Role.Should().Be(newRole);
    }

    [Theory]
    [InlineData("", "jane@medflow.com")]
    [InlineData("   ", "jane@medflow.com")]
    [InlineData(null, "jane@medflow.com")]
    public void Update_WithInvalidName_ShouldThrowDomainException(string? name, string email)
    {
        // Arrange
        var user = new User("John Doe", "john@medflow.com", "hash", UserRole.ATTENDANT);

        // Act
        Action act = () => user.Update(name!, email, UserRole.DOCTOR);

        // Assert
        act.Should().Throw<DomainException>()
            .WithMessage("O nome não pode ser vazio.");
    }

    [Theory]
    [InlineData("Jane Doe", "")]
    [InlineData("Jane Doe", "   ")]
    [InlineData("Jane Doe", null)]
    public void Update_WithInvalidEmail_ShouldThrowDomainException(string name, string? email)
    {
        // Arrange
        var user = new User("John Doe", "john@medflow.com", "hash", UserRole.ATTENDANT);

        // Act
        Action act = () => user.Update(name, email!, UserRole.DOCTOR);

        // Assert
        act.Should().Throw<DomainException>()
            .WithMessage("O e-mail não pode ser vazio.");
    }
}
