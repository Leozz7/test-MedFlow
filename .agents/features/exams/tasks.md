# Checklist de Tarefas - Módulo de Exames (`exams`)

Lista de tarefas ordenadas para a implementação do módulo de exames.

## Tarefas de Setup e Serviços API
- [x] Definir interfaces TypeScript para `Exam`, `ExamStatus` e requests de envio em `src/features/exams/types/index.ts`
- [x] Criar funções de chamada Axios para `uploadExam`, `getExams` e `submitReport` em `src/features/exams/api/`

## Tarefas de UI - Dashboard do Atendente
- [x] Desenvolver componente `UploadExamForm.tsx` com input Zod de nome de arquivo e submissão
- [x] Desenvolver tabela de listagem `ExamListTable.tsx` mapeando cores de status com `Chip`
- [x] Implementar a lógica de atualização automática por polling (4s) na listagem
- [x] Unificar os componentes na página `src/pages/exams/AttendantDashboard.tsx` incluindo Navbar com logout

## Tarefas de UI - Dashboard do Médico
- [x] Desenvolver componente de card individual `DoctorExamCard.tsx` para exibir os exames com status `DONE`
- [x] Criar modal de emissão de laudo `ReportModal.tsx` com campo multilinha e contador de caracteres
- [x] Implementar validação Zod para exigir pelo menos 10 caracteres no laudo
- [x] Conectar submissão de laudo à API e ocultar o exame da tela após sucesso
- [x] Unificar os componentes na página `src/pages/exams/DoctorDashboard.tsx`

## Integração Geral
- [x] Ligar os dashboards no roteador privado da aplicação
- [x] Simular fluxos completos ponta a ponta junto ao Docker do backend (envio -> processamento -> laudo)
