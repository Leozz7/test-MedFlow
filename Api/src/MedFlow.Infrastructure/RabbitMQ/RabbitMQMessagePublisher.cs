using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MedFlow.Application.Interfaces.Messaging;
using Microsoft.Extensions.Configuration;
using RabbitMQ.Client;

namespace MedFlow.Infrastructure.RabbitMQ;

public class RabbitMQMessagePublisher : IMessagePublisher
{
    private readonly ConnectionFactory _connectionFactory;

    public RabbitMQMessagePublisher(IConfiguration configuration)
    {
        _connectionFactory = new ConnectionFactory
        {
            HostName = configuration["RabbitMQ:HostName"] ?? "localhost",
            Port = int.TryParse(configuration["RabbitMQ:Port"], out var port) ? port : 5672,
            UserName = configuration["RabbitMQ:UserName"] ?? "guest",
            Password = configuration["RabbitMQ:Password"] ?? "guest"
        };
    }

    public Task PublishExamProcessingMessageAsync(Guid examId, CancellationToken cancellationToken = default)
    {
        using var connection = _connectionFactory.CreateConnection();
        using var channel = connection.CreateModel();

        var arguments = new Dictionary<string, object>
        {
            { "x-dead-letter-exchange", "exam-processing-dlx" },
            { "x-dead-letter-routing-key", "exam-processing-dlq-routing-key" }
        };

        channel.QueueDeclare(
            queue: "exam-processing",
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: arguments);

        var body = Encoding.UTF8.GetBytes(examId.ToString());

        var properties = channel.CreateBasicProperties();
        properties.Persistent = true;

        channel.BasicPublish(
            exchange: string.Empty,
            routingKey: "exam-processing",
            basicProperties: properties,
            body: body);

        return Task.CompletedTask;
    }
}
