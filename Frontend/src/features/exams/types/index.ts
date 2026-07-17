export type ExamStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'ERROR' | 'REPORTED';

export interface ExamDto {
  id: string;
  fileName: string;
  status: ExamStatus;
  processingResult?: string | null;
  report?: string | null;
  created: string; // ISO DateTime string
}

export interface UploadExamRequest {
  fileName: string;
}

export interface SubmitReportRequest {
  report: string;
}
