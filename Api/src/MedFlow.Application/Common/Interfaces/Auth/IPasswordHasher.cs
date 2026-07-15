namespace MedFlow.Application.Interfaces.Auth;

/// <summary>
/// Abstração de hashing de senhas usada pela camada Application.
/// A implementação concreta (Argon2id) vive na Infrastructure.
/// </summary>
public interface IPasswordHasher
{
    /// <summary>Gera o hash da senha plain-text.</summary>
    string HashPassword(string password);

    /// <summary>
    /// Verifica se a senha plain-text corresponde ao hash armazenado.
    /// </summary>
    /// <param name="password">Senha plain-text informada pelo usuário.</param>
    /// <param name="hash">Hash armazenado no banco de dados.</param>
    /// <returns>True se as credenciais forem válidas.</returns>
    bool VerifyPassword(string password, string hash);
}
