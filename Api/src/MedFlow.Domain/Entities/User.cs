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
#pragma warning disable CS8618
    protected User() { }
#pragma warning restore CS8618

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

    public void Update(string name, string email, UserRole role)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("O nome não pode ser vazio.");

        if (string.IsNullOrWhiteSpace(email))
            throw new DomainException("O e-mail não pode ser vazio.");

        Name = name;
        Email = email;
        Role = role;
    }
}