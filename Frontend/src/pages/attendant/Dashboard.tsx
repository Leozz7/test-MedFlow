import { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  MedicalServices as MedicalServicesIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  UploadFile as UploadFileIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HourglassEmpty as PendingIcon,
  Refresh as RefreshIcon,
  CloudUpload as CloudUploadIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useExamsQuery, useUploadExamMutation } from '@/features/exams';
import type { ExamStatus } from '@/features/exams';
import ModalCreate from '@/components/attendant/ModalCreate';

// ─── Design tokens ────────────────────────────────────────────────────────────
const CORAL = '#e05a47';
const DARK = '#0f1117';
const BG = '#f5f5f0';
const CARD = '#ffffff';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Card = ({ children, sx = {}, onClick }: { children: React.ReactNode; sx?: object; onClick?: () => void }) => (
  <Box 
    onClick={onClick}
    sx={{ bgcolor: CARD, borderRadius: '20px', p: 2.5, boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)', ...sx }}
  >
    {children}
  </Box>
);

const parseFileName = (fileName: string) => {
  if (!fileName) return 'Sem Nome';
  const base = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  return base
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const StatusChip = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    PENDING:    { label: 'Pendente',    color: '#d97706', bg: 'rgba(217,119,6,0.08)',   icon: <PendingIcon sx={{ fontSize: 11 }} /> },
    PROCESSING: { label: 'Processando', color: '#2563eb', bg: 'rgba(37,99,235,0.08)',   icon: <RefreshIcon sx={{ fontSize: 11 }} /> },
    DONE:       { label: 'Pronto',      color: '#059669', bg: 'rgba(5,150,105,0.08)',   icon: <CheckCircleIcon sx={{ fontSize: 11 }} /> },
    ERROR:      { label: 'Erro',        color: '#dc2626', bg: 'rgba(220,38,38,0.08)',   icon: <ErrorIcon sx={{ fontSize: 11 }} /> },
    REPORTED:   { label: 'Laudado',     color: '#7c3aed', bg: 'rgba(124,58,237,0.08)',  icon: <CheckCircleIcon sx={{ fontSize: 11 }} /> },
  };
  const s = map[status] ?? map.PENDING;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.2, py: 0.4, borderRadius: '99px', bgcolor: s.bg }}>
      <Box sx={{ color: s.color, display: 'flex' }}>{s.icon}</Box>
      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: s.color }}>{s.label}</Typography>
    </Box>
  );
};

const TODAY = new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

export default function DashboardAttendant() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Real API integration hooks
  const { data: exams = [], isLoading } = useExamsQuery();
  const uploadExamMutation = useUploadExamMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateExam = (data: {
    fileName: string;
    status: ExamStatus;
    report: string | null;
    created: string | undefined;
  }) => {
    uploadExamMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      }
    });
  };

  // Dynamic stats calculation
  const sentTodayCount = exams.filter((e) => {
    const createdDate = new Date(e.created);
    const today = new Date();
    return createdDate.toDateString() === today.toDateString();
  }).length;

  const processingCount = exams.filter((e) => e.status === 'PROCESSING').length;
  const readyCount = exams.filter((e) => e.status === 'DONE').length;
  const errorCount = exams.filter((e) => e.status === 'ERROR').length;

  const stats = [
    { label: 'Enviados hoje', value: String(sentTodayCount), color: CORAL, icon: <UploadFileIcon sx={{ fontSize: 18 }} /> },
    { label: 'Processando', value: String(processingCount), color: '#2563eb', icon: <RefreshIcon sx={{ fontSize: 18 }} /> },
    { label: 'Prontos para laudo', value: String(readyCount), color: '#059669', icon: <CheckCircleIcon sx={{ fontSize: 18 }} /> },
    { label: 'Erros de envio', value: String(errorCount), color: '#dc2626', icon: <ErrorIcon sx={{ fontSize: 18 }} /> },
  ];

  const filteredExams = exams.filter((ex) =>
    parseFileName(ex.fileName).toLowerCase().includes(search.toLowerCase()) ||
    ex.fileName.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <Box sx={{ height: '100vh', bgcolor: BG, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── TOPBAR ────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: CARD, borderBottom: '1px solid rgba(0,0,0,0.05)', px: 4, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '11px', bgcolor: CORAL, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(224,90,71,0.3)' }}>
            <MedicalServicesIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: DARK, letterSpacing: '-0.4px', lineHeight: 1 }}>MedFlow</Typography>
            <Typography sx={{ fontSize: '0.6rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Atendente</Typography>
          </Box>
        </Box>

        {/* Search bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, bgcolor: '#f9fafb', border: '1.5px solid #e8eaed', borderRadius: '12px', px: 2, py: 0.8, width: 260 }}>
          <SearchIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
          <Box component="input"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            placeholder="Buscar exame..."
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.8rem', color: '#374151', width: '100%', fontFamily: 'inherit' }}
          />
        </Box>

        {/* Right actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ position: 'relative' }}>
            <IconButton sx={{ bgcolor: '#f9fafb', border: '1.5px solid #e8eaed', borderRadius: '12px', p: 0.8 }}>
              <NotificationsIcon sx={{ fontSize: 18, color: '#374151' }} />
            </IconButton>
            <Box sx={{ position: 'absolute', top: 5, right: 5, width: 6, height: 6, borderRadius: '50%', bgcolor: CORAL, border: '1.5px solid #fff' }} />
          </Box>
          <Box 
            onClick={handleOpenMenu}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer', p: 0.5, borderRadius: '8px', '&:hover': { bgcolor: '#f3f4f6' }, transition: 'background-color 0.2s' }}
          >
            <Avatar sx={{ width: 32, height: 32, border: '2px solid #e8eaed', bgcolor: CORAL, color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: DARK, lineHeight: 1 }}>
                {user?.name || 'Atendente'}
              </Typography>
              <Typography sx={{ fontSize: '0.62rem', color: '#9ca3af' }}>Atendente</Typography>
            </Box>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            onClick={handleCloseMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 8px 32px rgba(15, 17, 23, 0.08))',
                  mt: 1.5,
                  p: 1,
                  minWidth: 220,
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  bgcolor: 'background.paper',
                },
              }
            }}
          >
            {/* Header info */}
            <Box sx={{ px: 1.5, py: 1.2, mb: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: DARK, letterSpacing: '-0.2px' }}>
                {user?.name || 'Usuário'}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 500, wordBreak: 'break-all' }}>
                {user?.email || 'usuario@medflow.com'}
              </Typography>
              <Box sx={{ display: 'inline-flex', mt: 0.5, px: 1, py: 0.2, bgcolor: `${CORAL}10`, color: CORAL, borderRadius: '6px', width: 'fit-content' }}>
                <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {user?.role === 'DOCTOR' ? 'Médico' : 'Atendente'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 0.5, borderColor: 'rgba(0, 0, 0, 0.04)' }} />

            {/* Logout item with custom hover */}
            <MenuItem onClick={logout} sx={{ 
              borderRadius: '8px', 
              py: 1, 
              px: 1.5,
              color: CORAL,
              '&:hover': { 
                bgcolor: `${CORAL}08`,
                '& .MuiListItemIcon-root': { color: CORAL }
              }
            }}>
              <ListItemIcon sx={{ minWidth: '32px !important', color: CORAL, transition: 'color 0.2s' }}>
                <LogoutIcon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Sair da conta</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 2.5, overflow: 'hidden' }}>

        {/* Greeting */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <Box>
            <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: DARK, letterSpacing: '-0.5px', lineHeight: 1 }}>
              Fila de Exames
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#6b7280', mt: 0.4 }}>
              {TODAY} · Acompanhe e envie exames para processamento
            </Typography>
          </Box>
        </Box>

        {/* Stats Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, flexShrink: 0 }}>
          {stats.map((s) => (
            <Card key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                {s.icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: DARK, letterSpacing: '-0.5px', lineHeight: 1 }}>{s.value}</Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#6b7280', mt: 0.2, fontWeight: 500 }}>{s.label}</Typography>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Grid: Table + Send File */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 2.5, flex: 1, minHeight: 0, overflow: 'hidden' }}>
          
          {/* Table list card */}
          <Card sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Table title bar */}
            <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: DARK }}>Exames Enviados</Typography>
                <Typography sx={{ fontSize: '0.68rem', color: '#9ca3af', mt: 0.2 }}>Registro em tempo real da fila</Typography>
              </Box>
              <IconButton size="small" sx={{ bgcolor: '#f9fafb', border: '1.5px solid #e8eaed', borderRadius: '10px', p: 0.6 }}>
                <FilterIcon sx={{ fontSize: 15, color: '#6b7280' }} />
              </IconButton>
            </Box>

            {/* Table headers */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1fr', px: 3, py: 1.2, bgcolor: '#f9fafb', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
              {['Exame / Arquivo', 'ID do Exame', 'Data de Envio', 'Status da Fila'].map((h) => (
                <Typography key={h} sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</Typography>
              ))}
            </Box>

            {/* Table body (Scrollable) */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 0 }}>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress size={30} sx={{ color: CORAL }} />
                </Box>
              ) : filteredExams.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#9ca3af', p: 3 }}>
                  <UploadFileIcon sx={{ fontSize: 40, mb: 1.5, color: '#cbd5e1' }} />
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 500 }}>Nenhum exame enviado ainda</Typography>
                </Box>
              ) : (
                filteredExams.map((ex, i) => (
                  <Box
                    key={ex.id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1.2fr 1fr',
                      px: 3,
                      py: 1.8,
                      alignItems: 'center',
                      borderBottom: i < filteredExams.length - 1 ? '1px solid #f3f4f6' : 'none',
                      '&:hover': { bgcolor: '#fafafa' },
                      transition: 'background 0.1s',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: 'rgba(224,90,71,0.08)', color: CORAL, fontSize: '0.75rem', fontWeight: 700 }}>
                        {ex.fileName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ overflow: 'hidden' }}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: DARK, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {parseFileName(ex.fileName)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: '#9ca3af' }}>{ex.fileName}</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: '0.72rem', color: '#6b7280', fontFamily: 'monospace' }}>
                      #{ex.id.substring(0, 8)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarIcon sx={{ fontSize: 12, color: '#9ca3af' }} />
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#374151', fontWeight: 500 }}>
                          {new Date(ex.created).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        </Typography>
                        <Typography sx={{ fontSize: '0.62rem', color: '#9ca3af' }}>
                          {new Date(ex.created).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <StatusChip status={ex.status} />
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Card>

          {/* Right sidebar */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, minHeight: 0 }}>

            {/* Click to register card */}
            <Card 
              onClick={handleOpenCreateModal}
              sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: `2px dashed rgba(224,90,71,0.25)`, 
                bgcolor: uploadExamMutation.isPending ? 'rgba(0, 0, 0, 0.02)' : 'rgba(224,90,71,0.01)', 
                cursor: uploadExamMutation.isPending ? 'default' : 'pointer', 
                transition: 'all 0.2s', 
                '&:hover': uploadExamMutation.isPending ? {} : { bgcolor: 'rgba(224,90,71,0.03)', borderColor: CORAL } 
              }}
            >
              <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: `${CORAL}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                {uploadExamMutation.isPending ? (
                  <CircularProgress size={24} sx={{ color: CORAL }} />
                ) : (
                  <CloudUploadIcon sx={{ fontSize: 24, color: CORAL }} />
                )}
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: DARK, mb: 0.5 }}>
                {uploadExamMutation.isPending ? 'Enviando...' : 'Cadastrar Exame'}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center', mb: 2, maxWidth: 200, lineHeight: 1.5 }}>
                {uploadExamMutation.isPending 
                  ? 'Cadastrando o exame e iniciando o processamento na fila da IA.'
                  : 'Informe os dados de identificação do exame para processamento.'
                }
              </Typography>
              <Button 
                variant="contained"
                disabled={uploadExamMutation.isPending}
                sx={{ 
                  bgcolor: CORAL, 
                  color: '#fff', 
                  borderRadius: '10px', 
                  textTransform: 'none', 
                  fontWeight: 700, 
                  fontSize: '0.8rem', 
                  px: 2.5, 
                  py: 1, 
                  boxShadow: '0 4px 12px rgba(224,90,71,0.2)', 
                  '&:hover': { bgcolor: '#c84937' } 
                }}
              >
                Cadastrar Novo
              </Button>
            </Card>

            {/* Current processing pipeline status */}
            
          </Box>

        </Box>

      </Box>

      {/* ── DIALOG DE CADASTRO DE EXAME ──────────────────────────────── */}
      <ModalCreate
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateExam}
        isPending={uploadExamMutation.isPending}
      />
    </Box>
  );
}