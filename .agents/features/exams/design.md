# Design do Sistema - Módulo de Exames (`exams`)

Este documento define a interface e experiência visual para os dashboards de Atendente e Médico.

## 1. Dashboard do Atendente (`AttendantDashboard`)

### 1.1 Layout e Grid
*   **Barra Superior (Navbar):** Cabeçalho contendo o logo do MedFlow, identificação do usuário ("Olá, Atendente Fulano") e botão moderno de logout.
*   **Seção de Cadastro (Upload):** Um card lateral ou área superior contendo um formulário limpo para cadastro do exame. Pode incluir uma área de "Drag and Drop" para arquivos fictícios ou simplesmente um campo de seleção rápida que preenche automaticamente o nome do arquivo.
*   **Seção de Listagem:** Uma tabela ocupando a largura principal, com paginação e design limpo.

### 1.2 Mapeamento de Cores para Status (`Chips`)
*   `PENDING`: Amarelo/Laranja sutil (Aguardando processamento).
*   `PROCESSING`: Azul pulsante (Processando no RabbitMQ).
*   `DONE`: Verde sutil (Processamento concluído).
*   `ERROR`: Vermelho destacado (Erro de processamento).
*   `REPORTED`: Roxo sutil (Laudado pelo médico).

---

## 2. Dashboard do Médico (`DoctorDashboard`)

### 2.1 Lista de Pendências
*   Design em formato de **Cards Dinâmicos** ou **Linhas de Tabela Interativas** destacando os exames prontos (`DONE`).
*   Cada card/linha mostra o nome do arquivo, a data em que foi processado e um botão destacado: **"Emitir Laudo"**.

### 2.2 Modal de Emissão de Laudo
*   Ao clicar em "Emitir Laudo", abre-se um `Dialog` do MUI centralizado.
*   O modal exibe o nome do arquivo do exame selecionado.
*   Contém um campo de texto (`TextField`) multilinha expandido, incentivando o preenchimento detalhado.
*   Um contador de caracteres dinâmico é exibido no canto inferior (ex: "Mínimo: 10 caracteres. Digitado: X").
*   Botões de ação: "Cancelar" e "Enviar Laudo" (destacado em verde ou azul médico).

---

## 3. Feedbacks Visuais e UX
*   **Efeito de Transição de Exame:** Quando o médico envia o laudo, o card/linha correspondente deve realizar uma animação de fade-out suave antes de sumir da tela.
*   **Esqueletos de Carregamento (Skeletons):** Durante a primeira carga da lista de exames, exibir linhas falsas piscantes (`Skeleton`) para melhorar a percepção de tempo de resposta.
*   **Toast Notifications (Snackbar):** Mensagens flutuantes no canto da tela informando "Exame cadastrado com sucesso!" ou "Laudo enviado com sucesso!".
