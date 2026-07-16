using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace MedFlow.Infrastructure.RabbitMQ;

public class ExamProcessingBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ExamProcessingBackgroundService> _logger;
    private readonly ConnectionFactory _connectionFactory;
    private IConnection? _connection;
    private IModel? _channel;

    public ExamProcessingBackgroundService(
        IServiceScopeFactory scopeFactory,
        IConfiguration configuration,
        ILogger<ExamProcessingBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        _connectionFactory = new ConnectionFactory
        {
            HostName = configuration["RabbitMQ:HostName"] ?? "localhost",
            Port = int.TryParse(configuration["RabbitMQ:Port"], out var port) ? port : 5672,
            UserName = configuration["RabbitMQ:UserName"] ?? "guest",
            Password = configuration["RabbitMQ:Password"] ?? "guest",
            DispatchConsumersAsync = true // Permite tratamento async dos eventos do consumer
        };
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            _connection = _connectionFactory.CreateConnection();
            _channel = _connection.CreateModel();

            _channel.QueueDeclare(
                queue: "exam-processing",
                durable: true,
                exclusive: false,
                autoDelete: false,
                arguments: null);

            var consumer = new AsyncEventingBasicConsumer(_channel);
            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var examIdString = Encoding.UTF8.GetString(body);

                if (Guid.TryParse(examIdString, out var examId))
                {
                    await ProcessExamAsync(examId, stoppingToken);
                }

                _channel.BasicAck(ea.DeliveryTag, false);
            };

            _channel.BasicConsume(
                queue: "exam-processing",
                autoAck: false,
                consumer: consumer);

            _logger.LogInformation("BackgroundService de Processamento de Exames iniciado com sucesso.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao inicializar conexão com RabbitMQ no BackgroundService.");
        }

        return Task.CompletedTask;
    }

    private async Task ProcessExamAsync(Guid examId, CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var examRepository = scope.ServiceProvider.GetRequiredService<IExamRepository>();

        try
        {
            var exam = await examRepository.GetByIdAsync(examId, cancellationToken);
            if (exam == null)
            {
                _logger.LogWarning("Exame {ExamId} não encontrado no banco de dados.", examId);
                return;
            }

            _logger.LogInformation("Iniciando processamento do exame {ExamId}.", examId);
            
            // 1. Alterar status para PROCESSING
            exam.StartProcessing();
            examRepository.Update(exam);
            await examRepository.SaveChangesAsync(cancellationToken);

            // 2. Simular processamento aleatório (3 a 7 segundos)
            var delay = Random.Shared.Next(3000, 7000);
            await Task.Delay(delay, cancellationToken);

            // 3. Sucesso no processamento
            exam.CompleteProcessing($"Processamento finalizado com sucesso em {delay}ms.");
            examRepository.Update(exam);
            await examRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Processamento do exame {ExamId} concluído com sucesso.", examId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar o exame {ExamId}.", examId);

            try
            {
                // Tenta carregar e marcar como ERROR
                using var innerScope = _scopeFactory.CreateScope();
                var innerRepository = innerScope.ServiceProvider.GetRequiredService<IExamRepository>();
                var exam = await innerRepository.GetByIdAsync(examId, cancellationToken);
                if (exam != null)
                {
                    // Caso o status não esteja em PROCESSING, não podemos chamar FailProcessing diretamente
                    if (exam.Status != ExamStatus.PROCESSING)
                    {
                        exam.StartProcessing();
                    }
                    exam.FailProcessing($"Erro de processamento: {ex.Message}");
                    innerRepository.Update(exam);
                    await innerRepository.SaveChangesAsync(cancellationToken);
                }
            }
            catch (Exception innerEx)
            {
                _logger.LogError(innerEx, "Falha ao registrar estado de erro do exame {ExamId} no banco de dados.", examId);
            }
        }
    }

    public override void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
        base.Dispose();
    }
}
