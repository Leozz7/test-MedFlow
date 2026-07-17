# Plano de Desenvolvimento - Módulo de Autenticação (`auth`)

Este documento planeja os passos práticos para implementar o módulo de Autenticação.

## 1. Arquivos a serem Criados/Modificados

*   `[NEW]` `src/features/auth/types/index.ts`: Interfaces de requisição, resposta e token decodificado.
*   `[NEW]` `src/features/auth/api/login.ts`: Chamada HTTP de autenticação utilizando Axios.
*   `[NEW]` `src/features/auth/api/register.ts`: Chamada HTTP de criação de usuário utilizando Axios.
*   `[NEW]` `src/features/auth/components/LoginForm.tsx`: Formulário de login utilizando `react-hook-form`, `zod` e MUI.
*   `[NEW]` `src/features/auth/components/RegisterForm.tsx`: Formulário de registro utilizando `react-hook-form`, `zod` e MUI.
*   `[NEW]` `src/features/auth/index.ts`: Arquivo de exportação da feature.
*   `[NEW]` `src/providers/AuthProvider.tsx`: Criação do Contexto de Autenticação global.
*   `[NEW]` `src/routes/ProtectedRoute.tsx`: Componente de rota protegida que valida o token e o perfil (role) do usuário.
*   `[NEW]` `src/pages/auth/LoginPage.tsx`: Página de login.
*   `[NEW]` `src/pages/auth/RegisterPage.tsx`: Página de registro.

## 2. Fluxo de Execução Técnica

1.  **Modelar Tipos:** Criar tipos e interfaces TS para login, registro e dados de usuário do token decodificado.
2.  **Configurar Chamadas HTTP:** Criar as chamadas Axios simples que disparam requisições aos endpoints do backend e tratam respostas.
3.  **Desenvolver o Contexto de Autenticação:**
    *   No `AuthProvider`, implementar a lógica de verificar no carregamento se o token está no `localStorage`.
    *   Se estiver presente e não expirado, decodificar e salvar os dados do usuário em memória.
    *   Fornecer as funções `login` (chama API, salva token, decodifica e define estado) e `logout` (apaga token, redefine estado).
4.  **Criar Componentes de Formulários:** Construir `LoginForm` e `RegisterForm` integrados com MUI e validados com Zod schemas.
5.  **Implementar as Telas:** Ligar os formulários às páginas `LoginPage` e `RegisterPage`.
6.  **Configurar Rotas:** Integrar o `ProtectedRoute` no roteamento global para restringir acessos.
