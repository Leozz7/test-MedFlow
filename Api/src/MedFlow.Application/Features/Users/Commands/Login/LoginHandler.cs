using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MedFlow.Application.Interfaces.Auth;
using MedFlow.Application.Interfaces.Repositories;

namespace MedFlow.Application.Features.Users.Commands.Login;

public class LoginHandler : IRequestHandler<LoginQuery, string>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public LoginHandler(IUserRepository userRepository, IPasswordHasher passwordHasher, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<string> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new Exception("E-mail ou senha inválidos.");
        }

        var token = _tokenService.GenerateToken(user);

        return token;
    }
}
