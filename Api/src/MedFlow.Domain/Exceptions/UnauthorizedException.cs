namespace MedFlow.Domain.Exceptions;

public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message = "E-mail ou senha incorretos.") : base(message)
    {
    }
}
