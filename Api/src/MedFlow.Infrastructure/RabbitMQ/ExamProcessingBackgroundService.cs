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

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                _connection = _connectionFactory.CreateConnection();
                _channel = _connection.CreateModel();

                // 1. Declarar Dead Letter Exchange (DLX) e Dead Letter Queue (DLQ)
                _channel.ExchangeDeclare(
                    exchange: "exam-processing-dlx",
                    type: ExchangeType.Direct,
                    durable: true,
                    autoDelete: false,
                    arguments: null);

                _channel.QueueDeclare(
                    queue: "exam-processing-dlq",
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);

                _channel.QueueBind(
                    queue: "exam-processing-dlq",
                    exchange: "exam-processing-dlx",
                    routingKey: "exam-processing-dlq-routing-key",
                    arguments: null);

                // 2. Argumentos para vincular a fila principal à DLX
                var arguments = new System.Collections.Generic.Dictionary<string, object>
                {
                    { "x-dead-letter-exchange", "exam-processing-dlx" },
                    { "x-dead-letter-routing-key", "exam-processing-dlq-routing-key" }
                };

                try
                {
                    _channel.QueueDeclare(
                        queue: "exam-processing",
                        durable: true,
                        exclusive: false,
                        autoDelete: false,
                        arguments: arguments);
                }
                catch (global::RabbitMQ.Client.Exceptions.OperationInterruptedException ex) when (ex.ShutdownReason?.ReplyCode == 406)
                {
                    _logger.LogWarning("Fila 'exam-processing' já existe com argumentos incompatíveis. Recriando fila...");
                    _channel = _connection.CreateModel();
                    _channel.QueueDelete("exam-processing");
                    _channel.QueueDeclare(
                        queue: "exam-processing",
                        durable: true,
                        exclusive: false,
                        autoDelete: false,
                        arguments: arguments);
                }

                var consumer = new AsyncEventingBasicConsumer(_channel);
                consumer.Received += async (model, ea) =>
                {
                    var body = ea.Body.ToArray();
                    var examIdString = Encoding.UTF8.GetString(body);

                    try
                    {
                        if (Guid.TryParse(examIdString, out var examId))
                        {
                            await ProcessExamAsync(examId, stoppingToken);
                        }
                        else
                        {
                            throw new ArgumentException($"Id de exame inválido recebido no corpo da mensagem: {examIdString}");
                        }

                        _channel.BasicAck(ea.DeliveryTag, false);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Erro no processamento da mensagem do exame {ExamIdString}. Enviando para DLQ.", examIdString);
                        // Nack com requeue = false envia automaticamente para a DLX configurada
                        _channel.BasicNack(ea.DeliveryTag, multiple: false, requeue: false);
                    }
                };

                _channel.BasicConsume(
                    queue: "exam-processing",
                    autoAck: false,
                    consumer: consumer);

                _logger.LogInformation("BackgroundService de Processamento de Exames iniciado com sucesso.");
                break; // Conectado com sucesso, sai do loop de retry
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao inicializar conexão com RabbitMQ no BackgroundService. Tentando novamente em 5 segundos...");
                try
                {
                    await Task.Delay(5000, stoppingToken);
                }
                catch (TaskCanceledException)
                {
                    break;
                }
            }
        }
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
