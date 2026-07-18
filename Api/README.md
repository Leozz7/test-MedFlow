# MedFlow Backend API

Esta é a API do MedFlow, um sistema para gerenciamento e diagnóstico de exames médicos. O backend foi desenvolvido utilizando .NET 10.

---

## Arquitetura e Padrões

O projeto é estruturado nos princípios de Clean Architecture e Domain-Driven Design (DDD).

```text
src/
├── MedFlow.Domain          # Entidades de Domínio, Enums e Exceções de Negócio
├── MedFlow.Application     # Casos de uso (Commands/Queries), DTOs, Handlers e FluentValidation
├── MedFlow.Infrastructure  # EF Core, RabbitMQ, JWT e Logs
├── MedFlow.Api             # Controladores, DI e Middleware
└── MedFlow.Tests           # Testes unitários e de integração (xUnit)
```

### Padrões Utilizados
* CQRS (Command Query Responsibility Segregation) com MediatR.
* Domain-Driven Design (DDD) com entidades ricas.
* Pipeline Validation com FluentValidation.

---

## Tecnologias e Dependências

* Runtime: .NET 10
* Banco de Dados: PostgreSQL (via Entity Framework Core 10)
* Mensageria: RabbitMQ (processamento assíncrono)
* Segurança: JWT com Hashing de senha via Argon2
* Logs: Serilog com Seq
* Documentação: OpenAPI / Swagger

---

## Integração com RabbitMQ (Mensageria Assíncrona)

O RabbitMQ é utilizado para o processamento em segundo plano de exames médicos de forma resiliente.

### Fluxo de Processamento de Exame

1. O atendente realiza o upload do exame. O sistema salva o registro no banco de dados com o status PENDING.
2. O ID do exame é publicado na fila "exam-processing" pelo [RabbitMQMessagePublisher](file:///c:/Users/senna/OneDrive/Documentos/testeTecnico/Api/src/MedFlow.Infrastructure/RabbitMQ/RabbitMQMessagePublisher.cs).
3. O [ExamProcessingBackgroundService](file:///c:/Users/senna/OneDrive/Documentos/testeTecnico/Api/src/MedFlow.Infrastructure/RabbitMQ/ExamProcessingBackgroundService.cs) consome a mensagem e altera o status do exame no banco de dados para PROCESSING.
4. Ocorre a simulação do processamento técnico do exame (IA / diagnósticos automáticos).
5. Se for bem-sucedido, o status do exame no banco de dados é alterado para DONE. Com isso, o exame fica disponível para o médico emitir o laudo (que alterará o status final para REPORTED).
6. Se falhar, o status do exame é atualizado para ERROR e a mensagem é rejeitada com BasicNack(requeue: false), sendo enviada para a fila de falhas (Dead Letter Queue - DLQ).

### Filas
* **exam-processing:** Fila principal de processamento.
* **exam-processing-dlq:** Fila de mensagens mortas (DLQ) para armazenamento e análise de mensagens que falharam durante o processamento técnico, evitando perda de dados críticos.

---

## Observabilidade e Monitoramento

* Painel Administrativo do RabbitMQ: http://localhost:15672 (usuário/senha padrão: guest/guest).
* Seq (Visualizador de Logs): http://localhost:8082.
* Health Checks: Endpoint GET /health indicando o status de conexão dos recursos (PostgreSQL e RabbitMQ).

---

## Como Executar

### Docker Compose
Na pasta raiz do repositório:

```bash
docker compose up --build
```

Serviços disponíveis:
* PostgreSQL (medflow-db) na porta 5432
* RabbitMQ (medflow-rabbitmq) nas portas 5672 (AMQP) e 15672 (Painel Web)
* Seq (medflow-seq) na porta 8082
* API (medflow-api) na porta 5001
* Frontend (medflow-web) na porta 3000

### Localmente (Dotnet SDK)
1. Suba os serviços auxiliares:
   ```bash
   docker compose up -d db rabbitmq seq
   ```
2. Na pasta "/Api/src/MedFlow.Api", execute:
   ```bash
   dotnet run
   ```