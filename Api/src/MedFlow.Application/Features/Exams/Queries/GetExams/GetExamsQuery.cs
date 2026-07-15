using System.Collections.Generic;
using MediatR;
using MedFlow.Application.Features.Exams.DTOs;
using MedFlow.Domain.Enums;

namespace MedFlow.Application.Features.Exams.Queries.GetExams;

public record GetExamsQuery(UserRole UserRole) : IRequest<IEnumerable<ExamDto>>;
