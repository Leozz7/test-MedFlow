# Regras de Desenvolvimento Frontend (MedFlow.Web)

Este projeto frontend em **Next.js 15** e **React** adota uma **Arquitetura Orientada a Funcionalidades (Feature-Sliced Design / Feature-Based)** e segue os princípios da arquitetura **Bulletproof React** para garantir escalabilidade, manutenibilidade e alta qualidade de código.

## 1. Princípios Gerais e Tecnologias

- **Next.js 15 & React:** Utilizando as convenções mais recentes (App Router).
- **TypeScript:** Tipagem estrita em todo o código. O uso de "any" é desencorajado e deve ser evitado.
- **Material UI (MUI):** Biblioteca padrão de componentes UI. Customizações devem seguir o tema global.
- **Axios & Data Fetching:** Utilizado para comunicação com a API.
- **React Hook Form & Zod:** Gerenciamento e validação de formulários.
- **Arquitetura Bulletproof / Orientada a Funcionalidades:** O código deve ser organizado por "features" (ex: auth, exams), encapsulando componentes, hooks, tipos e lógicas específicas dentro da sua respectiva feature.

## 2. Estrutura de Diretórios (Feature-Oriented)

A estrutura de pastas deve seguir o padrão:

```text
src/
├── app/                  # Roteamento do Next.js (App Router) - Agrega e consome features
├── components/           # Componentes globais/reutilizáveis (UI components genéricos, Layouts, botões, etc)
├── config/               # Configurações globais (constantes, variáveis de ambiente)
├── features/             # Módulos orientados a funcionalidades (CORAÇÃO DA ARQUITETURA)
│   ├── auth/             # Exemplo de Feature: Autenticação
│   │   ├── api/          # Chamadas de API específicas da feature (Axios)
│   │   ├── components/   # Componentes UI exclusivos da feature (ex: LoginForm)
│   │   ├── hooks/        # Custom hooks de negócio da feature
│   │   ├── types/        # Tipagens do TypeScript específicas da feature
│   │   └── index.ts      # Ponto de entrada (Public API) da feature
│   └── exams/            # Exemplo de Feature: Exames
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── index.ts
├── hooks/                # Hooks globais compartilhados (ex: useDebounce)
├── lib/                  # Configurações de bibliotecas de terceiros (ex: configuração do MUI, axios instance)
├── types/                # Tipagens globais do sistema
└── utils/                # Funções utilitárias globais (ex: formatação de data)
```

## 3. Padrões de Código e Regras de Implementação

### 3.1 Isolamento de Features
- Uma feature **NÃO** deve importar arquivos internos de outra feature diretamente. A comunicação inter-features deve ocorrer apenas através dos arquivos `index.ts` (Public API da feature).
- Tudo o que for específico de um domínio (como lógica de `exams`) deve ficar restrito ao diretório da respectiva feature.

### 3.2 Formulários e Validações
- Todo formulário deve ser construído utilizando **React Hook Form**.
- Toda validação de input deve ser definida através de schemas do **Zod**, alinhando-se às regras de negócio esperadas pela API.

### 3.3 Comunicação com a API e Estado Assíncrono
- As requisições HTTP devem ser encapsuladas na camada `api/` dentro de cada feature usando **Axios**.
- O token JWT recebido no login deve ser armazenado de forma segura (cookies ou localStorage dependendo da arquitetura de fetch SSR/CSR) e injetado automaticamente via Interceptors no Axios.
- Implementar mecanismos de atualização em tempo real ou "polling" nas listagens do Dashboard do Atendente, visando refletir mudanças de status assíncronas do backend (`PENDING` -> `PROCESSING` -> `DONE`).

### 3.4 Autenticação e Autorização (Role-Based)
- Rotas e componentes protegidos devem validar a `role` (`ATTENDANT` ou `DOCTOR`).
- O sistema deve bloquear ou redirecionar o usuário caso tente acessar fluxos não permitidos pela sua `role` (ex: Atendente não pode emitir laudo).
- Apenas usuários não autenticados devem ter acesso à tela de Login/Cadastro, sendo redirecionados para seu dashboard logo após a autenticação.

### 3.5 Estilização e UI (MUI)
- Priorizar a utilização do sistema de tema (`ThemeProvider`) e componentes nativos do **Material UI (MUI)**.
- Utilizar a prop `sx` para customizações pontuais de estilo e garantir que a paleta de cores reflita corretamente os diferentes estados (cores claras e semânticas para `PENDING`, `PROCESSING`, `DONE`, `ERROR`, `REPORTED`).
