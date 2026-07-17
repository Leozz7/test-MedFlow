# Requisitos - Módulo de Autenticação (`auth`)

Este documento detalha os requisitos de negócio e funcionais do módulo de Autenticação do MedFlow.

## 1. Descrição do Módulo
O módulo de autenticação é responsável por gerenciar a identificação, autenticação e autorização dos usuários (Atendentes e Médicos) na plataforma, garantindo que cada perfil acesse apenas os recursos condizentes com seu papel de acesso.

## 2. Perfis de Acesso (Roles)
*   **ATTENDANT (Atendente):** Perfil responsável por gerenciar o cadastro e upload inicial de exames.
*   **DOCTOR (Médico):** Perfil responsável por avaliar exames prontos e emitir laudos técnicos.

## 3. Requisitos Funcionais

### RF-01: Cadastro de Usuário (Registro)
*   O sistema deve permitir o cadastro de novos usuários.
*   Os campos obrigatórios são: Nome, E-mail, Senha e Papel de Acesso (Perfis: `ATTENDANT` ou `DOCTOR`).
*   O endpoint de cadastro deve ser público.

### RF-02: Login do Usuário
*   O usuário deve conseguir autenticar-se utilizando E-mail e Senha.
*   O sistema deve validar as credenciais junto ao backend (`POST /api/auth/login`).
*   Em caso de sucesso, o backend retorna um JWT contendo no seu payload as claims `sub` (Id do usuário), `email` e `role`.

### RF-03: Armazenamento Seguro do Token
*   O JWT retornado pela API deve ser armazenado localmente de forma persistente (`localStorage`) no navegador para manter a sessão ativa.
*   O token deve ser limpo ao efetuar logout.

### RF-04: Controle de Acesso e Redirecionamento Dinâmico
*   Ao logar, o sistema deve decodificar o JWT para ler a claim `role`.
*   Com base na role, o usuário deve ser redirecionado para a página correspondente:
    *   `ATTENDANT` → Dashboard de Atendente (`/dashboard/attendant`)
    *   `DOCTOR` → Dashboard de Médico (`/dashboard/doctor`)
*   Se um usuário não autenticado tentar acessar uma rota privada, ele deve ser redirecionado para a tela de login (`/login`).
*   Se um usuário autenticado tentar acessar uma rota não permitida para o seu papel (ex: um atendente tentando acessar o dashboard do médico), ele deve ser bloqueado e ver uma página de erro ou de acesso negado.
