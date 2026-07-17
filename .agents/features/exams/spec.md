# Especificações Técnicas - Módulo de Exames (`exams`)

Este documento detalha as definições técnicas, interfaces de dados e schemas para o módulo de exames.

## 1. Definições de Tipos (TypeScript)

### 1.1 Status do Exame
```typescript
export type ExamStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'ERROR' | 'REPORTED';
```

### 1.2 Objeto de Exame (Exam Dto)
```typescript
export interface Exam {
  id: string;
  fileName: string;
  status: ExamStatus;
  processingResult?: string | null;
  report?: string | null;
  created: string; // ISO DateTime
}
```

---

## 2. Integração com a API Backend

### 2.1 Upload de Exame
*   **Endpoint:** `POST /api/exams/upload`
*   **Método:** `POST`
*   **Cabeçalhos:** `Authorization: Bearer <token>`
*   **Payload (JSON):**
    ```typescript
    interface UploadExamRequest {
      fileName: string;
    }
    ```
*   **Resposta (200 OK):** Guid do exame cadastrado.

### 2.2 Listagem de Exames
*   **Endpoint:** `GET /api/exams`
*   **Método:** `GET`
*   **Cabeçalhos:** `Authorization: Bearer <token>`
*   **Resposta (200 OK):** `Exam[]` (retorna todos para Atendente, e apenas `DONE` para Médico).

### 2.3 Emissão de Laudo
*   **Endpoint:** `POST /api/exams/{id}/report`
*   **Método:** `POST`
*   **Cabeçalhos:** `Authorization: Bearer <token>`
*   **Payload (JSON):**
    ```typescript
    interface SubmitReportRequest {
      report: string;
    }
    ```
*   **Resposta (204 No Content):** Sucesso no processamento.

---

## 3. Validação de Formulários (Schemas Zod)

### 3.1 Schema de Cadastro/Upload de Exame
```typescript
import { z } from 'zod';

export const uploadExamSchema = z.object({
  fileName: z.string()
    .min(3, 'O nome do arquivo deve ter no mínimo 3 caracteres')
    .max(255, 'O nome do arquivo é muito longo'),
});

export type UploadExamFormData = z.infer<typeof uploadExamSchema>;
```

### 3.2 Schema de Emissão de Laudo
```typescript
import { z } from 'zod';

export const submitReportSchema = z.object({
  report: z.string()
    .min(1, 'O laudo médico não pode estar vazio')
    .min(10, 'O laudo deve conter pelo menos 10 caracteres'),
});

export type SubmitReportFormData = z.infer<typeof submitReportSchema>;
```
