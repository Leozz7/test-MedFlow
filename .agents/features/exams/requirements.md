# Requisitos - Módulo de Exames (`exams`)

Este documento detalha os requisitos de negócio e funcionais do módulo de gerenciamento de exames médicos do MedFlow.

## 1. Descrição do Módulo
O módulo de exames engloba o fluxo de gerenciamento de exames: cadastro/upload pelo atendente, visualização do processamento assíncrono e preenchimento/envio do laudo técnico pelo médico habilitado.

## 2. Requisitos Funcionais

### RF-01: Cadastro de Novo Exame
*   Apenas usuários com o perfil `ATTENDANT` podem cadastrar exames.
*   O sistema deve disponibilizar um formulário para envio de novos exames.
*   O formulário deve solicitar o arquivo ou o nome do arquivo. O sistema cria o exame no backend com o status inicial `PENDING`.
*   Após o envio com sucesso, a lista de exames deve ser atualizada e o exame entra no fluxo assíncrono de processamento.

### RF-02: Listagem Geral de Exames (Atendente)
*   Atendentes devem visualizar a lista completa de todos os exames cadastrados na plataforma.
*   A tabela deve exibir o nome do arquivo, a data de criação, o status de processamento e o resultado/detalhe do processamento (especialmente erros se houver).

### RF-03: Atualização Automática de Status (Polling)
*   O dashboard do atendente deve atualizar automaticamente o status dos exames a cada 4 segundos, permitindo acompanhar em tempo real as transições:
    `PENDING` → `PROCESSING` → `DONE` ou `ERROR`.

### RF-04: Listagem de Pendências de Laudos (Médico)
*   Médicos devem visualizar **apenas** exames que estejam prontos para laudo, ou seja, exames com o status `DONE`.
*   Exames com outros status (como `PENDING` ou `PROCESSING`) não devem aparecer na lista do médico.

### RF-05: Emissão de Laudo Técnico (Médico)
*   Apenas usuários com perfil `DOCTOR` podem emitir laudos.
*   O laudo técnico deve ser preenchido em formato texto.
*   O campo de laudo é obrigatório e deve ter no mínimo 10 caracteres.
*   Ao submeter com sucesso, o status do exame é atualizado para `REPORTED`.
*   Após a submissão do laudo, o exame correspondente deve desaparecer automaticamente da lista de pendências do médico.
