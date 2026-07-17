# Checklist de Tarefas - Módulo de Autenticação (`auth`)

Lista de tarefas ordenadas para a implementação do módulo de autenticação.

## Tarefas de Setup e Infraestrutura da Feature
- [ ] Definir interfaces TypeScript para `LoginRequest`, `LoginResponse`, `CreateUserRequest` e `DecodedToken` em `src/features/auth/types/index.ts`
- [ ] Implementar chamadas HTTP `login` e `register` na pasta `src/features/auth/api/`
- [ ] Criar o provedor de autenticação `AuthProvider` em `src/providers/AuthProvider.tsx` para gerenciar estado, login e logout
- [ ] Criar componente de rota protegida `ProtectedRoute.tsx` em `src/routes/` para redirecionamento inteligente baseado em autenticação e roles

## Tarefas de UI e UX da Feature
- [ ] Criar Zod schema de validação e formulário visual de Login (`LoginForm`) utilizando componentes de input e botão do MUI em `src/features/auth/components/LoginForm.tsx`
- [ ] Criar Zod schema de validação e formulário visual de Registro (`RegisterForm`) utilizando seletor de perfil e inputs do MUI em `src/features/auth/components/RegisterForm.tsx`
- [ ] Desenvolver a página `src/pages/auth/LoginPage.tsx` injetando o formulário e aplicando o estilo centrado elegante com gradiente de fundo
- [ ] Desenvolver a página `src/pages/auth/RegisterPage.tsx` injetando o formulário de registro com estilização alinhada

## Tarefas de Integração e Testes
- [ ] Integrar páginas de autenticação no sistema de roteamento do React Router Dom
- [ ] Testar fluxo de login informando e-mail inválido, credenciais erradas e verificar tratamento de erro
- [ ] Testar fluxo de registro de Atendente e Médico e confirmar redirecionamento correto
- [ ] Testar proteção de rotas privadas e garantir que usuários sem token sejam jogados na tela de login
