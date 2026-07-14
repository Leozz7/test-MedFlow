# Desafio Técnico - MedFlow (.NET Full Stack)

Bem-vindo(a) ao desafio técnico para a vaga de desenvolvedor Full Stack!

O objetivo deste desafio é desenvolver o MVP (**Produto Mínimo Viável**) do **MedFlow**, uma plataforma responsável por gerenciar o fluxo completo de exames médicos, desde o cadastro realizado pelo atendente até a emissão do laudo pelo médico.

O desafio foi elaborado para avaliar sua capacidade de projetar uma arquitetura organizada, implementar regras de negócio, trabalhar com processamento assíncrono e desenvolver uma aplicação Full Stack utilizando o ecossistema .NET e React.

---

## 1. Visão Geral

### 1.1 Contexto
Na clínica, os exames passam por um fluxo simples:
1. O atendente cadastra um exame.
2. O sistema processa automaticamente esse exame de forma assíncrona.
3. Caso o processamento seja concluído com sucesso, o exame fica disponível para análise.
4. O médico analisa o exame e emite um laudo.
5. O exame é finalizado.

### 1.2 Tecnologias Esperadas

**Backend:**
- ASP.NET Core 8 Web API
- Entity Framework Core
- PostgreSQL
- RabbitMQ
- JWT Authentication
- MediatR (CQRS)
- FluentValidation
- AutoMapper
- Serilog

**Frontend:**
- Next.js 15
- React
- TypeScript
- Material UI (MUI)
- Axios
- React Hook Form
- Zod

---

## 2. Requisitos de Negócio e Papéis

O sistema possui dois perfis de acesso, cada um com permissões específicas:

### 2.1 Atendente (`ATTENDANT`)
Responsável pelo cadastro e acompanhamento inicial dos exames.
- Cadastrar novos exames;
- Visualizar todos os exames do sistema;
- Acompanhar o status do processamento.

### 2.2 Médico (`DOCTOR`)
Responsável pela análise e emissão dos laudos.
- Visualizar **apenas** exames que estejam prontos para laudo;
- Emitir o laudo técnico do exame;
- Finalizar o exame.

---

## 3. Modelagem de Dados

O banco de dados deve suportar as seguintes entidades principais:

### 3.1 Entidades

**User**
| Campo | Tipo | Descrição |
|---|---|---|
| `Id` | Guid | Identificador único |
| `Name` | string | Nome do usuário |
| `Email` | string | E-mail de acesso |
| `PasswordHash` | string | Hash da senha |
| `Role` | UserRole | Papel do usuário no sistema |

**MedicalExam**
| Campo | Tipo | Descrição |
|---|---|---|
| `Id` | Guid | Identificador único |
| `FileName` | string | Nome do arquivo do exame |
| `Status` | ExamStatus | Status atual do exame |
| `ProcessingResult` | string? | Resultado ou erro do processamento |
| `Report` | string? | Laudo emitido pelo médico |
| `CreatedAt` | DateTime | Data de criação |

### 3.2 Enums

```csharp
public enum UserRole
{
    Attendant,
    Doctor
}

public enum ExamStatus
{
    Pending,
    Processing,
    Done,
    Error,
    Reported
}
```

---

## 4. Milestones de Desenvolvimento (Backend)

Recomendamos seguir os milestones abaixo para organizar seu desenvolvimento.

### Milestone 1 — Autenticação e Estrutura Base
- **Cadastro de Usuário:** Criar endpoint público para cadastro de usuários (Atendente ou Médico).
- **Login:** Autenticação via JWT. O payload do token deve conter informações como `sub`, `email` e `role`.
- **Autorização:** Proteger os endpoints com base nas Roles (ex: `[Authorize(Roles = "Doctor")]`).

### Milestone 2 — Upload e Processamento Assíncrono
- **Upload (`POST /api/exams/upload`):**
  1. Acessível apenas para `ATTENDANT`.
  2. Cria o exame com status `Pending` e persiste no banco.
  3. Publica uma mensagem no RabbitMQ (fila `exam-processing`) contendo o `examId`.
- **Processamento (BackgroundService):**
  1. Consome a fila `exam-processing`.
  2. Altera o status do exame para `Processing`.
  3. Simula um tempo de processamento aleatório (`await Task.Delay(Random.Shared.Next(3000, 7000));`).
  4. **Em caso de Sucesso:** Atualiza o status para `Done` e salva o resultado em `ProcessingResult`.
  5. **Em caso de Falha:** Atualiza o status para `Error` e salva a mensagem de erro em `ProcessingResult`.

### Milestone 3 — Listagem de Exames e Emissão de Laudos
- **Listagem (`GET /api/exams`):**
  - **Atendente:** Retorna todos os exames.
  - **Médico:** Retorna apenas exames com status `Done`.
- **Emissão de Laudo (`POST /api/exams/{id}/report`):**
  1. Acessível apenas para `DOCTOR`.
  2. Valida se o exame existe e se o status é `Done` (caso contrário, retorna erro).
  3. Salva o laudo, atualiza o status para `Reported` e persiste as alterações.
  4. Utilizar FluentValidation para validar o DTO de entrada (ex: tamanho mínimo do laudo).

---

## 5. Requisitos do Frontend

Desenvolver a interface do usuário consumindo a API construída.

### 5.1 Login e Autenticação
- Tela de login com e-mail e senha.
- Armazenar JWT no cliente de forma segura.
- Redirecionar o usuário para o dashboard correto com base em sua `role`.

### 5.2 Dashboard do Atendente
- Formulário para cadastro/upload de novos exames.
- Listagem geral de todos os exames.
- Atualização automática dos status (polling ou equivalente).
- Exibição clara do status atual do exame.

### 5.3 Dashboard do Médico
- Lista de exames disponíveis (apenas os com status `Done`).
- Área de visualização do exame e campo de texto para redigir o laudo.
- Botão para envio do laudo.
- Após o envio bem-sucedido, o exame deve desaparecer da lista de pendências.

---

## 6. Endpoints da API

Resumo dos endpoints necessários:

| Método | Endpoint | Permissão | Descrição |
|---|---|---|---|
| `POST` | `/api/users` | Público | Cadastro de novo usuário |
| `POST` | `/api/auth/login` | Público | Autenticação e geração de JWT |
| `POST` | `/api/exams/upload` | `ATTENDANT` | Cadastro de novo exame |
| `GET` | `/api/exams` | Autenticado | Listagem de exames (regra baseada na role) |
| `POST` | `/api/exams/{id}/report` | `DOCTOR` | Emissão de laudo médico |

---

## 7. Arquitetura e Fluxos

### 7.1 Estrutura de Pastas Esperada (Clean Architecture)
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
├── MedFlow.Infrastructure
│   ├── Persistence
│   ├── RabbitMQ
│   ├── Authentication
│   └── Services
└── MedFlow.Web (Frontend Next.js)
```

### 7.2 Fluxo Síncrono (CQRS)
```text
Controller ──► MediatR ──► Command/Query ──► Handler ──► Repository ──► PostgreSQL
```

### 7.3 Fluxo Assíncrono (RabbitMQ)
```text
Upload (API) ──► RabbitMQ ──► BackgroundService ──► Processing ──┬──► Done
                                                                 └──► Error
```

---

## 8. Diferenciais (Bônus)

Estes itens não são obrigatórios para a entrega mínima, mas farão seu projeto se destacar:

1. **Observabilidade (Serilog):** Adicionar middleware/interceptor para registrar tempo de execução, método HTTP, endpoint e status code.
2. **Health Check (`/health`):** Endpoint validando conexão com PostgreSQL e RabbitMQ.
3. **Dead Letter Queue (DLQ):** Criar fila (`exam-processing-dlq`) para mensagens com falha inesperada no RabbitMQ. Explicar no README a implementação.
4. **Dockerização:** Disponibilizar um `docker-compose.yml` que suba todos os serviços (API, Banco, RabbitMQ, Frontend) com apenas um comando.

---

## 9. Critérios de Avaliação

Seu projeto será avaliado pelos seguintes aspectos:
- Organização e separação de responsabilidades (Clean Architecture);
- Qualidade e legibilidade do código;
- Uso adequado do CQRS e MediatR;
- Implementação correta do processamento assíncrono (RabbitMQ);
- Autenticação e tratamento de autorização;
- Usabilidade e qualidade da interface web (Frontend);
- Tratamento de exceções e validação de dados;
- Documentação clara.

## 10. Entrega

O projeto deverá ser disponibilizado em um repositório no GitHub contendo:
- O código-fonte completo (Backend + Frontend).
- Um `README.md` bem estruturado com instruções para rodar o projeto localmente.
- Opcional: Diagrama de arquitetura e/ou coleção do Postman (`.http`) para facilitar os testes da API.

Boa sorte e bom desafio!