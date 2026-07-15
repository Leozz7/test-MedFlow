using System;
using MediatR;

namespace MedFlow.Application.Features.Exams.Commands.UploadExam;

public record UploadExamCommand(string FileName) : IRequest<Guid>;
