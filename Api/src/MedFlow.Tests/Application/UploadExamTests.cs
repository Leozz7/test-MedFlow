using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using NSubstitute;
using FluentAssertions;
using MedFlow.Application.Features.Exams.Commands.UploadExam;
using MedFlow.Application.Interfaces.Messaging;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Domain.Entities;
using MedFlow.Domain.Enums;

namespace MedFlow.Tests.Application;

public class UploadExamTests
{
    private readonly IExamRepository _examRepository = Substitute.For<IExamRepository>();
    private readonly IMessagePublisher _messagePublisher = Substitute.For<IMessagePublisher>();
    private readonly UploadExamHandler _handler;
    private readonly UploadExamValidator _validator;

    public UploadExamTests()
    {
        _handler = new UploadExamHandler(_examRepository, _messagePublisher);
        _validator = new UploadExamValidator();
    }

    #region Handler Tests

    [Fact]
    public async Task Handler_WithValidCommand_ShouldSaveExamAndPublishRabbitMQMessage()
    {
        // Arrange
        var command = new UploadExamCommand("xray_exam.pdf");

        // Act
        var examId = await _handler.Handle(command, CancellationToken.None);

        // Assert
        examId.Should().NotBeEmpty();

        _examRepository.Received(1).Add(Arg.Is<MedicalExam>(e =>
            e.FileName == command.FileName &&
            e.Status == ExamStatus.PENDING));

        await _examRepository.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
        await _messagePublisher.Received(1).PublishExamProcessingMessageAsync(examId, Arg.Any<CancellationToken>());
    }

    #endregion

    #region Validator Tests

    [Fact]
    public void Validator_WithValidCommand_ShouldBeValid()
    {
        // Arrange
        var command = new UploadExamCommand("test.pdf");

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Validator_WithEmptyFileName_ShouldHaveValidationError(string? fileName)
    {
        // Arrange
        var command = new UploadExamCommand(fileName!);

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "FileName" && e.ErrorMessage == "O nome do arquivo é obrigatório.");
    }

    [Theory]
    [InlineData("a")]
    [InlineData("ab")]
    public void Validator_WithFileNameTooShort_ShouldHaveValidationError(string fileName)
    {
        // Arrange
        var command = new UploadExamCommand(fileName);

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "FileName" && e.ErrorMessage == "O nome do arquivo deve ter pelo menos 3 caracteres.");
    }

    #endregion
}
