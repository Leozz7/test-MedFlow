# Regras de Nomenclatura e Gerenciamento de Branches

Este projeto utiliza um padrão de nomenclatura de branches baseado em boas práticas de mercado (semelhante ao Git Flow / GitHub Flow e alinhado aos Conventional Commits). O objetivo é manter o repositório organizado, facilitar a identificação do propósito de cada branch e simplificar o processo de Code Review e CI/CD.

## 🌳 Branches Principais

- **`main`**: A branch principal de produção. O código nesta branch deve estar sempre estável e pronto para ser feito o deploy. **NUNCA** faça commits diretamente na `main`.

## 🌿 Branches de Trabalho (Tipos e Prefixos)

Todas as novas branches devem derivar da `main` (ou de uma branch de desenvolvimento acordada) e devem usar um dos prefixos abaixo, de acordo com o tipo de trabalho sendo realizado:

| Prefixo | Propósito | Exemplo |
| --- | --- | --- |
| `feat/` | Desenvolvimento de uma nova funcionalidade (feature). | `feat/dashboard-graficos` |
| `fix/` | Correção de um bug (erro) no sistema. | `fix/erro-login-google` |
| `hotfix/` | Correção crítica e urgente que vai direto para produção. | `hotfix/pagamento-duplicado` |
| `chore/` | Tarefas de manutenção, atualização de pacotes, configurações de build ou ferramentas (não altera código em produção). | `chore/atualiza-react-18` |
| `refactor/` | Refatoração de código que não adiciona novas funcionalidades nem corrige bugs. | `refactor/hook-carrinho` |
| `docs/` | Criação ou atualização de documentação (README, regras, etc). | `docs/regras-de-branch` |
| `test/` | Criação, ajuste ou correção de testes automatizados. | `test/cobertura-servico-email` |
| `style/` | Ajustes visuais de UI ou de formatação de código (espaçamento, aspas, etc). | `style/ajuste-padding-header` |

## 📐 Regras de Nomenclatura

Ao nomear sua branch, siga estas regras de ouro:

1. **Letras Minúsculas (Lowercase):** Use apenas letras minúsculas e sem acentos.
2. **Kebab-case:** Separe as palavras com hífens (`-`). Nunca use espaços, underlines (`_`) ou camelCase.
3. **Seja Curta e Descritiva:** O nome deve deixar claro o que a branch faz, mas sem ser um texto muito longo.
4. **Número da Tarefa (Opcional, mas recomendado):** Se a equipe estiver usando Jira, Trello, GitHub Issues, etc., inclua o ID da tarefa logo após o prefixo.
   - *Exemplo:* `feat/OFER-123-novo-filtro`

### ✅ Exemplos Corretos
- `feat/integra-pagarme`
- `fix/142-botao-desalinhado`
- `chore/update-dependencias-api`

### ❌ Exemplos Incorretos
- `NovaFeature` (Sem prefixo, CamelCase)
- `fix_bug_login` (Uso de underline em vez de hífen)
- `feat/adicionando-login-na-tela-principal-do-app` (Muito longo e prolixo)
- `main-nova` (Sem o prefixo que categoriza a branch)

## 🔄 Boas Práticas de Gerenciamento

1. **Branches de Vida Curta:** Evite manter branches abertas por semanas. Desenvolva, abra o Pull Request (PR) e faça o merge o mais rápido possível (preferencialmente iterativo) para evitar grandes conflitos.
2. **Sincronização Frequente:** Faça `git pull origin main` (ou `git rebase main`) frequentemente na sua branch local para mantê-la atualizada com o código base e resolver conflitos o quanto antes.
3. **Pull Requests (PRs):** Todo código deve ir para a branch principal através de um Pull Request.
4. **Delete Após o Merge:** Assim que a branch for mesclada (merged) na `main`, delete-a tanto localmente quanto no repositório remoto para manter a lista de branches limpa.
