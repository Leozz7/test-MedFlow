# Requisitos - Estruturas Globais e Compartilhadas (`shared`)

Este documento detalha os requisitos funcionais e estruturais globais que suportam toda a aplicação frontend do MedFlow.

## 1. Descrição
O módulo de compartilhados (`shared`) e infraestrutura global gerencia a configuração básica do projeto, cliente HTTP central, gerenciamento de temas (MUI Theme), roteamento da aplicação, sistema de notificações globais e componentes comuns de UI (ex: layout de containers, cabeçalhos comuns).

## 2. Requisitos Estruturais

### RE-01: Configuração HTTP e Tratamento de Erros
*   O frontend deve utilizar uma instância única do Axios configurada com a URL base da API.
*   Deve existir um interceptor de requisições que anexa o token JWT armazenado em todas as chamadas.
*   Deve existir um interceptor de respostas que trate erros de forma global:
    *   Erro `401 Unauthorized`: Se o token expirar ou for inválido, o sistema deve limpar o armazenamento local e redirecionar o usuário imediatamente para a tela de login.

### RE-02: Gerenciamento de Rotas Protegidas
*   O roteador deve controlar o acesso às URLs da aplicação.
*   **Rotas Públicas:** `/login` e `/register` (se o usuário já estiver logado, ele deve ser redirecionado para o seu dashboard).
*   **Rotas Privadas:** Protegidas por autenticação.
*   **Controle de Perfil (Role-Based Access Control - RBAC):**
    *   Apenas usuários com `role = ATTENDANT` acessam `/dashboard/attendant`.
    *   Apenas usuários com `role = DOCTOR` acessam `/dashboard/doctor`.

### RE-03: Notificações Flutuantes (Toast / Snackbar)
*   A aplicação deve possuir um sistema centralizado de alertas (Notificações Toast) para exibir feedbacks de sucesso, informação, aviso e erro de forma flutuante e temporizada (ex: fecha após 4 segundos).

### RE-04: Layout Responsivo e Acessibilidade
*   O layout geral da aplicação deve ser responsivo, adaptando-se perfeitamente a dispositivos móveis, tablets e computadores desktop.
