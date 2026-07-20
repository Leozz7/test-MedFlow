# MedFlow

Solução Full Stack para gerenciamento do fluxo de exames médicos, contemplando desde o upload até o processamento assíncrono e emissão de laudos.

## Stack Tecnológica e Arquitetura

O projeto adota **Clean Architecture** e **Domain-Driven Design (DDD)**, com forte separação de responsabilidades e foco no domínio.

**Backend (.NET 8):**
- **Arquitetura:** Clean Architecture (Domain, Application, Infrastructure, Api)
- **Design Patterns:** CQRS utilizando `MediatR`
- **Mensageria:** `RabbitMQ` (Event-driven, Background Services, DLQ)
- **Persistência:** `PostgreSQL` e `Entity Framework Core`
- **Segurança:** Autenticação via `JWT Bearer` com controle por Roles (`ATTENDANT` / `DOCTOR`)
- **Validação e Mapeamento:** `FluentValidation` e `AutoMapper`
- **Observabilidade:** Logs estruturados via `Serilog` exportados para o `Seq`

**Frontend (Vite + React):**
- **Core:** `React`, `TypeScript`, `Vite`
- **Estilização e UI:** `Material UI (MUI)`
- **Gerenciamento de Formulários:** `React Hook Form` com validação em `Zod`
- **Requisições:** `Axios`

## Execução via Docker (Ambiente Completo)

O ecossistema é totalmente orquestrado via Docker Compose, subindo as aplicações e serviços auxiliares de forma automática.

1. Suba os containers em modo build:
   ```bash
   docker compose up --build -d
   ```
   *(Dica: utilize a flag `--watch` no lugar de `-d` para ativar o hot-reload do Frontend)*

2. Acesse os serviços mapeados:
   - **Frontend (Web):** http://localhost:3000
   - **API (Swagger):** http://localhost:8080/swagger
   - **RabbitMQ Management:** http://localhost:15672 (user: `guest` | pass: `guest`)
   - **Seq (Dashboard de Logs):** http://localhost:8082

## Seed de Dados

A aplicação roda as *migrations* e efetua o *seeding* automático no banco. Utilize as credenciais abaixo para acesso inicial:
- **Login:** `admin@medflow.com`
- **Senha:** `AdminPassword123!`
- **Role:** `ATTENDANT`

*(Novos usuários, incluindo médicos, podem ser registrados via endpoint público no Swagger).*

---
Para consultar as especificações originais e regras de negócio do desafio técnico, leia o documento [teste.md](teste.md).
