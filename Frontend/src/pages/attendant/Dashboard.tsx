import { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  LinearProgress
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
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

// ─── Design tokens ────────────────────────────────────────────────────────────
const CORAL = '#e05a47';
const DARK = '#0f1117';
const BG = '#f5f5f0';
const CARD = '#ffffff';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Card = ({ children, sx = {} }: { children: React.ReactNode; sx?: object }) => (
  <Box sx={{ bgcolor: CARD, borderRadius: '20px', p: 2.5, boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)', ...sx }}>
    {children}
  </Box>
);

const StatusChip = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    PENDING:    { label: 'Pendente',    color: '#d97706', bg: 'rgba(217,119,6,0.08)',   icon: <PendingIcon sx={{ fontSize: 11 }} /> },
    PROCESSING: { label: 'Processando', color: '#2563eb', bg: 'rgba(37,99,235,0.08)',   icon: <RefreshIcon sx={{ fontSize: 11 }} /> },
    DONE:       { label: 'Pronto',      color: '#059669', bg: 'rgba(5,150,105,0.08)',   icon: <CheckCircleIcon sx={{ fontSize: 11 }} /> },
    ERROR:      { label: 'Erro',        color: '#dc2626', bg: 'rgba(220,38,38,0.08)',   icon: <ErrorIcon sx={{ fontSize: 11 }} /> },
    REPORTED:   { label: 'Laudado',     color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', icon: <CheckCircleIcon sx={{ fontSize: 11 }} /> },
  };
  const s = map[status] ?? map.PENDING;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.2, py: 0.4, borderRadius: '99px', bgcolor: s.bg }}>
      <Box sx={{ color: s.color, display: 'flex' }}>{s.icon}</Box>
      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: s.color }}>{s.label}</Typography>
    </Box>
  );
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const EXAMS = [
  { id: '#4821', patient: 'Ana Beatriz S.', type: 'Tomografia', date: '17/07 · 09:14', status: 'DONE',       avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: '#4820', patient: 'Carlos M. Jr.', type: 'Ressonância', date: '17/07 · 08:55', status: 'PROCESSING', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: '#4819', patient: 'Fernanda O.',   type: 'Raio-X',     date: '17/07 · 08:30', status: 'REPORTED',   avatar: 'https://i.pravatar.cc/150?img=25' },
  { id: '#4818', patient: 'Ricardo P.',    type: 'Ultrassom',  date: '17/07 · 07:58', status: 'PENDING',    avatar: 'https://i.pravatar.cc/150?img=33' },
  { id: '#4817', patient: 'Mariana L.',    type: 'Tomografia', date: '16/07 · 18:42', status: 'ERROR',      avatar: 'https://i.pravatar.cc/150?img=5'  },
  { id: '#4816', patient: 'Roberto Alves', type: 'Tomografia', date: '16/07 · 17:10', status: 'REPORTED',   avatar: 'https://i.pravatar.cc/150?img=15' },
];

const TODAY = new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

export default function DashboardAttendant() {
  const [search, setSearch] = useState('');

  const stats = [
    { label: 'Enviados hoje', value: '24', color: CORAL, icon: <UploadFileIcon sx={{ fontSize: 18 }} /> },
    { label: 'Processando', value: '7', color: '#2563eb', icon: <RefreshIcon sx={{ fontSize: 18 }} /> },
    { label: 'Prontos para laudo', value: '11', color: '#059669', icon: <CheckCircleIcon sx={{ fontSize: 18 }} /> },
    { label: 'Erros de envio', value: '2', color: '#dc2626', icon: <ErrorIcon sx={{ fontSize: 18 }} /> },
  ];

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Avatar src="https://i.pravatar.cc/150?img=48" sx={{ width: 32, height: 32, border: '2px solid #e8eaed' }} />
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: DARK, lineHeight: 1 }}>Juliana Costa</Typography>
              <Typography sx={{ fontSize: '0.62rem', color: '#9ca3af' }}>Atendente</Typography>
            </Box>
          </Box>
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
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr', px: 3, py: 1.2, bgcolor: '#f9fafb', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
              {['Paciente', 'Exame / Tipo', 'Data Envio', 'Fila Status'].map((h) => (
                <Typography key={h} sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</Typography>
              ))}
            </Box>

            {/* Table body (Scrollable) */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 0 }}>
              {EXAMS.map((ex, i) => (
                <Box
                  key={ex.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                    px: 3,
                    py: 1.8,
                    alignItems: 'center',
                    borderBottom: i < EXAMS.length - 1 ? '1px solid #f3f4f6' : 'none',
                    '&:hover': { bgcolor: '#fafafa' },
                    transition: 'background 0.1s',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar src={ex.avatar} sx={{ width: 28, height: 28 }} />
                    <Box>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: DARK }}>{ex.patient}</Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: '#9ca3af' }}>{ex.id}</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: '0.8rem', color: '#374151', fontWeight: 500 }}>{ex.type}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: 12, color: '#9ca3af' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>{ex.date}</Typography>
                  </Box>
                  <Box>
                    <StatusChip status={ex.status} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Right sidebar */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, minHeight: 0 }}>
            {/* Drag & drop upload area */}
            <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px dashed rgba(224,90,71,0.25)`, bgcolor: 'rgba(224,90,71,0.01)', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(224,90,71,0.03)', borderColor: CORAL } }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: `${CORAL}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <CloudUploadIcon sx={{ fontSize: 24, color: CORAL }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: DARK, mb: 0.5 }}>Upload de Exame</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center', mb: 2, maxWidth: 200, lineHeight: 1.5 }}>
                Arraste arquivos DICOM/PDF ou selecione do computador.
              </Typography>
              <Button variant="contained"
                sx={{ bgcolor: CORAL, color: '#fff', borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', px: 2.5, py: 1, boxShadow: '0 4px 12px rgba(224,90,71,0.2)', '&:hover': { bgcolor: '#c84937' } }}>
                Selecionar arquivo
              </Button>
            </Card>

            {/* Current processing pipeline status */}
            <Card sx={{ p: 2.5, flexShrink: 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: DARK, mb: 2 }}>Fila de Processamento (IA)</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                {[
                  { name: 'Carlos M. Jr.', type: 'Ressonância #4820', progress: 62 },
                  { name: 'Beatriz F.',    type: 'Tomografia #4815',  progress: 89 },
                ].map((item) => (
                  <Box key={item.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: DARK }}>{item.name}</Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: '#9ca3af' }}>{item.type}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb' }}>{item.progress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={item.progress}
                      sx={{ height: 4, borderRadius: '99px', bgcolor: '#eff6ff', '& .MuiLinearProgress-bar': { bgcolor: '#2563eb', borderRadius: '99px' } }}
                    />
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>

        </Box>

      </Box>
    </Box>
  );
}