# Análise e Plano de Implementação (Login via JWT)

## Análise do Estado Atual
**O que já temos:** O `AuthController` base, a Entidade `User` com senhas criptografadas (via Argon2), e a lógica inicial do `LoginHandler` na camada de Application.

**O que conflita/exige atenção:** O repositório utiliza uma interface `IPasswordHasher` que usa Argon2. Isso requer a chave `PasswordPepper` configurada no `appsettings.json`. Precisamos garantir que todos os handlers que criam usuários e realizam login utilizem essa mesma implementação.

**O que falta:**
1. A implementação concreta do gerador de Tokens (`TokenService`).
2. A configuração dos pacotes de Autenticação e JWT Bearer no `ServiceCollectionExtensions.cs`.
3. Ativar os middlewares de autenticação no pipeline.
4. Ligar a requisição final no `AuthController`.

## Open Questions (Questões em Aberto)
> [!WARNING]
> Há a implementação que usa Argon2 em `Common/Security/PasswordHasher.cs`. Você prefere que eu mantenha essa versão avançada e adapte os Handlers para usarem ela (adicionando "PasswordPepper" no appsettings.json), ou prefere usar uma versão mais simples baseada no próprio .NET BCrypt/Identity?

## Proposed Changes (Mudanças Propostas)

### 1. Configuração e Variáveis de Ambiente
Atualizar o `appsettings.json` para adicionar chaves estruturais para o JWT e Segurança:
```json
"Security": {
  "PasswordPepper": "PEPPER_SUPER_SECRETO_AQUI"
},
"Jwt": {
  "Key": "CHAVE_SUPER_SECRETA_DO_MEDFLOW_COM_MAIS_DE_32_CHARS",
  "Issuer": "MedFlowApi",
  "Audience": "MedFlowUsers"
}
```

### 2. Geração de Token JWT (Camada Infrastructure)
Criar `TokenService.cs` (em `Infrastructure/Authentication`) implementando a interface `ITokenService`.
A lógica utilizará `JwtSecurityTokenHandler` para gerar tokens contendo as claims de ID (`sub`), email e role.

### 3. Setup do JWT na API
Modificar `ServiceCollectionExtensions.cs` para adicionar `services.AddAuthentication().AddJwtBearer(...)`.
Modificar `ApplicationBuilderExtensions.cs` para descomentar `app.UseAuthentication()` e `app.UseAuthorization()`.

### 4. Handler e Controller
Modificar `LoginHandler.cs` para chamar o repositório e validar a senha com o hash do banco.
Modificar `AuthController.cs` para enviar a request (`LoginQuery`) e retornar o token.
