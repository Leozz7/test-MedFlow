using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Domain.Exceptions;

namespace MedFlow.Application.Features.Exams.Commands.EmitReport;

public class EmitReportHandler : IRequestHandler<EmitReportCommand>
{
    private readonly IExamRepository _examRepository;

    public EmitReportHandler(IExamRepository examRepository)
    {
        _examRepository = examRepository;
    }

    public async Task Handle(EmitReportCommand request, CancellationToken cancellationToken)
    {
        var exam = await _examRepository.GetByIdAsync(request.ExamId, cancellationToken);

        if (exam is null)
            throw new NotFoundException(nameof(exam), request.ExamId);

        // O Domínio valida se o status atual é DONE e lança DomainException (400) caso contrário
        exam.EmitReport(request.Report);

        _examRepository.Update(exam);
        await _examRepository.SaveChangesAsync(cancellationToken);
    }
}

