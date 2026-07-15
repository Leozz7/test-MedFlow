using System;
using MediatR;
using MedFlow.Domain.Enums;

namespace MedFlow.Application.Features.Users.Commands.CreateUser;

public record CreateUserCommand(string Name, string Email, string Password, UserRole Role) : IRequest<Guid>;
