# MedFlow

Solução Full Stack para gerenciamento do fluxo de exames médicos, contemplando o caminho de um usuário no sistema: fazer o upload de um exame (Atendente), aguardar o processamento assíncrono na fila, e a emissão de laudos do exame processado (Médico).

Front em **React + Vite (TypeScript)**, back em **.NET 8 (C#)**. 
Mensageria com **RabbitMQ** e persistência utilizando **PostgreSQL** + **Entity Framework Core**. O ecossistema roda de forma local orquestrado por Docker.

---

## Rodando

Precisa do Docker instalado para subir todos os serviços de uma vez.

```bash
docker compose up --build -d
```

Abre **http://localhost:3000** no navegador para ver a aplicação Web.
O proxy e as portas são resolvidos pelo Docker.

Acesso aos serviços mapeados:
- **API (Swagger):** http://localhost:8080/swagger
- **RabbitMQ Management:** http://localhost:15672 (user: `guest` | pass: `guest`)
- **Seq (Logs):** http://localhost:8082

O app inicializa e aplica as migrations no banco automaticamente. Ele já vem com um *seed* de dados iniciais.
Para testar a entrada primária, logue com:
- **Login:** `admin@medflow.com`
- **Senha:** `AdminPassword123!`
- **Role:** `ATTENDANT`

*(Novos usuários são cadastrados apenas pelo swagger).*

---

## O fluxo

1. **Autenticação** — O sistema possui dois papéis principais: `ATTENDANT` (Atendente) e `DOCTOR` (Médico). Apenas atendentes conseguem fazer o cadastro e envio (upload) de novos exames. Apenas médicos podem laudar.
2. **Upload (Atendente)** — O usuário logado envia os dados do paciente, anexando o exame. O sistema salva e define o status inicial como `PENDING`.
3. **Processamento (RabbitMQ)** — Um comando de processamento cai na fila. Um *background worker* consome a mensagem e avança o status do exame para `PROCESSING` e, após concluir a análise com sucesso, marca como `DONE`. (Falhas marcam como `ERROR`).
4. **Emissão de Laudo (Médico)** — Entrando com um usuário doutor, a listagem de pendências mostra apenas os exames concluídos (`DONE`). O médico insere o parecer do laudo, fechando o status final do exame em `REPORTED`.

---

## Modelo de dados

```
User ── Entidade principal de autenticação (UserRole)
   └── MedicalExam ── Representa o exame de um paciente
         ├── ExamStatus (PENDING, PROCESSING, DONE, ERROR, REPORTED)
         └── Doctor (Opcional, preenchido ao laudar)
```

A lógica de transição Status ou adição do texto do laudo é feita por métodos próprios do exame. Essas regras impedem um laudo de ser emitido para um exame que não esteja no status `DONE`.

---

## A arquitetura e a validação de regras

O backend é organizado utilizando a **Clean Architecture** e **CQRS com MediatR**.

As requisições inválidas nem chegam nos handlers elas são barradas no **Pipeline Behavior do MediatR**, que valida automaticamente e cospe os erros com Bad Request.

---

## Por que do RabbitMQ e do Background Service?

Inicialmente pensei até em utilizar o Hangfire, porém, no cenário onde houvesse uma analise de uma imagem junto com os dados, percebi que a escolha do rabbit seria mais adequada para a situação

O RabbitMQ entra porque em um processamento de exame em um cenario real ele pode demorar um certo tempo para ser processado, e não faz sentido o atendente esperar o processamento terminar para receber uma resposta. Logo se joga para uma fila, e o atendente já recebe o devido retorno.

Ao usar a mensageria:
- O atendente finaliza o upload imediatamente.
- O worker no background processa a demanda no tempo dele.
- Caso o processamento estoure um erro, se utiliza de uma segunda fila, DLQ, para que não se perca os dados daquele exame.

---

## O que fica de fora

Coisas que num sistema hospitalar real existiriam e aqui não foram implementadas:
- Tratamento de arquivos pesados em nuvem e visualizador universal DICOM/PACS.
- Assinatura digital do CFM validada (ICP-Brasil).
- Refresh Tokens e HttpOnly.
- Criptografia das informações dos laudos.
- Não se passa por uma real análise, e sim uma simulação com um delay, para mostrar como funcionaria o fluxo.


---

## Testes e Regras Gerais

Para consultar as especificações originais e regras de negócio do desafio técnico, as anotações continuam disponíveis em [`teste.md`](teste.md).

---

## Ferramentas de IA

Foi utilizado o auxílio de IA como ferramenta de co-piloto e pair programming, focada em acelerar a estruturação de *boilerplate*, escrita do manifesto do Docker, arquivos de Migrations do EF Core, linting de estilos de código e validação da modelagem de dados da Clean Architecture proposta no início do fluxo. A regra crítica do DDD, o CQRS, e as pipelines de mensageria foram revisadas para fechar o escopo técnico.

---

## Estrutura

```
src/
  MedFlow.Api/               Controllers HTTP enxutos, configurações do Swagger, DI, Serilog
  MedFlow.Application/       Features (Users, Exams), Commands/Queries (MediatR), FluentValidation
  MedFlow.Domain/            Modelos (MedicalExam, User), Enums, Exceções personalizadas
  MedFlow.Infrastructure/    DbContext (PostgreSQL), Repositórios, Workers e Integração com RabbitMQ
```
