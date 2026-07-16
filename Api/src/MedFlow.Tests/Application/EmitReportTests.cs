using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using NSubstitute;
using FluentAssertions;
using MedFlow.Application.Features.Exams.Commands.EmitReport;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Domain.Entities;
using MedFlow.Domain.Enums;
using MedFlow.Domain.Exceptions;

namespace MedFlow.Tests.Application;

public class EmitReportTests
{
    private readonly IExamRepository _examRepository = Substitute.For<IExamRepository>();
    private readonly EmitReportHandler _handler;
    private readonly EmitReportValidator _validator;

    public EmitReportTests()
    {
        _handler = new EmitReportHandler(_examRepository);
        _validator = new EmitReportValidator();
    }

    #region Handler Tests

    [Fact]
    public async Task Handler_WithNonExistingExam_ShouldThrowNotFoundException()
    {
        // Arrange
        var command = new EmitReportCommand(Guid.NewGuid(), "Valid medical report description.");
        _examRepository.GetByIdAsync(command.ExamId, Arg.Any<CancellationToken>())
            .Returns((MedicalExam?)null);

        // Act
        Func<Task> act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
        _examRepository.DidNotReceive().Update(Arg.Any<MedicalExam>());
        await _examRepository.DidNotReceive().SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handler_WithExamNotInDoneStatus_ShouldThrowDomainExceptionThroughEntity()
    {
        // Arrange
        var exam = new MedicalExam("exam.pdf"); // Defaults to PENDING
        var command = new EmitReportCommand(exam.Id, "Valid medical report description.");

        _examRepository.GetByIdAsync(command.ExamId, Arg.Any<CancellationToken>())
            .Returns(exam);

        // Act
        Func<Task> act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("Laudos só podem ser emitidos para exames com status DONE.");

        _examRepository.DidNotReceive().Update(exam);
        await _examRepository.DidNotReceive().SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handler_WithValidDoneExam_ShouldEmitReportAndSave()
    {
        // Arrange
        var exam = new MedicalExam("exam.pdf");
        exam.StartProcessing();
        exam.CompleteProcessing("success result"); // Now status is DONE
        
        var command = new EmitReportCommand(exam.Id, "Valid medical report description.");

        _examRepository.GetByIdAsync(command.ExamId, Arg.Any<CancellationToken>())
            .Returns(exam);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        exam.Status.Should().Be(ExamStatus.REPORTED);
        exam.Report.Should().Be(command.Report);

        _examRepository.Received(1).Update(exam);
        await _examRepository.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    #endregion

    #region Validator Tests

    [Fact]
    public void Validator_WithValidCommand_ShouldBeValid()
    {
        // Arrange
        var command = new EmitReportCommand(Guid.NewGuid(), "Valid medical report that is more than 10 characters long.");

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validator_WithEmptyExamId_ShouldHaveValidationError()
    {
        // Arrange
        var command = new EmitReportCommand(Guid.Empty, "Valid medical report that is long.");

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "ExamId" && e.ErrorMessage == "O ID do exame é obrigatório.");
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Validator_WithEmptyReport_ShouldHaveValidationError(string? report)
    {
        // Arrange
        var command = new EmitReportCommand(Guid.NewGuid(), report!);

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Report" && e.ErrorMessage == "O laudo médico não pode estar vazio.");
    }

    [Theory]
    [InlineData("a")]
    [InlineData("123456789")]
    public void Validator_WithReportTooShort_ShouldHaveValidationError(string report)
    {
        // Arrange
        var command = new EmitReportCommand(Guid.NewGuid(), report);

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Report" && e.ErrorMessage == "O laudo deve conter pelo menos 10 caracteres.");
    }

    #endregion
}
