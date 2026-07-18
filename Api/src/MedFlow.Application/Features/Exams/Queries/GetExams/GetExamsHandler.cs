using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MedFlow.Application.Features.Exams.DTOs;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Domain.Entities;
using MedFlow.Domain.Enums;

namespace MedFlow.Application.Features.Exams.Queries.GetExams;

public class GetExamsHandler : IRequestHandler<GetExamsQuery, IEnumerable<ExamDto>>
{
    private readonly IExamRepository _examRepository;

    public GetExamsHandler(IExamRepository examRepository)
    {
        _examRepository = examRepository;
    }

    public async Task<IEnumerable<ExamDto>> Handle(GetExamsQuery request, CancellationToken cancellationToken)
    {
        IEnumerable<MedicalExam> exams;

        if (request.UserRole == UserRole.DOCTOR)
        {
            // Medicos veem exames concluidos (prontos para laudo) e ja laudados
            exams = (await _examRepository.GetAllAsync(cancellationToken))
                .Where(e => e.Status == ExamStatus.DONE || e.Status == ExamStatus.REPORTED);
        }
        else
        {
            // Atendentes veem todos os exames
            exams = await _examRepository.GetAllAsync(cancellationToken);
        }

        // Mapeamento  
        return exams.Select(e => new ExamDto
        {
            Id = e.Id,
            FileName = e.FileName,
            Status = e.Status,
            ProcessingResult = e.ProcessingResult,
            Report = e.Report,
            Created = e.Created
        });
    }
}
