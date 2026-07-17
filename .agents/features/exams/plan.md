# Plano de Desenvolvimento - Módulo de Exames (`exams`)

Este documento planeja os passos práticos para implementar o módulo de Exames.

## 1. Arquivos a serem Criados/Modificados

*   `[NEW]` `src/features/exams/types/index.ts`: Interfaces de exames, tipos de status e DTOs de envio.
*   `[NEW]` `src/features/exams/api/uploadExam.ts`: Integração HTTP para enviar o exame (`POST /api/exams/upload`).
*   `[NEW]` `src/features/exams/api/getExams.ts`: Integração HTTP para listar exames (`GET /api/exams`).
*   `[NEW]` `src/features/exams/api/submitReport.ts`: Integração HTTP para enviar o laudo (`POST /api/exams/{id}/report`).
*   `[NEW]` `src/features/exams/components/UploadExamForm.tsx`: Componente de upload/cadastro para o Atendente.
*   `[NEW]` `src/features/exams/components/ExamListTable.tsx`: Tabela de listagem geral com polling automático.
*   `[NEW]` `src/features/exams/components/DoctorExamCard.tsx`: Card de exame pronto para o Médico.
*   `[NEW]` `src/features/exams/components/ReportModal.tsx`: Modal para preenchimento e envio de laudo.
*   `[NEW]` `src/features/exams/index.ts`: Ponto de entrada exportando os dashboards e componentes necessários.
*   `[NEW]` `src/pages/exams/AttendantDashboard.tsx`: Página de dashboard do Atendente.
*   `[NEW]` `src/pages/exams/DoctorDashboard.tsx`: Página de dashboard do Médico.

## 2. Fluxo de Execução Técnica

1.  **Modelagem e Serviços API:** Criar os tipos de dados e funções Axios (`getExams`, `uploadExam`, `submitReport`) anexando os cabeçalhos de autenticação.
2.  **Dashboard do Atendente:**
    *   Desenvolver `ExamListTable` mapeando os status para `Chips` coloridos.
    *   Adicionar o hook customizado `useInterval` de polling dinâmico de 4 segundos.
    *   Desenvolver `UploadExamForm` utilizando formulário validado Zod para disparar o upload e resetar os campos.
3.  **Dashboard do Médico:**
    *   Criar o grid de `DoctorExamCard` filtrando as pendências.
    *   Implementar o `ReportModal` integrando validação de formulário (tamanho mínimo do laudo).
    *   Configurar a remoção do exame da lista após a submissão.
4.  **Criação das Páginas:** Unificar os blocos de componentes em `AttendantDashboard` e `DoctorDashboard`.
