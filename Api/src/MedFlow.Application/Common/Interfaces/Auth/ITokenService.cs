using MedFlow.Domain.Entities;

namespace MedFlow.Application.Interfaces.Auth;

public interface ITokenService
{
    string GenerateToken(User user);
}
