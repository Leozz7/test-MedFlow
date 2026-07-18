import api from '@/lib/axios';
import type { ExamDto, UploadExamRequest, SubmitReportRequest } from '../types';

/**
 * lista de exames cadastrados
 */
export async function getExamsRequest(): Promise<ExamDto[]> {
  const response = await api.get<ExamDto[]>('/api/exams');
  return response.data;
}

/**
 * Cadastra um novo exame na fila de processamento.
 */
export async function uploadExamRequest(data: UploadExamRequest): Promise<string> {
  const response = await api.post<string>('/api/exams/upload', data);
  return response.data;
}

/**
 * Emite o laudo para um exame específico (apenas Médicos).
 */
export async function submitReportRequest(id: string, data: SubmitReportRequest): Promise<void> {
  await api.post(`/api/exams/${id}/report`, data);
}
