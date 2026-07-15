using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MedFlow.Domain.Entities;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Application.Interfaces.Auth;

namespace MedFlow.Application.Features.Users.Commands.CreateUser;

public class CreateUserHandler : IRequestHandler<CreateUserCommand, Guid>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public CreateUserHandler(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<Guid> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var emailExists = await _userRepository.ExistsByEmailAsync(request.Email, cancellationToken);
        if (emailExists)
        {
            // Poderíamos lançar uma CustomException de Application, mas simplificaremos
            throw new Exception("O e-mail informado já está em uso.");
        }

        var passwordHash = _passwordHasher.HashPassword(request.Password);

        var user = new User(request.Name, request.Email, passwordHash, request.Role);

        _userRepository.Add(user);
        await _userRepository.SaveChangesAsync(cancellationToken);

        return user.Id;
    }
}
