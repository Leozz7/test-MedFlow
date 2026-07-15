using System;
using MediatR;
using MedFlow.Application.Features.Users.DTOs;

namespace MedFlow.Application.Features.Users.Queries.GetUserById;

public record GetUserByIdQuery(Guid Id) : IRequest<UserDto>;
