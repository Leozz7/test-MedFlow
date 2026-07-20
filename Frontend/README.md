# MedFlow Web (Frontend)

Cliente SPA (Single Page Application) do sistema MedFlow.

## Tecnologias

- React 18 e TypeScript
- Vite
- Material UI (MUI)
- React Router
- React Hook Form e Zod
- Axios

## Estrutura de Diretórios

- `src/components/`: Componentes visuais genéricos e reutilizáveis
- `src/pages/`: Telas agrupadas por contexto (doctor, attendant, auth)
- `src/services/`: Configuração do Axios e abstração de requisições
- `src/routes/`: Roteamento e Guards de autenticação
- `src/utils/`: Funções utilitárias

## Autenticação e Segurança

- Utilização de JWT gerenciado no `localStorage`.
- Interceptors do Axios para injeção automática de header `Authorization` e tratamento global de erros HTTP 401.
- Role-Based Routing através de PrivateRoutes, protegendo telas de acordo com a permissão (ATTENDANT ou DOCTOR).

## Execução Local (Standalone)

Para rodar o frontend isoladamente, fora do Docker:

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor:
   ```bash
   npm run dev
   ```

3. Acesse em `http://localhost:5173`. 
*(Lembre-se de rodar a API localmente na porta 8080).*
