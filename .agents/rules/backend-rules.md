---
trigger: always_on
---

# Regras de Desenvolvimento Backend (MedFlow.Api)

Este projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, com separação clara de responsabilidades, uso de CQRS (MediatR) e mensageria assíncrona (RabbitMQ).

## 1. Princípios Gerais e Arquitetura

- **Clean Architecture:** O projeto é dividido nas camadas `Domain`, `Application`, `Infrastructure` e `Api`. As dependências sempre apontam para dentro (Domain não depende de nada).
- **Domain-Driven Design (DDD):** Foco no domínio, entidades ricas, enums para representar estados (ex: `UserRole`, `ExamStatus`) e exceções de domínio. Evitar "Anemic Domain Models".
- **CQRS com MediatR:** Separação estrita entre operações de leitura (Queries) e operações de escrita (Commands).

## 2. Estrutura de Diretórios e Camadas

A estrutura base deve ser:
```text
src/
├── MedFlow.Api
├── MedFlow.Application
│   ├── Features (Users, Exams, etc)
│   ├── Commands / Queries
│   ├── Validators
│   └── Interfaces
├── MedFlow.Domain
│   ├── Entities
│   ├── Enums
│   └── Exceptions
└── MedFlow.Infrastructure
    ├── Persistence
    ├── RabbitMQ
    ├── Authentication
    └── Services
```

- **MedFlow.Domain:**
  - `Entities/`: Modelos de domínio (ex: `User`, `MedicalExam`). As entidades devem ter seus próprios métodos para alteração de estado.
  - `Enums/`: Tipos enumerados (`UserRole`, `ExamStatus`).
  - `Exceptions/`: Exceções de negócio.
- **MedFlow.Application:**
  - `Features/`: Organizado por funcionalidade (Users, Exams). Dentro de cada feature: `Commands`, `Queries`, `Handlers`, `DTOs`.
  - `Validators/`: Regras de validação utilizando **FluentValidation** para os Commands/Queries.
  - `Interfaces/`: Contratos e abstrações (ex: `IUserRepository`, `IMessagePublisher`).
- **MedFlow.Infrastructure:**
  - `Persistence/`: Implementação do Entity Framework Core, DbContext, Migrations e Repositories.
  - `RabbitMQ/`: Publishers e Consumers (BackgroundServices) para mensageria assíncrona.
  - `Authentication/`: Serviços e configurações para JWT.
- **MedFlow.Api:**
  - `Controllers/`: Endpoints limpos, injetando o `IMediator` (separando Sender e Publisher) e delegando toda a lógica para a camada de Application.
  - Configurações de DI (Dependency Injection), Serilog, Swagger e Middlewares.

## 3. Padrões de Código e Implementação

- **Controllers:** Devem ser extremamente enxutos. Eles apenas recebem a requisição, despacham o comando/query via MediatR e retornam o `IResult` ou `IActionResult` adequado.
- **Validações:** Devem ser feitas na camada de `Application` usando **FluentValidation**. O Pipeline Behavior do MediatR deve ser configurado para interceptar requisições inválidas automaticamente e retornar Bad Request sem bater no Handler.
- **Mapeamento:** Utilizar **AutoMapper** na camada `Application` para transformar Entidades em DTOs e vice-versa.
- **Mensageria (RabbitMQ):**
  - O processamento assíncrono deve ser feito através de *HostedServices* (BackgroundService) consumindo as filas correspondentes.
  - O fluxo feliz do processamento altera o status do exame de `PENDING` para `PROCESSING`, e finalmente para `DONE`.
  - Cenários de falha na mensageria devem atualizar para `ERROR` e prever o uso de Dead Letter Queues (DLQ) para falhas inesperadas.
- **Segurança e Autenticação (JWT):** 
  - Utilizar `[Authorize(Roles = "...")]` para garantir que os perfis acessem apenas as rotas que lhe cabem (`ATTENDANT` ou `DOCTOR`).
  - Senhas devem ser salvas como Hash (ex: BCrypt ou ASP.NET Identity PasswordHasher).
- **Observabilidade:** Configurar **Serilog** para gerar logs estruturados, registrando tempo de execução de métodos importantes e requisições/respostas.

## 4. Regras do Negócio Específicas

- Apenas `ATTENDANT` pode realizar o upload de exames.
- O Upload inicial obrigatoriamente define o status do exame como `PENDING` e enfileira a mensagem no RabbitMQ (`exam-processing`).
- Apenas `DOCTOR` pode emitir laudo, e APENAS para exames que se encontrem com o status `DONE`.
- Ao emitir o laudo com sucesso, o status muda para `REPORTED`.
