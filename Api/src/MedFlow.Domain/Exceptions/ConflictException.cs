namespace MedFlow.Domain.Exceptions;

/// <summary>
/// Lançada quando há conflito de estado (ex: e-mail já cadastrado, recurso duplicado). → HTTP 409
/// </summary>
public class ConflictException : Exception
{
    public ConflictException(string message) : base(message)
    {
    }
}
