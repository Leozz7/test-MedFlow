using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MedFlow.Application.Features.Users.Commands.UpdateUser;
using MedFlow.Application.Features.Users.Commands.DeleteUser;
using MedFlow.Application.Features.Users.Queries.GetUsers;
using MedFlow.Application.Features.Users.Queries.GetUserById;

namespace MedFlow.Api.Controllers;

public class UsersController : ApiControllerBase
{
    [HttpGet]
    // [Authorize(Roles = "Admin, ATTENDANT")]
    public async Task<IActionResult> GetUsers(CancellationToken cancellationToken)
    {
        var result = await Sender.Send(new GetUsersQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserCommand command, CancellationToken cancellationToken)
    {
        var result = await Sender.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetUserById(Guid id, CancellationToken cancellationToken)
    {
        var result = await Sender.Send(new GetUserByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequest("The ID in the route must match the ID in the body.");
        }

        var result = await Sender.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    // [Authorize]
    public async Task<IActionResult> DeleteUser(Guid id, CancellationToken cancellationToken)
    {
        await Sender.Send(new DeleteUserCommand(id), cancellationToken);
        return NoContent();
    }
}
