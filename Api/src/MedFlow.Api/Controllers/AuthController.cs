using MedFlow.Application.Features.Users.Commands.Login;
using MedFlow.Application.Features.Users.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedFlow.Api.Controllers;

[Route("api/auth")]
public class AuthController : ApiControllerBase
{
    /// <summary>
    /// Autentica o usuário e retorna um JWT.
    /// POST /api/auth/login
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var token = await Sender.Send(
            new LoginQuery(request.Email, request.Password),
            cancellationToken);

        return Ok(new LoginResponseDto(token));
    }
}

/// <summary>Request body do endpoint de login.</summary>
public sealed record LoginRequest(string Email, string Password);
