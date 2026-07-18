using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MedFlow.Domain.Entities;
using MedFlow.Domain.Enums;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Application.Interfaces.Messaging;

namespace MedFlow.Application.Features.Exams.Commands.UploadExam;

public class UploadExamHandler : IRequestHandler<UploadExamCommand, Guid>
{
    private readonly IExamRepository _examRepository;
    private readonly IMessagePublisher _messagePublisher;

    public UploadExamHandler(IExamRepository examRepository, IMessagePublisher messagePublisher)
    {
        _examRepository = examRepository;
        _messagePublisher = messagePublisher;
    }

    public async Task<Guid> Handle(UploadExamCommand request, CancellationToken cancellationToken)
    {
        var exam = new MedicalExam(
            request.FileName,
            request.Id,
            ExamStatus.PENDING,
            null,
            null,
            request.Created
        );

        _examRepository.Add(exam);
        
        await _examRepository.SaveChangesAsync(cancellationToken);

        // Dispara mensagem assíncrona para o RabbitMQ apenas se o status inicial for PENDING
        if (exam.Status == ExamStatus.PENDING)
        {
            await _messagePublisher.PublishExamProcessingMessageAsync(exam.Id, cancellationToken);
        }

        return exam.Id;
    }
}
