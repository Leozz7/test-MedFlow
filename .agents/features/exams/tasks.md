# Checklist de Tarefas - Módulo de Exames (`exams`)

Lista de tarefas ordenadas para a implementação do módulo de exames.

## Tarefas de Setup e Serviços API
- [ ] Definir interfaces TypeScript para `Exam`, `ExamStatus` e requests de envio em `src/features/exams/types/index.ts`
- [ ] Criar funções de chamada Axios para `uploadExam`, `getExams` e `submitReport` em `src/features/exams/api/`

## Tarefas de UI - Dashboard do Atendente
- [ ] Desenvolver componente `UploadExamForm.tsx` com input Zod de nome de arquivo e submissão
- [ ] Desenvolver tabela de listagem `ExamListTable.tsx` mapeando cores de status com `Chip`
- [ ] Implementar a lógica de atualização automática por polling (4s) na listagem
- [ ] Unificar os componentes na página `src/pages/exams/AttendantDashboard.tsx` incluindo Navbar com logout

## Tarefas de UI - Dashboard do Médico
- [ ] Desenvolver componente de card individual `DoctorExamCard.tsx` para exibir os exames com status `DONE`
- [ ] Criar modal de emissão de laudo `ReportModal.tsx` com campo multilinha e contador de caracteres
- [ ] Implementar validação Zod para exigir pelo menos 10 caracteres no laudo
- [ ] Conectar submissão de laudo à API e ocultar o exame da tela após sucesso
- [ ] Unificar os componentes na página `src/pages/exams/DoctorDashboard.tsx`

## Integração Geral
- [ ] Ligar os dashboards no roteador privado da aplicação
- [ ] Simular fluxos completos ponta a ponta junto ao Docker do backend (envio -> processamento -> laudo)
