namespace MedFlow.Domain.Exceptions;

/// <summary>
/// Lançada quando um recurso solicitado não existe na base de dados. → HTTP 404
/// </summary>
public class NotFoundException : Exception
{
    public NotFoundException(string resourceName, object key)
        : base($"'{resourceName}' com identificador '{key}' não foi encontrado.")
    {
    }

    public NotFoundException(string message) : base(message)
    {
    }
}
