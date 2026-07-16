using System;
using Xunit;
using FluentAssertions;
using MedFlow.Domain.Entities;
using MedFlow.Domain.Enums;
using MedFlow.Domain.Exceptions;

namespace MedFlow.Tests.Domain;

public class MedicalExamTests
{
    [Fact]
    public void Constructor_WithValidFileName_ShouldCreateMedicalExamInPendingStatus()
    {
        // Arrange
        var fileName = "xray_chest.pdf";

        // Act
        var exam = new MedicalExam(fileName);

        // Assert
        exam.Should().NotBeNull();
        exam.Id.Should().NotBeEmpty();
        exam.FileName.Should().Be(fileName);
        exam.Status.Should().Be(ExamStatus.PENDING);
        exam.ProcessingResult.Should().BeNull();
        exam.Report.Should().BeNull();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Constructor_WithInvalidFileName_ShouldThrowDomainException(string? fileName)
    {
        // Act
        Action act = () => new MedicalExam(fileName!);

        // Assert
        act.Should().Throw<DomainException>()
            .WithMessage("O nome do arquivo não pode ser vazio.");
    }

    [Fact]
    public void StartProcessing_WhenStatusIsPending_ShouldChangeStatusToProcessing()
    {
        // Arrange
        var exam = new MedicalExam("exam.pdf");

        // Act
        exam.StartProcessing();

        // Assert
        exam.Status.Should().Be(ExamStatus.PROCESSING);
    }

    [Theory]
    [InlineData(ExamStatus.PROCESSING)]
    [InlineData(ExamStatus.DONE)]
    [InlineData(ExamStatus.ERROR)]
    [InlineData(ExamStatus.REPORTED)]
    public void StartProcessing_WhenStatusIsNotPending_ShouldThrowDomainException(ExamStatus currentStatus)
    {
        // Arrange
        var exam = new MedicalExam("exam.pdf");
        
        // Simulating the state change manually or via actions to reach currentStatus
        if (currentStatus != ExamStatus.PENDING)
        {
            exam.StartProcessing();
            if (currentStatus == ExamStatus.DONE)
            {
                exam.CompleteProcessing("success");
            }
            else if (currentStatus == ExamStatus.ERROR)
            {
                exam.FailProcessing("error");
            }
            else if (currentStatus == ExamStatus.REPORTED)
            {
                exam.CompleteProcessing("success");
                exam.EmitReport("This is a valid medical report.");
            }
        }

        // Act
        Action act = () => exam.StartProcessing();

        // Assert
        act.Should().Throw<DomainException>()
            .WithMessage("O exame não está pendente para ser processado.");
    }

    [Fact]
    public void CompleteProcessing_WhenStatusIsProcessing_ShouldChangeStatusToDoneAndSetResult()
    {
        // Arrange
        var exam = new MedicalExam("exam.pdf");
        exam.StartProcessing();
        var result = "Exame processado com IA.";

        // Act
        exam.CompleteProcessing(result);

        // Assert
        exam.Status.Should().Be(ExamStatus.DONE);
        exam.ProcessingResult.Should().Be(result);
    }

    [Theory]
    [InlineData(ExamStatus.PENDING)]
    [InlineData(ExamStatus.DONE)]
    [InlineData(ExamStatus.ERROR)]
    [InlineData(ExamStatus.REPORTED)]
    public void CompleteProcessing_WhenStatusIsNotProcessing_ShouldThrowDomainException(ExamStatus currentStatus)
    {
        // Arrange
        var exam = new MedicalExam("exam.pdf");
        if (currentStatus == ExamStatus.DONE)
        {
            exam.StartProcessing();
            exam.CompleteProcessing("success");
        }
        else if (currentStatus == ExamStatus.ERROR)
        {
            exam.StartProcessing();
            exam.FailProcessing("error");
        }
        else if (currentStatus == ExamStatus.REPORTED)
        {
            exam.StartProcessing();
            exam.CompleteProcessing("success");
            exam.EmitReport("This is a valid medical report.");
        }

        // Act
        Action act = () => exam.CompleteProcessing("result");

        // Assert
        act.Should().Throw<DomainException>()
            .WithMessage("Apenas exames em processamento podem ser concluídos.");
    }

    [Fact]
    public void FailProcessing_WhenStatusIsProcessing_ShouldChangeStatusToErrorAndSetErrorResult()
    {
        // Arrange
        var exam = new MedicalExam("exam.pdf");
        exam.StartProcessing();
        var error = "Arquivo corrompido.";

        // Act
        exam.FailProcessing(error);

        // Assert
        exam.Status.Should().Be(ExamStatus.ERROR);
        exam.ProcessingResult.Should().Be(error);
    }

    [Theory]
    [InlineData(ExamStatus.PENDING)]
    [InlineData(ExamStatus.DONE)]
    [InlineData(ExamStatus.ERROR)]
    [InlineData(ExamStatus.REPORTED)]
    public void FailProcessing_WhenStatusIsNotProcessing_ShouldThrowDomainException(ExamStatus currentStatus)
    {
        // Arrange
        var exam = new MedicalExam("exam.pdf");
        if (currentStatus == ExamStatus.DONE)
        {
            exam.StartProcessing();
            exam.CompleteProcessing("success");
        }
        else if (currentStatus == ExamStatus.ERROR)
        {
            exam.StartProcessing();
            exam.FailProcessing("error");
        }
        else if (currentStatus == ExamStatus.REPORTED)
        {
            exam.StartProcessing();
            exam.CompleteProcessing("success");
            exam.EmitReport("This is a valid medical report.");
        }

        // Act
        Action act = () => exam.FailProcessing("error");

        // Assert
        act.Should().Throw<DomainException>()
            .WithMessage("Apenas exames em processamento podem falhar.");
    }

    [Fact]
    public void EmitReport_WhenStatusIsDoneAndReportIsValid_ShouldChangeStatusToReportedAndSetReport()
    {
        // Arrange
        var exam = new MedicalExam("exam.pdf");
        exam.StartProcessing();
        exam.CompleteProcessing("success");
        var report = "Paciente saudável, sem anomalias.";

        // Act
        exam.EmitReport(report);

        // Assert
        exam.Status.Should().Be(ExamStatus.REPORTED);
        exam.Report.Should().Be(report);
    }

    [Theory]
    [InlineData(ExamStatus.PENDING)]
    [InlineData(ExamStatus.PROCESSING)]
    [InlineData(ExamStatus.ERROR)]
    [InlineData(ExamStatus.REPORTED)]
    public void EmitReport_WhenStatusIsNotDone_ShouldThrowDomainException(ExamStatus currentStatus)
    {
        // Arrange
        var exam = new MedicalExam("exam.pdf");
        if (currentStatus == ExamStatus.PROCESSING)
        {
            exam.StartProcessing();
        }
        else if (currentStatus == ExamStatus.ERROR)
        {
            exam.StartProcessing();
            exam.FailProcessing("error");
        }
        else if (currentStatus == ExamStatus.REPORTED)
        {
            exam.StartProcessing();
            exam.CompleteProcessing("success");
            exam.EmitReport("report");
        }

        // Act
        Action act = () => exam.EmitReport("This is a report");

        // Assert
        act.Should().Throw<DomainException>()
            .WithMessage("Laudos só podem ser emitidos para exames com status DONE.");
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void EmitReport_WithInvalidReport_ShouldThrowDomainException(string? report)
    {
        // Arrange
        var exam = new MedicalExam("exam.pdf");
        exam.StartProcessing();
        exam.CompleteProcessing("success");

        // Act
        Action act = () => exam.EmitReport(report!);

        // Assert
        act.Should().Throw<DomainException>()
            .WithMessage("O laudo não pode ser vazio.");
    }
}
