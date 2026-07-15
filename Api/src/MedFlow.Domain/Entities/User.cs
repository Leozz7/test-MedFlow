using System;
using MedFlow.Domain.Common;
using MedFlow.Domain.Enums;
using MedFlow.Domain.Exceptions;

namespace MedFlow.Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; private set; }
    public string Email { get; private set; }
    public string PasswordHash { get; private set; }
    public UserRole Role { get; private set; }

    // Construtor vazio para o EF Core
    protected User() { }

    public User(string name, string email, string passwordHash, UserRole role)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("O nome não pode ser vazio.");

        if (string.IsNullOrWhiteSpace(email))
            throw new DomainException("O e-mail não pode ser vazio.");

        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new DomainException("A senha não pode ser vazia.");

        Name = name;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
    }

    public void UpdatePassword(string newPasswordHash)
    {
        if (string.IsNullOrWhiteSpace(newPasswordHash))
            throw new DomainException("A nova senha não pode ser vazia.");

        PasswordHash = newPasswordHash;
    }
}