# Checklist de Tarefas - Módulo de Autenticação (`auth`)

Lista de tarefas ordenadas para a implementação do módulo de autenticação.

## Tarefas de Setup e Infraestrutura da Feature
- [x] Definir interfaces TypeScript para `LoginRequest`, `LoginResponse`, `CreateUserRequest` e `DecodedToken` em `src/features/auth/types/index.ts`
- [x] Implementar chamadas HTTP `login` e `register` na pasta `src/features/auth/api/`
- [x] Criar o provedor de autenticação `AuthProvider` em `src/providers/AuthProvider.tsx` para gerenciar estado, login e logout
- [x] Criar componente de rota protegida `ProtectedRoute.tsx` em `src/routes/` para redirecionamento inteligente baseado em autenticação e roles

## Tarefas de UI e UX da Feature
- [x] Criar Zod schema de validação e formulário visual de Login (`LoginForm`) utilizando componentes de input e botão do MUI em `src/features/auth/components/LoginForm.tsx`
- [x] Criar Zod schema de validação e formulário visual de Registro (`RegisterForm`) utilizando seletor de perfil e inputs do MUI em `src/features/auth/components/RegisterForm.tsx`
- [x] Desenvolver a página `src/pages/auth/LoginPage.tsx` injetando o formulário e aplicando o estilo centrado elegante com gradiente de fundo
- [x] Desenvolver a página `src/pages/auth/RegisterPage.tsx` injetando o formulário de registro com estilização alinhada

## Tarefas de Integração e Testes
- [x] Integrar páginas de autenticação no sistema de roteamento do React Router Dom
- [x] Testar fluxo de login informando e-mail inválido, credenciais erradas e verificar tratamento de erro
- [x] Testar fluxo de registro de Atendente e Médico e confirmar redirecionamento correto
- [x] Testar proteção de rotas privadas e garantir que usuários sem token sejam jogados na tela de login
