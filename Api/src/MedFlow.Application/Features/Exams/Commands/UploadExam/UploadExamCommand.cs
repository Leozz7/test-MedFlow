using System;
using MediatR;
using MedFlow.Domain.Enums;

namespace MedFlow.Application.Features.Exams.Commands.UploadExam;

public record UploadExamCommand(
    string FileName,
    Guid? Id = null,
    ExamStatus? Status = null,
    string? ProcessingResult = null,
    string? Report = null,
    DateTime? Created = null
) : IRequest<Guid>;
