import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import type { ExamStatus } from '@/features/exams';

interface ModalCreateProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    fileName: string;
    status: ExamStatus;
    report: string | null;
    created: string | undefined;
  }) => void;
  isPending: boolean;
}

const DARK = '#0f1117';
const CORAL = '#e05a47';

export default function ModalCreate({ open, onClose, onSubmit, isPending }: ModalCreateProps) {
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState<ExamStatus>('PENDING');
  const [report, setReport] = useState('');
  const [created, setCreated] = useState('');

  const resetForm = () => {
    setFileName('');
    setStatus('PENDING');
    setReport('');
    setCreated('');
  };

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const handleSubmit = () => {
    if (fileName.trim()) {
      onSubmit({
        fileName: fileName.trim(),
        status,
        report: report.trim() || null,
        created: created ? new Date(created).toISOString() : undefined,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isPending) {
          onClose();
        }
      }}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: '20px', p: 1 }
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: DARK }}>
        Cadastrar Novo Exame
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.4 }}>
          Preencha os campos abaixo para cadastrar o exame diretamente com as configurações especificadas.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            label="Nome do Exame / Arquivo"
            placeholder="Ex: exame_pulmao.dcm"
            fullWidth
            required
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            disabled={isPending}
            slotProps={{ input: { sx: { borderRadius: '12px', fontSize: '0.85rem' } } }}
          />

          <FormControl fullWidth disabled={isPending}>
            <InputLabel id="exam-status-label" sx={{ fontSize: '0.85rem' }}>Status da Fila</InputLabel>
            <Select
              labelId="exam-status-label"
              value={status}
              label="Status da Fila"
              onChange={(e) => setStatus(e.target.value as ExamStatus)}
              sx={{ borderRadius: '12px', fontSize: '0.85rem' }}
            >
              <MenuItem value="PENDING">Pendente (PENDING)</MenuItem>
              <MenuItem value="PROCESSING">Processando (PROCESSING)</MenuItem>
              <MenuItem value="DONE">Pronto (DONE)</MenuItem>
              <MenuItem value="ERROR">Erro (ERROR)</MenuItem>
              <MenuItem value="REPORTED">Laudado (REPORTED)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TextField
          label="Data de Criação (Opcional)"
          type="datetime-local"
          fullWidth
          value={created}
          onChange={(e) => setCreated(e.target.value)}
          disabled={isPending}
          slotProps={{
            inputLabel: { shrink: true },
            input: { sx: { borderRadius: '12px', fontSize: '0.85rem' } }
          }}
        />

        <TextField
          label="Laudo Médico (Opcional)"
          placeholder="Ex: Laudo assinado pelo Dr. João da Silva..."
          fullWidth
          multiline
          rows={3}
          value={report}
          onChange={(e) => setReport(e.target.value)}
          disabled={isPending}
          slotProps={{ input: { sx: { borderRadius: '12px', fontSize: '0.85rem' } } }}
        />

      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={isPending}
          sx={{ textTransform: 'none', fontWeight: 700, color: '#6b7280', fontSize: '0.8rem' }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          disabled={!fileName.trim() || isPending}
          onClick={handleSubmit}
          sx={{
            bgcolor: CORAL,
            color: '#fff',
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.8rem',
            px: 2.5,
            '&:hover': { bgcolor: '#c84937' },
            '&.Mui-disabled': { bgcolor: 'rgba(0, 0, 0, 0.12)', color: 'rgba(0, 0, 0, 0.26)' }
          }}
        >
          {isPending ? (
            <CircularProgress size={20} sx={{ color: '#fff' }} />
          ) : (
            'Cadastrar'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
