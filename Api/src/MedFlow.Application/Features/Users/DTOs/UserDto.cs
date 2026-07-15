using System;
using MedFlow.Domain.Enums;

namespace MedFlow.Application.Features.Users.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public UserRole Role { get; set; }
}
