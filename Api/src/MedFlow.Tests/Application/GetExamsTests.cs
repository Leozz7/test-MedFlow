using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using NSubstitute;
using FluentAssertions;
using MedFlow.Application.Features.Exams.Queries.GetExams;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Domain.Entities;
using MedFlow.Domain.Enums;

namespace MedFlow.Tests.Application;

public class GetExamsTests
{
    private readonly IExamRepository _examRepository = Substitute.For<IExamRepository>();
    private readonly GetExamsHandler _handler;

    public GetExamsTests()
    {
        _handler = new GetExamsHandler(_examRepository);
    }

    [Fact]
    public async Task Handler_WithDoctorRole_ShouldQueryOnlyDoneAndReportedExams()
    {
        // Arrange
        var query = new GetExamsQuery(UserRole.DOCTOR);
        
        var doneExam1 = new MedicalExam("exam1.pdf");
        doneExam1.StartProcessing();
        doneExam1.CompleteProcessing("result 1");
        
        var doneExam2 = new MedicalExam("exam2.pdf");
        doneExam2.StartProcessing();
        doneExam2.CompleteProcessing("result 2");

        var pendingExam = new MedicalExam("exam3.pdf");

        var reportedExam = new MedicalExam("exam4.pdf");
        reportedExam.StartProcessing();
        reportedExam.CompleteProcessing("result 4");
        reportedExam.EmitReport("this is a report");

        var databaseExams = new List<MedicalExam> { doneExam1, doneExam2, pendingExam, reportedExam };
        _examRepository.GetAllAsync(Arg.Any<CancellationToken>())
            .Returns(databaseExams);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().HaveCount(3);
        result.Select(dto => dto.FileName).Should().Contain(new[] { "exam1.pdf", "exam2.pdf", "exam4.pdf" });
        result.Select(dto => dto.FileName).Should().NotContain("exam3.pdf");

        await _examRepository.Received(1).GetAllAsync(Arg.Any<CancellationToken>());
        await _examRepository.DidNotReceive().GetByStatusAsync(Arg.Any<ExamStatus>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handler_WithAttendantRole_ShouldQueryAllExams()
    {
        // Arrange
        var query = new GetExamsQuery(UserRole.ATTENDANT);
        
        var pendingExam = new MedicalExam("exam1.pdf");
        
        var doneExam = new MedicalExam("exam2.pdf");
        doneExam.StartProcessing();
        doneExam.CompleteProcessing("result 2");
        
        var errorExam = new MedicalExam("exam3.pdf");
        errorExam.StartProcessing();
        errorExam.FailProcessing("error 3");

        var expectedExams = new List<MedicalExam> { pendingExam, doneExam, errorExam };
        _examRepository.GetAllAsync(Arg.Any<CancellationToken>())
            .Returns(expectedExams);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().HaveCount(3);
        result.Select(dto => dto.FileName).Should().Contain(new[] { "exam1.pdf", "exam2.pdf", "exam3.pdf" });

        await _examRepository.Received(1).GetAllAsync(Arg.Any<CancellationToken>());
        await _examRepository.DidNotReceive().GetByStatusAsync(Arg.Any<ExamStatus>(), Arg.Any<CancellationToken>());
    }
}
