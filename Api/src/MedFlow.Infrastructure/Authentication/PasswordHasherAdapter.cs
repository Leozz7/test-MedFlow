using MedFlow.Application.Interfaces.Auth;

namespace MedFlow.Infrastructure.Authentication;

/// <summary>
/// Adaptador que conecta o <see cref="MedFlow.Application.Common.Security.PasswordHasher"/> (Argon2id)
/// à interface <see cref="IPasswordHasher"/> esperada pela camada Application.
/// </summary>
public sealed class PasswordHasherAdapter : IPasswordHasher
{
    private readonly MedFlow.Application.Common.Security.IPasswordHasher _inner;

    public PasswordHasherAdapter(MedFlow.Application.Common.Security.IPasswordHasher inner)
    {
        _inner = inner;
    }

    public string HashPassword(string password) => _inner.Hash(password);

    public bool VerifyPassword(string password, string hash)
    {
        return _inner.Verify(password, hash, out _);
    }
}
