using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MedFlow.Domain.Entities;
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
        // Criação inicial do exame já define o Status como PENDING pelo construtor do Domínio
        var exam = new MedicalExam(request.FileName);

        _examRepository.Add(exam);
        
        // Persistência
        await _examRepository.SaveChangesAsync(cancellationToken);

        // Dispara mensagem assíncrona para o RabbitMQ
        await _messagePublisher.PublishExamProcessingMessageAsync(exam.Id, cancellationToken);

        return exam.Id;
    }
}
