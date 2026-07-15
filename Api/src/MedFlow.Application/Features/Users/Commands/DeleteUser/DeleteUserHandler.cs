using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Domain.Exceptions;

namespace MedFlow.Application.Features.Users.Commands.DeleteUser;

public class DeleteUserHandler : IRequestHandler<DeleteUserCommand>
{
    private readonly IUserRepository _userRepository;

    public DeleteUserHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken);
        if (user == null)
            throw new DomainException($"User with id {request.Id} not found.");

        _userRepository.Remove(user);
        await _userRepository.SaveChangesAsync(cancellationToken);
    }
}
