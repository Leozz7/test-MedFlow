using System;
using MediatR;
using MedFlow.Application.Features.Users.DTOs;
using MedFlow.Domain.Enums;

namespace MedFlow.Application.Features.Users.Commands.UpdateUser;

public record UpdateUserCommand(
    Guid Id,
    string Name,
    string Email,
    UserRole Role) : IRequest<UserDto>;
