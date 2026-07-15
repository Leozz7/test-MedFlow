using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MedFlow.Application.Interfaces.Repositories;

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

        if (exam == null)
        {
            throw new Exception("Exame não encontrado.");
        }

        // O Domínio valida se o status atual permite emitir laudo e atualiza o estado
        exam.EmitReport(request.Report);

        _examRepository.Update(exam);
        await _examRepository.SaveChangesAsync(cancellationToken);
    }
}
