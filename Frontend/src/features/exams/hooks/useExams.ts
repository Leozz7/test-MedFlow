import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExamsRequest, uploadExamRequest, submitReportRequest } from '../api/exams';
import type { UploadExamRequest, SubmitReportRequest, ExamDto } from '../types';

/**
 * buscar a lista de exames.
 */
export function useExamsQuery() {
  return useQuery<ExamDto[]>({
    queryKey: ['exams'],
    queryFn: getExamsRequest,
    refetchInterval: (query) => {
      const exams = query.state.data;
      const hasPendingOrProcessing = exams?.some(
        (exam) => exam.status === 'PENDING' || exam.status === 'PROCESSING'
      );
      return hasPendingOrProcessing ? 4000 : false;
    },
  });
}

/**
 * cadastrar um novo exame.
 */
export function useUploadExamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadExamRequest) => uploadExamRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

/**
 * emitir laudo de um exame (médico).
 */
export function useSubmitReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubmitReportRequest }) =>
      submitReportRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}
