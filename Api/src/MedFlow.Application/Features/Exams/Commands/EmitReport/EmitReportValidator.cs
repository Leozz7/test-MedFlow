using FluentValidation;

namespace MedFlow.Application.Features.Exams.Commands.EmitReport;

public class EmitReportValidator : AbstractValidator<EmitReportCommand>
{
    public EmitReportValidator()
    {
        RuleFor(x => x.ExamId)
            .NotEmpty().WithMessage("O ID do exame é obrigatório.");

        RuleFor(x => x.Report)
            .NotEmpty().WithMessage("O laudo médico não pode estar vazio.")
            .MinimumLength(10).WithMessage("O laudo deve conter pelo menos 10 caracteres.");
    }
}
