using MediatR;

namespace MedFlow.Application.Features.Users.Commands.Login;

public record LoginQuery(string Email, string Password) : IRequest<string>;
