using FluentValidation;

namespace MedFlow.Application.Features.Exams.Commands.UploadExam;

public class UploadExamValidator : AbstractValidator<UploadExamCommand>
{
    public UploadExamValidator()
    {
        RuleFor(x => x.FileName)
            .NotEmpty().WithMessage("O nome do arquivo é obrigatório.")
            .MinimumLength(3).WithMessage("O nome do arquivo deve ter pelo menos 3 caracteres.");
    }
}
