---
trigger: always_on
---

# Regras de Commits (Conventional Commits)

Este projeto utiliza um padrão simplificado e direto para mensagens de commit, baseado no Conventional Commits. Isso facilita a leitura do histórico por humanos e por agentes de IA.

## Estrutura do Commit

```
<tipo>: <descrição curta e direta>
```

## Tipos Permitidos

- **feat**: Adição de uma nova funcionalidade (feature) no projeto.
  *Ex: `feat: cria tela de gerenciamento de motoristas`*

- **fix**: Correção de um bug ou erro em código existente.
  *Ex: `fix: corrige falha no salvamento da escola no banco`*

- **chore**: Atualização de ferramentas de build, configuração de pacotes (npm/nuget), docker ou CI/CD (não altera código de produção).
  *Ex: `chore: atualiza pacotes do react e vite`*

- **refactor**: Refatoração de código que não adiciona nova funcionalidade nem corrige bug (ex: melhoria de performance, extração de componentes).
  *Ex: `refactor: extrai logica da api para um hook customizado`*

- **style**: Alterações puramente visuais na UI ou na formatação de código (espaços, linting, aspas).
  *Ex: `style: ajusta o padding lateral da tela de alunos`*

- **docs**: Alterações na documentação (README, arquivos Markdown, etc).
  *Ex: `docs: adiciona o arquivo de regras de commits`*

- **test**: Adição ou correção de testes automatizados (unitários, integração).
  *Ex: `test: adiciona cobertura de teste no handler do MediatR`*

## Boas Práticas (Regras de Ouro)

1. **Seja Direto e Imperativo:** Escreva a descrição como se fosse uma ordem (tempo imperativo presente).
   - ✅ Certo: `feat: adiciona componente de tabela`
   - ❌ Errado: `feat: adicionei a tabela` ou `feat: adicionando tabela`

2. **Letras Minúsculas:** Inicie a descrição com letra minúscula e não coloque ponto final.
   - ✅ Certo: `fix: resolve crash no mapa`
   - ❌ Errado: `fix: Resolve crash no mapa.`

3. **Commits Pequenos (Atômicos):** Não junte várias coisas diferentes em um commit só. Se você alterou o backend e o frontend em tarefas distintas, faça dois commits separados.
