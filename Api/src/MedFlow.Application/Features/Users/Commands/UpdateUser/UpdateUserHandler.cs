using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Application.Features.Users.DTOs;
using MedFlow.Domain.Exceptions;

namespace MedFlow.Application.Features.Users.Commands.UpdateUser;

public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, UserDto>
{
    private readonly IUserRepository _userRepository;

    public UpdateUserHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken);
        if (user == null)
            throw new DomainException($"User with id {request.Id} not found.");

        // Atualiza as propriedades. NOTA: em um sistema real poderíamos permitir alterar apenas propriedades específicas
        // Aqui atualizaremos apenas os metadados (como não temos setters publicos, em teoria deveríamos ter um método no User para update)
        // Oops, Clean Architecture: O entity User não possui setters. Vamos criar um método Update(name, email, role) na Entity!
        user.Update(request.Name, request.Email, request.Role);

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync(cancellationToken);

        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role
        };
    }
}
