using System;
using System.Threading;
using System.Threading.Tasks;

namespace MedFlow.Application.Interfaces.Messaging;

public interface IMessagePublisher
{
    Task PublishExamProcessingMessageAsync(Guid examId, CancellationToken cancellationToken = default);
}
