using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using NSubstitute;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using MedFlow.Api.Controllers;
using MedFlow.Domain.Enums;
using MedFlow.Application.Features.Exams.Commands.UploadExam;
using MedFlow.Application.Features.Exams.Commands.EmitReport;
using MedFlow.Application.Features.Exams.Queries.GetExams;
using MedFlow.Application.Features.Exams.DTOs;

namespace MedFlow.Tests.Api;

public class ExamsControllerTests
{
    private readonly ISender _sender = Substitute.For<ISender>();
    private readonly ExamsController _controller;
    private readonly DefaultHttpContext _httpContext;

    public ExamsControllerTests()
    {
        _controller = new ExamsController();
        _httpContext = new DefaultHttpContext();

        var serviceProvider = Substitute.For<IServiceProvider>();
        serviceProvider.GetService(typeof(ISender)).Returns(_sender);
        _httpContext.RequestServices = serviceProvider;

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = _httpContext
        };
    }

    [Fact]
    public async Task UploadExam_WithValidCommand_ShouldSendAndReturnOk()
    {
        // Arrange
        var command = new UploadExamCommand("xray.pdf");
        var expectedId = Guid.NewGuid();
        _sender.Send(command, Arg.Any<CancellationToken>()).Returns(expectedId);

        // Act
        var result = await _controller.UploadExam(command, CancellationToken.None);

        // Assert
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().Be(expectedId);
        await _sender.Received(1).Send(command, Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task GetExams_WithAttendantUser_ShouldSendQueryWithAttendantRoleAndReturnOk()
    {
        // Arrange
        var identity = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Role, "ATTENDANT")
        }, "TestAuth");
        _httpContext.User = new ClaimsPrincipal(identity);

        var expectedExams = new List<ExamDto>
        {
            new() { Id = Guid.NewGuid(), FileName = "exam.pdf", Status = ExamStatus.PENDING }
        };

        _sender.Send(Arg.Is<GetExamsQuery>(q => q.UserRole == UserRole.ATTENDANT), Arg.Any<CancellationToken>())
            .Returns(expectedExams);

        // Act
        var result = await _controller.GetExams(CancellationToken.None);

        // Assert
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().BeEquivalentTo(expectedExams);

        await _sender.Received(1).Send(
            Arg.Is<GetExamsQuery>(q => q.UserRole == UserRole.ATTENDANT),
            Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task GetExams_WithDoctorUser_ShouldSendQueryWithDoctorRoleAndReturnOk()
    {
        // Arrange
        var identity = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Role, "DOCTOR")
        }, "TestAuth");
        _httpContext.User = new ClaimsPrincipal(identity);

        var expectedExams = new List<ExamDto>
        {
            new() { Id = Guid.NewGuid(), FileName = "exam.pdf", Status = ExamStatus.DONE }
        };

        _sender.Send(Arg.Is<GetExamsQuery>(q => q.UserRole == UserRole.DOCTOR), Arg.Any<CancellationToken>())
            .Returns(expectedExams);

        // Act
        var result = await _controller.GetExams(CancellationToken.None);

        // Assert
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().BeEquivalentTo(expectedExams);

        await _sender.Received(1).Send(
            Arg.Is<GetExamsQuery>(q => q.UserRole == UserRole.DOCTOR),
            Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task GetExams_WithMissingRoleClaim_ShouldReturnBadRequest()
    {
        // Arrange
        _httpContext.User = new ClaimsPrincipal(new ClaimsIdentity());

        // Act
        var result = await _controller.GetExams(CancellationToken.None);

        // Assert
        var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
        badRequestResult.Value.Should().Be("O perfil do usuário é inválido ou não foi encontrado.");

        await _sender.DidNotReceive().Send(Arg.Any<GetExamsQuery>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task SubmitReport_WithValidRequest_ShouldSendEmitReportCommandAndReturnNoContent()
    {
        // Arrange
        var examId = Guid.NewGuid();
        var request = new SubmitReportRequest("This is a valid report description.");

        // Act
        var result = await _controller.SubmitReport(examId, request, CancellationToken.None);

        // Assert
        result.Should().BeOfType<NoContentResult>();
        await _sender.Received(1).Send(
            Arg.Is<EmitReportCommand>(c => c.ExamId == examId && c.Report == request.Report),
            Arg.Any<CancellationToken>());
    }
}
