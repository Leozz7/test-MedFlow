import { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  MedicalServices as MedicalServicesIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  LocalHospital as ExamIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useExamsQuery, useSubmitReportMutation, ExamCard } from '@/features/exams';
import type { ExamDto } from '@/features/exams';

// ─── Design tokens ────────────────────────────────────────────────────────────
const CORAL = '#e05a47';
const DARK = '#0f1117';
const BG = '#f5f5f0';
const CARD = '#ffffff';
const INDIGO = '#6366f1';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Card = ({ children, sx = {} }: { children: React.ReactNode; sx?: object }) => (
  <Box sx={{ bgcolor: CARD, borderRadius: '20px', p: 2.5, boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)', ...sx }}>
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

const TODAY = new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

export default function DashboardDoctor() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Real API integration hooks
  const { data: exams = [], isLoading } = useExamsQuery();
  const submitReportMutation = useSubmitReportMutation();

  // State for writing report
  const [selectedExam, setSelectedExam] = useState<ExamDto | null>(null);
  const [reportText, setReportText] = useState('');

  // State for viewing existing report
  const [viewingReportExam, setViewingReportExam] = useState<ExamDto | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Dynamic stats calculation
  const pendingExams = exams.filter((e) => e.status === 'DONE');
  const recentReports = exams.filter((e) => e.status === 'REPORTED');

  const awaitingReportCount = pendingExams.length;
  const reportedTodayCount = recentReports.filter((e) => {
    const createdDate = new Date(e.created);
    const today = new Date();
    return createdDate.toDateString() === today.toDateString();
  }).length;
  const reportedThisMonthCount = recentReports.filter((e) => {
    const createdDate = new Date(e.created);
    const today = new Date();
    return createdDate.getMonth() === today.getMonth() && createdDate.getFullYear() === today.getFullYear();
  }).length;

  const stats = [
    { label: 'Aguardando laudo', value: String(awaitingReportCount), color: CORAL, icon: <AssignmentIcon sx={{ fontSize: 18 }} /> },
    { label: 'Laudados hoje', value: String(reportedTodayCount), color: INDIGO, icon: <CheckCircleIcon sx={{ fontSize: 18 }} /> },
    { label: 'Laudos este mês', value: String(reportedThisMonthCount), color: '#059669', icon: <ExamIcon sx={{ fontSize: 18 }} /> }
  ];

  const filteredPendingExams = pendingExams.filter((ex) =>
    parseFileName(ex.fileName).toLowerCase().includes(search.toLowerCase()) ||
    ex.fileName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRecentReports = recentReports.filter((ex) =>
    parseFileName(ex.fileName).toLowerCase().includes(search.toLowerCase()) ||
    ex.fileName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ height: '100vh', bgcolor: BG, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── TOPBAR ────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: CARD, borderBottom: '1px solid rgba(0,0,0,0.05)', px: 4, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '11px', bgcolor: INDIGO, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
            <MedicalServicesIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: DARK, letterSpacing: '-0.4px', lineHeight: 1 }}>MedFlow</Typography>
            <Typography sx={{ fontSize: '0.6rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Médico</Typography>
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
            <Avatar sx={{ width: 32, height: 32, border: '2px solid #e8eaed', bgcolor: INDIGO, color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: DARK, lineHeight: 1 }}>
                {user?.name || 'Médico'}
              </Typography>
              <Typography sx={{ fontSize: '0.62rem', color: '#9ca3af' }}>Médico · CRM 12.345</Typography>
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
              <Box sx={{ display: 'inline-flex', mt: 0.5, px: 1, py: 0.2, bgcolor: `${INDIGO}10`, color: INDIGO, borderRadius: '6px', width: 'fit-content' }}>
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
              Laudos Pendentes
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#6b7280', mt: 0.4 }}>
              {TODAY} · Avalie os exames disponíveis para diagnóstico
            </Typography>
          </Box>
        </Box>

        {/* Stats Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, flexShrink: 0 }}>
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

        {/* Kanban Board Layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, flex: 1, minHeight: 0, overflow: 'hidden' }}>
          
          {/* Column 1: Awaiting Report (PENDING / DONE) */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              bgcolor: 'rgba(234, 234, 230, 0.6)', 
              borderRadius: '24px', 
              p: 3, 
              border: '1.5px solid rgba(0, 0, 0, 0.04)', 
              overflow: 'hidden' 
            }}
          >
            {/* Column Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.06)', flexShrink: 0 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: DARK }}>Fila de Laudos</Typography>
                  <Box 
                    sx={{ 
                      ml: 1.5, 
                      px: 1.2, 
                      py: 0.3, 
                      borderRadius: '99px', 
                      bgcolor: `${CORAL}12`, 
                      color: CORAL, 
                      fontSize: '0.7rem', 
                      fontWeight: 800 
                    }}
                  >
                    {filteredPendingExams.length}
                  </Box>
                </Box>
                <Typography sx={{ fontSize: '0.68rem', color: '#6b7280', mt: 0.2 }}>Prontos para diagnóstico médico</Typography>
              </Box>
            </Box>

            {/* Column Body */}
            <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, mt: 2.5, pr: 0.5 }}>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress size={30} sx={{ color: INDIGO }} />
                </Box>
              ) : filteredPendingExams.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#9ca3af', p: 3, textAlign: 'center' }}>
                  <AssignmentIcon sx={{ fontSize: 36, mb: 1.5, color: '#cbd5e1' }} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Nenhum exame para laudar</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af', mt: 0.5 }}>Os exames enviados aparecerão aqui após análise da IA.</Typography>
                </Box>
              ) : (
                filteredPendingExams.map((ex) => (
                  <ExamCard 
                    key={ex.id}
                    exam={ex}
                    onActionClick={(exam) => {
                      setSelectedExam(exam);
                      setReportText('');
                    }}
                    actionLabel="Laudar"
                    isReported={false}
                  />
                ))
              )}
            </Box>
          </Box>

          {/* Column 2: Reported (REPORTED) */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              bgcolor: 'rgba(234, 234, 230, 0.6)', 
              borderRadius: '24px', 
              p: 3, 
              border: '1.5px solid rgba(0, 0, 0, 0.04)', 
              overflow: 'hidden' 
            }}
          >
            {/* Column Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.06)', flexShrink: 0 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: DARK }}>Laudos Emitidos</Typography>
                  <Box 
                    sx={{ 
                      ml: 1.5, 
                      px: 1.2, 
                      py: 0.3, 
                      borderRadius: '99px', 
                      bgcolor: 'rgba(5, 150, 105, 0.1)', 
                      color: '#059669', 
                      fontSize: '0.7rem', 
                      fontWeight: 800 
                    }}
                  >
                    {filteredRecentReports.length}
                  </Box>
                </Box>
                <Typography sx={{ fontSize: '0.68rem', color: '#6b7280', mt: 0.2 }}>Histórico de laudos assinados</Typography>
              </Box>
            </Box>

            {/* Column Body */}
            <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, mt: 2.5, pr: 0.5 }}>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress size={30} sx={{ color: INDIGO }} />
                </Box>
              ) : filteredRecentReports.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#9ca3af', p: 3, textAlign: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 36, mb: 1.5, color: '#cbd5e1' }} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Nenhum laudo emitido</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af', mt: 0.5 }}>Seus laudos assinados serão arquivados nesta coluna.</Typography>
                </Box>
              ) : (
                filteredRecentReports.map((r) => (
                  <ExamCard 
                    key={r.id}
                    exam={r}
                    onActionClick={(exam) => setViewingReportExam(exam)}
                    actionLabel="Visualizar"
                    isReported={true}
                  />
                ))
              )}
            </Box>
          </Box>

        </Box>

      </Box>

      {/* ── DIALOG DE EMISSÃO DE LAUDO ───────────────────────────────── */}
      <Dialog
        open={Boolean(selectedExam)}
        onClose={() => {
          if (!submitReportMutation.isPending) {
            setSelectedExam(null);
            setReportText('');
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
          Emitir Laudo Médico
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          {selectedExam && (
            <>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>
                  Exame / Arquivo
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: DARK }}>
                  {selectedExam.fileName}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>
                  ID: {selectedExam.id}
                </Typography>
              </Box>

              <Box sx={{ bgcolor: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: '12px', p: 2 }}>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: INDIGO, textTransform: 'uppercase', letterSpacing: '0.04em', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MedicalServicesIcon sx={{ fontSize: 14 }} /> Análise Prévia da IA (Seq)
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {selectedExam.processingResult || 'O processamento da IA não indicou achados específicos.'}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 1 }}>
                  Conclusão Diagnóstica (Laudo)
                </Typography>
                <TextField
                  multiline
                  rows={5}
                  fullWidth
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Descreva aqui o diagnóstico detalhado e orientações clínicas..."
                  disabled={submitReportMutation.isPending}
                  error={reportText.length > 0 && reportText.trim().length < 10}
                  helperText={reportText.length > 0 && reportText.trim().length < 10 ? "O laudo deve conter pelo menos 10 caracteres." : ""}
                  slotProps={{
                    input: {
                      sx: { borderRadius: '12px', fontSize: '0.85rem' }
                    }
                  }}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => {
              setSelectedExam(null);
              setReportText('');
            }}
            disabled={submitReportMutation.isPending}
            sx={{ textTransform: 'none', fontWeight: 700, color: '#6b7280', fontSize: '0.8rem' }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            disabled={reportText.trim().length < 10 || submitReportMutation.isPending}
            onClick={() => {
              if (selectedExam) {
                submitReportMutation.mutate(
                  { id: selectedExam.id, data: { report: reportText } },
                  {
                    onSuccess: () => {
                      setSelectedExam(null);
                      setReportText('');
                    }
                  }
                );
              }
            }}
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
            {submitReportMutation.isPending ? (
              <CircularProgress size={20} sx={{ color: '#fff' }} />
            ) : (
              'Assinar e Enviar'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── DIALOG DE VISUALIZAÇÃO DE LAUDO ───────────────────────────── */}
      <Dialog
        open={Boolean(viewingReportExam)}
        onClose={() => setViewingReportExam(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '20px', p: 1 }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: DARK }}>
          Laudo Emitido
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          {viewingReportExam && (
            <>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>
                  Exame / Arquivo
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: DARK }}>
                  {viewingReportExam.fileName}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>
                  ID: {viewingReportExam.id} · Enviado em {new Date(viewingReportExam.created).toLocaleString('pt-BR')}
                </Typography>
              </Box>

              <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)', border: '1px solid rgba(0, 0, 0, 0.05)', borderRadius: '12px', p: 2 }}>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 1 }}>
                  Resultado da IA (Histórico)
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {viewingReportExam.processingResult || 'Processamento da IA sem achados específicos.'}
                </Typography>
              </Box>

              <Box sx={{ borderLeft: `3px solid ${INDIGO}`, pl: 2, py: 0.5 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 1 }}>
                  Laudo Clínico Assinado
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: DARK, lineHeight: 1.6, whiteSpace: 'pre-wrap', fontWeight: 500 }}>
                  {viewingReportExam.report}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setViewingReportExam(null)}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.05)',
              color: '#374151',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.8rem',
              px: 3,
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' }
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}