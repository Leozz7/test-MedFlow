using System;
using MediatR;

namespace MedFlow.Application.Features.Exams.Commands.EmitReport;

public record EmitReportCommand(Guid ExamId, string Report) : IRequest;
