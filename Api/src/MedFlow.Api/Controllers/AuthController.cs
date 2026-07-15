using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MedFlow.Application.Features.Users.Commands.CreateUser;

namespace MedFlow.Api.Controllers;

public class AuthController : ApiControllerBase
{

    [HttpPost("login")]
    [AllowAnonymous]
    public Task<IActionResult> Login(CancellationToken cancellationToken)
    {
        return Task.FromResult<IActionResult>(StatusCode(StatusCodes.Status501NotImplemented, "Login is not implemented yet."));
    }
}
