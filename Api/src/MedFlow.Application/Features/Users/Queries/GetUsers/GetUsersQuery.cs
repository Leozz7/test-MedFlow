using System.Collections.Generic;
using MediatR;
using MedFlow.Application.Features.Users.DTOs;

namespace MedFlow.Application.Features.Users.Queries.GetUsers;

public record GetUsersQuery() : IRequest<IEnumerable<UserDto>>;
