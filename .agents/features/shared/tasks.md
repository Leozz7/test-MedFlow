# Checklist de Tarefas - Estruturas Globais e Compartilhadas (`shared`)

Lista de tarefas ordenadas para a implementação da base global do frontend.

## Inicialização e Bibliotecas
- [x] Inicializar o projeto React + Vite com TypeScript na pasta `Frontend/`
- [x] Instalar pacotes NPM essenciais (`@mui/material`, `@emotion/react`, `@emotion/styled`, `axios`, `react-router-dom`, `jwt-decode`, `react-hook-form`, `zod`, `@hookform/resolvers`)
- [x] Limpar arquivos padrão do Vite (`App.css`, `index.css` iniciais) e criar estrutura de pastas recomendada em `src/`

## Configuração do Core e API
- [x] Criar arquivo `.env` com a variável `VITE_API_URL` apontando para o endereço local da API (ex: `http://localhost:5001`)
- [x] Implementar cliente Axios configurado com interceptores para injeção de token e captura automática de erro 401 em `src/lib/axios.ts`

## Provedores de Estilo e Notificações
- [x] Configurar tema personalizado do MUI (paleta azul médico, fontes customizadas, e cantos arredondados) em `src/providers/ThemeProvider.tsx`
- [x] Criar o provedor de mensagens e alertas flutuantes `NotificationProvider.tsx` em `src/providers/` exposto via hook simples (ex: `useNotification`)

## Roteamento e Layouts
- [x] Criar o componente de Navbar global responsivo contendo botão de logout e dados do usuário conectado
- [x] Implementar a estrutura de roteamento do `react-router-dom` em `src/routes/AppRoutes.tsx`
- [x] Integrar proteção e restrições de rotas baseadas em roles no `ProtectedRoute.tsx`
