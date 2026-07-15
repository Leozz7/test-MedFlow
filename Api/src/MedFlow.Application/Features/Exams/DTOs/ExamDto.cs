using System;
using MedFlow.Domain.Enums;

namespace MedFlow.Application.Features.Exams.DTOs;

public class ExamDto
{
    public Guid Id { get; set; }
    public required string FileName { get; set; }
    public ExamStatus Status { get; set; }
    public string? ProcessingResult { get; set; }
    public string? Report { get; set; }
    public DateTime Created { get; set; }
}
