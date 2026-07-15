using System;
using MediatR;

namespace MedFlow.Application.Features.Users.Commands.DeleteUser;

public record DeleteUserCommand(Guid Id) : IRequest;
