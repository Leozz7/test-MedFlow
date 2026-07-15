using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedFlow.Api.Controllers;

public class ExamsController : ApiControllerBase
{
    [HttpPost("upload")]
    [Authorize(Roles = "ATTENDANT")]
    public Task<IActionResult> UploadExam(CancellationToken cancellationToken)
    {
        return Task.FromResult<IActionResult>(StatusCode(StatusCodes.Status501NotImplemented, "Exam Upload is not implemented yet."));
    }

    [HttpGet]
    [Authorize]
    public Task<IActionResult> GetExams(CancellationToken cancellationToken)
    {
        return Task.FromResult<IActionResult>(StatusCode(StatusCodes.Status501NotImplemented, "Get Exams is not implemented yet."));
    }
    
    [HttpPost("{id}/report")]
    [Authorize(Roles = "DOCTOR")]
    public Task<IActionResult> SubmitReport(Guid id, CancellationToken cancellationToken)
    {
        return Task.FromResult<IActionResult>(StatusCode(StatusCodes.Status501NotImplemented, "Submit Report is not implemented yet."));
    }
}
