import type { ExamDto } from '../types';
import { Box, Typography, Avatar, Button, IconButton } from '@mui/material';
import {
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

interface ExamCardProps {
  exam: ExamDto;
  onActionClick: (exam: ExamDto) => void;
  actionLabel: string;
  isReported: boolean;
}

const parseFileName = (fileName: string) => {
  if (!fileName) return 'Sem Nome';
  const base = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  return base
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function ExamCard({ exam, onActionClick, actionLabel, isReported }: ExamCardProps) {
  const INDIGO = '#6366f1';
  const CORAL = '#e05a47';
  const DARK = '#0f1117';

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        borderRadius: '16px',
        p: 2.5,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(15, 17, 23, 0.08)'
        }
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: isReported ? 'rgba(5, 150, 105, 0.1)' : 'rgba(99, 102, 241, 0.1)',
            color: isReported ? '#059669' : INDIGO,
            fontSize: '0.85rem',
            fontWeight: 700
          }}
        >
          {exam.fileName.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ overflow: 'hidden', flex: 1 }}>
          <Typography
            sx={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: DARK,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            {parseFileName(exam.fileName)}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.65rem',
              color: '#9ca3af',
              fontFamily: 'monospace'
            }}
          >
            #{exam.id.substring(0, 8)}
          </Typography>
        </Box>
      </Box>

      {/* Info Card Block */}
      <Box
        sx={{
          bgcolor: isReported ? 'rgba(0, 0, 0, 0.02)' : 'rgba(99, 102, 241, 0.03)',
          border: isReported ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid rgba(99, 102, 241, 0.08)',
          borderRadius: '10px',
          p: 1.5,
          minHeight: 65,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Typography
          sx={{
            fontSize: '0.65rem',
            fontWeight: 800,
            color: isReported ? '#6b7280' : INDIGO,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            mb: 0.5
          }}
        >
          {isReported ? 'Laudo Clínico' : 'Análise Prévia da IA'}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.78rem',
            color: '#4b5563',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {isReported ? exam.report : (exam.processingResult || 'Processando análise da IA...')}
        </Typography>
      </Box>

      {/* Footer / Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#9ca3af' }}>
          <CalendarIcon sx={{ fontSize: 13 }} />
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
            {new Date(exam.created).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} · {new Date(exam.created).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {isReported ? (
            <IconButton
              size="small"
              onClick={() => onActionClick(exam)}
              sx={{
                bgcolor: '#f3f4f6',
                borderRadius: '8px',
                p: 0.8,
                '&:hover': { bgcolor: 'rgba(5, 150, 105, 0.1)', color: '#059669' }
              }}
            >
              <ViewIcon sx={{ fontSize: 14 }} />
            </IconButton>
          ) : (
            <Button
              size="small"
              variant="contained"
              onClick={() => onActionClick(exam)}
              sx={{
                bgcolor: CORAL,
                color: '#fff',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.7rem',
                px: 2,
                py: 0.6,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#c84937', boxShadow: 'none' }
              }}
            >
              {actionLabel}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
