using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MedFlow.Application.Interfaces.Auth;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Domain.Exceptions;

namespace MedFlow.Application.Features.Users.Commands.Login;

public class LoginHandler : IRequestHandler<LoginQuery, string>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public LoginHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<string> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        // RN01 – buscar usuário pelo e-mail
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        // RN02 – mensagem genérica para não revelar se o e-mail existe
        if (user is null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedException();
        }

        // RN03/RN04 – gerar token JWT com claims sub, email, role
        var token = _tokenService.GenerateToken(user);

        return token;
    }
}
