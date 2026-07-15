# Especificação da Funcionalidade de Login e Autenticação

## 1. Visão Geral
A funcionalidade de Login tem como objetivo autenticar usuários do sistema MedFlow (Médicos e Atendentes) validando suas credenciais de acesso (Email e Senha) e, em caso de sucesso, emitir um Token de Acesso (JWT) que deverá ser usado para acessar as rotas protegidas da API.

## 2. Casos de Uso (User Stories)
- **Como** Médico ou Atendente cadastrado, **quero** poder realizar login informando meu E-mail e minha Senha, **para** que eu consiga acessar o sistema.
- **Como** sistema MedFlow, **quero** bloquear o acesso a rotas privadas caso o requisitante não forneça um Token de Acesso válido, **para** garantir a segurança dos dados médicos.

## 3. Regras de Negócio
- **RN01 - Validação de Credenciais:** O sistema deve validar se o e-mail informado existe na base de dados. Caso exista, deve aplicar o algoritmo de validação de hash sobre a senha informada em plain-text e comparar com o hash salvo no banco de dados.
- **RN02 - Resposta Negativa (Falha):** Em caso de e-mail não encontrado ou senha inválida, a API deve retornar o status HTTP `401 Unauthorized`. Por questões de segurança, a mensagem de erro deve ser genérica: *"E-mail ou senha incorretos"*, evitando revelar se o e-mail existe ou não.
- **RN03 - Emissão do Token (Sucesso):** Se as credenciais forem válidas, a API deve gerar e retornar um token JWT.
- **RN04 - Conteúdo do Token (Claims):** O token JWT deve conter, no mínimo, as seguintes claims:
  - `sub`: O Identificador Único (ID) do usuário.
  - `email`: O endereço de e-mail do usuário.
  - `role`: O perfil de acesso do usuário (Ex: `DOCTOR` ou `ATTENDANT`).
- **RN05 - Expiração do Token:** O token deve ter um tempo de vida (TTL) configurável e limitado (ex: 2 horas), após o qual será necessário um novo login.

## 4. Interfaces de Comunicação (API)

### Endpoint: POST `/api/auth/login`

**Request Body (JSON):**
```json
{
  "email": "medico@medflow.com",
  "password": "SenhaSuperSegura123!"
}
```

**Response - 200 OK:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOi..."
}
```

**Response - 401 Unauthorized:**
```json
{
  "title": "Unauthorized",
  "status": 401,
  "detail": "E-mail ou senha incorretos."
}
```
