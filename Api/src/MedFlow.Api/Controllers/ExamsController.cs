using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MedFlow.Domain.Enums;
using MedFlow.Application.Features.Exams.Commands.UploadExam;
using MedFlow.Application.Features.Exams.Commands.EmitReport;
using MedFlow.Application.Features.Exams.Queries.GetExams;

namespace MedFlow.Api.Controllers;

public class ExamsController : ApiControllerBase
{
    [HttpPost("upload")]
    [Authorize(Roles = "ATTENDANT")]
    [EnableRateLimiting("upload")]
    public async Task<IActionResult> UploadExam([FromBody] UploadExamCommand command, CancellationToken cancellationToken)
    {
        var result = await Sender.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetExams(CancellationToken cancellationToken)
    {
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value;
        
        if (string.IsNullOrEmpty(roleClaim) || !Enum.TryParse<UserRole>(roleClaim, true, out var userRole))
        {
            return BadRequest("O perfil do usuário é inválido ou não foi encontrado.");
        }

        var result = await Sender.Send(new GetExamsQuery(userRole), cancellationToken);
        return Ok(result);
    }
    
    [HttpPost("{id}/report")]
    [Authorize(Roles = "DOCTOR")]
    public async Task<IActionResult> SubmitReport(Guid id, [FromBody] SubmitReportRequest request, CancellationToken cancellationToken)
    {
        var command = new EmitReportCommand(id, request.Report);
        await Sender.Send(command, cancellationToken);
        return NoContent();
    }
}

public record SubmitReportRequest(string Report);
