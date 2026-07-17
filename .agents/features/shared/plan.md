# Plano de Desenvolvimento - Estruturas Globais e Compartilhadas (`shared`)

Este documento planeja os passos práticos para estruturar a base da aplicação frontend.

## 1. Arquivos a serem Criados/Modificados

*   `[NEW]` `src/lib/axios.ts`: Instanciação do Axios com URL base e interceptadores.
*   `[NEW]` `src/providers/ThemeProvider.tsx`: Componente provedor de estilos do MUI com tema personalizado.
*   `[NEW]` `src/providers/NotificationProvider.tsx`: Componente provedor de Snackbars para toasts de notificação.
*   `[NEW]` `src/routes/AppRoutes.tsx`: Configuração de roteamento de páginas.
*   `[NEW]` `src/routes/ProtectedRoute.tsx`: Componente interceptador de segurança para rotas baseadas em perfis.
*   `[NEW]` `src/components/Navbar.tsx`: Barra de navegação superior comum para os dashboards.
*   `[NEW]` `src/types/index.ts`: Interfaces de dados globais (ex: User e tipos comuns).
*   `[NEW]` `.env`: Variáveis de ambiente da aplicação.

## 2. Fluxo de Execução Técnica

1.  **Inicialização do Vite:** Executar comando para criar o projeto em React + TypeScript.
2.  **Instalação de Dependências:** Instalar MUI, Axios, React Router Dom, etc.
3.  **Configuração de Ambiente & Axios:** Criar arquivo `.env` e inicializar o arquivo `axios.ts` com interceptadores de autorização e tratamento de erro 401.
4.  **Estrutura de Temas e Notificações:**
    *   Criar o tema customizado no MUI.
    *   Criar o `NotificationProvider` com context API para permitir chamar toasts de qualquer tela da aplicação.
5.  **Roteamento e Proteção:**
    *   Criar roteamento de fallback, login e dashboards.
    *   Implementar `ProtectedRoute` validando se o usuário está logado e se sua role bate com a role permitida na rota.
6.  **Componentes Comuns:** Criar Navbar global com logout e identificação do perfil conectado.
