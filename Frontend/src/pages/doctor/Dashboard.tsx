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
  ListItemIcon
} from '@mui/material';
import {
  MedicalServices as MedicalServicesIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  LocalHospital as ExamIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

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

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const PENDING_EXAMS = [
  { id: '#4821', patient: 'Ana Beatriz S.', type: 'Tomografia Crânio', age: '34 anos', date: '17/07 · 09:14', urgency: 'Alta',   avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: '#4816', patient: 'Pedro Alves R.', type: 'Ressonância Coluna', age: '52 anos', date: '17/07 · 07:40', urgency: 'Normal', avatar: 'https://i.pravatar.cc/150?img=15' },
  { id: '#4812', patient: 'Sofia N. Lima',  type: 'Raio-X Tórax',      age: '28 anos', date: '16/07 · 22:15', urgency: 'Normal', avatar: 'https://i.pravatar.cc/150?img=9'  },
  { id: '#4808', patient: 'Marcos F. S.',   type: 'Ultrassom Abd.',    age: '61 anos', date: '16/07 · 18:30', urgency: 'Alta',   avatar: 'https://i.pravatar.cc/150?img=7'  },
  { id: '#4807', patient: 'Leticia Silva',  type: 'Tomografia Tórax',  age: '41 anos', date: '16/07 · 15:40', urgency: 'Normal', avatar: 'https://i.pravatar.cc/150?img=22' },
];

const RECENT_REPORTS = [
  { id: '#4819', patient: 'Fernanda O.',  type: 'Raio-X', date: '17/07 · 08:30', avatar: 'https://i.pravatar.cc/150?img=25' },
  { id: '#4810', patient: 'Gabriel T.',   type: 'Tomografia', date: '16/07 · 15:20', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: '#4805', patient: 'Lúcia Mendes', type: 'Ressonância', date: '16/07 · 11:10', avatar: 'https://i.pravatar.cc/150?img=3'  },
];

const TODAY = new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

export default function DashboardDoctor() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const stats = [
    { label: 'Aguardando laudo', value: '11', color: CORAL, icon: <AssignmentIcon sx={{ fontSize: 18 }} /> },
    { label: 'Laudados hoje', value: '8', color: INDIGO, icon: <CheckCircleIcon sx={{ fontSize: 18 }} /> },
    { label: 'Laudos este mês', value: '134', color: '#059669', icon: <ExamIcon sx={{ fontSize: 18 }} /> }
  ];

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

        {/* Grid: Pending list + Recent reports */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 2.5, flex: 1, minHeight: 0, overflow: 'hidden' }}>
          
          {/* Table list card */}
          <Card sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Table title bar */}
            <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: DARK }}>Fila de Laudos</Typography>
                <Typography sx={{ fontSize: '0.68rem', color: '#9ca3af', mt: 0.2 }}>Exames marcados como prontos pela IA</Typography>
              </Box>
              <IconButton size="small" sx={{ bgcolor: '#f9fafb', border: '1.5px solid #e8eaed', borderRadius: '10px', p: 0.6 }}>
                <FilterIcon sx={{ fontSize: 15, color: '#6b7280' }} />
              </IconButton>
            </Box>

            {/* Table headers */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1.6fr 0.8fr 0.8fr 1fr', px: 3, py: 1.2, bgcolor: '#f9fafb', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
              {['Paciente', 'Exame', 'Idade', 'Urgência', 'Ações'].map((h) => (
                <Typography key={h} sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</Typography>
              ))}
            </Box>

            {/* Table body (Scrollable) */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 0 }}>
              {PENDING_EXAMS.map((ex, i) => (
                <Box
                  key={ex.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.6fr 0.8fr 0.8fr 1fr',
                    px: 3,
                    py: 1.8,
                    alignItems: 'center',
                    borderBottom: i < PENDING_EXAMS.length - 1 ? '1px solid #f3f4f6' : 'none',
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
                  <Box>
                    <Typography sx={{ fontSize: '0.8rem', color: '#374151', fontWeight: 500 }}>{ex.type}</Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#9ca3af' }}>{ex.date}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.78rem', color: '#6b7280' }}>{ex.age}</Typography>
                  <Box>
                    <Box sx={{
                      display: 'inline-flex', px: 1, py: 0.3, borderRadius: '99px',
                      bgcolor: ex.urgency === 'Alta' ? 'rgba(220,38,38,0.08)' : 'rgba(5,150,105,0.08)',
                      color: ex.urgency === 'Alta' ? '#dc2626' : '#059669'
                    }}>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 700 }}>{ex.urgency}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.8 }}>
                    <IconButton size="small" sx={{ bgcolor: '#f3f4f6', borderRadius: '8px', p: 0.5, '&:hover': { bgcolor: `${INDIGO}15`, color: INDIGO } }}>
                      <ViewIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                    <Button size="small" variant="contained"
                      sx={{ bgcolor: CORAL, color: '#fff', borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '0.7rem', px: 1.5, py: 0.5, minWidth: 0, boxShadow: 'none', '&:hover': { bgcolor: '#c84937' } }}>
                      Laudar
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Right sidebar - Recent reports */}
          <Card sx={{ display: 'flex', flexDirection: 'column', p: 0, overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: DARK }}>Laudos Recentes</Typography>
              <Typography sx={{ fontSize: '0.68rem', color: '#9ca3af', mt: 0.2 }}>Seus últimos diagnósticos assinados</Typography>
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 1 }}>
              {RECENT_REPORTS.map((r, i) => (
                <Box key={r.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <Avatar src={r.avatar} sx={{ width: 28, height: 28 }} />
                      <Box>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: DARK }}>{r.patient}</Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: '#9ca3af' }}>{r.type} · {r.date}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.4 }}>
                      <IconButton size="small" sx={{ borderRadius: '8px', p: 0.5, bgcolor: '#f3f4f6', '&:hover': { bgcolor: `${INDIGO}15` } }}>
                        <ViewIcon sx={{ fontSize: 12, color: '#6b7280' }} />
                      </IconButton>
                      <IconButton size="small" sx={{ borderRadius: '8px', p: 0.5, bgcolor: '#f3f4f6', '&:hover': { bgcolor: `${CORAL}15` } }}>
                        <EditIcon sx={{ fontSize: 12, color: '#6b7280' }} />
                      </IconButton>
                    </Box>
                  </Box>
                  {i < RECENT_REPORTS.length - 1 && <Divider sx={{ borderColor: '#f3f4f6' }} />}
                </Box>
              ))}
            </Box>
          </Card>
        </Box>

      </Box>
    </Box>
  );
}