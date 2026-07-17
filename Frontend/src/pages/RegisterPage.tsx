import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  MedicalServices as MedicalServicesIcon,
  LocalHospital as LocalHospitalIcon,
  AssignmentInd as AssignmentIndIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import api from '@/lib/axios';

// ─── Role Option Card ─────────────────────────────────────────────────────────
const RoleOption = ({
  selected,
  icon,
  title,
  desc,
  onClick
}: {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) => (
  <Box
    onClick={onClick}
    sx={{
      flex: 1,
      p: 2,
      borderRadius: '13px',
      border: selected ? '2px solid #e05a47' : '1.5px solid #e8eaed',
      bgcolor: selected ? 'rgba(224,90,71,0.04)' : '#f9fafb',
      cursor: 'pointer',
      transition: 'all 0.18s ease',
      boxShadow: selected ? '0 0 0 4px rgba(224,90,71,0.07)' : 'none',
      '&:hover': {
        borderColor: selected ? '#e05a47' : '#d1d5db',
        transform: 'translateY(-1px)'
      }
    }}
  >
    <Box sx={{ color: selected ? '#e05a47' : '#9ca3af', mb: 1.2, display: 'flex' }}>{icon}</Box>
    <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#111827', mb: 0.3 }}>{title}</Typography>
    <Typography sx={{ fontSize: '0.71rem', color: '#6b7280', lineHeight: 1.55 }}>{desc}</Typography>
  </Box>
);

// ─── Password Strength ────────────────────────────────────────────────────────
function getStrength(pwd: string): { level: number; label: string; color: string } {
  if (!pwd) return { level: 0, label: '', color: '#e5e7eb' };
  if (pwd.length < 4) return { level: 25, label: 'Fraca', color: '#ef4444' };
  if (pwd.length < 7) return { level: 50, label: 'Média', color: '#f59e0b' };
  if (pwd.length < 10) return { level: 75, label: 'Boa', color: '#10b981' };
  return { level: 100, label: 'Forte', color: '#10b981' };
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ATTENDANT');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const strength = getStrength(password);

  const handleTogglePassword = () => setShowPassword((p) => !p);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/users', { name, email, password, role });
      setSuccess('Sua conta foi criada com sucesso! Redirecionando...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      const backendError = err.response?.data?.message || err.response?.data?.detail || err.response?.data;
      if (typeof backendError === 'string') {
        setError(backendError);
      } else {
        setError('Erro ao se conectar ao servidor. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#f5f5f0',
        px: 3,
        py: 6
      }}
    >
      {/* Background decorative orbs */}
      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <Box sx={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', filter: 'blur(120px)', opacity: 0.18, bgcolor: '#6366f1', top: '-10%', right: '-5%' }} />
        <Box sx={{ position: 'absolute', width: 450, height: 450, borderRadius: '50%', filter: 'blur(130px)', opacity: 0.15, bgcolor: '#e05a47', bottom: '-10%', left: '-5%' }} />
      </Box>

      {/* Card */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 440,
          bgcolor: '#ffffff',
          borderRadius: '24px',
          p: { xs: 4, sm: 5 },
          boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)'
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '13px',
              bgcolor: '#e05a47',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(224,90,71,0.32)'
            }}
          >
            <MedicalServicesIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0f1117', letterSpacing: '-0.5px', lineHeight: 1 }}>
              MedFlow
            </Typography>
            <Typography sx={{ fontSize: '0.63rem', color: '#9ca3af', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              Plataforma Médica
            </Typography>
          </Box>
        </Box>

        {/* Heading */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: { xs: '1.85rem', sm: '2.1rem' },
              fontWeight: 800,
              color: '#0f1117',
              letterSpacing: '-1.5px',
              lineHeight: 1.05,
              mb: 1.2
            }}
          >
            Crie sua conta.
          </Typography>
          <Typography sx={{ fontSize: '0.87rem', color: '#6b7280', fontWeight: 500, lineHeight: 1.65 }}>
            Preencha os dados abaixo para criar seu perfil na plataforma MedFlow.
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" variant="outlined" sx={{ borderRadius: '13px', borderColor: '#fca5a5', bgcolor: '#fff5f5', color: '#991b1b', mb: 3, fontSize: '0.82rem', '& .MuiAlert-icon': { color: '#ef4444' } }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" variant="outlined" sx={{ borderRadius: '13px', borderColor: '#a7f3d0', bgcolor: '#f0fdf4', color: '#065f46', mb: 3, fontSize: '0.82rem', '& .MuiAlert-icon': { color: '#10b981' } }}>
            {success}
          </Alert>
        )}

        {/* Role Selector */}
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151', mb: 1.2, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Qual é o seu perfil?
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
          <RoleOption
            selected={role === 'ATTENDANT'}
            icon={<LocalHospitalIcon sx={{ fontSize: 22 }} />}
            title="Atendente"
            desc="Upload e gestão de exames"
            onClick={() => setRole('ATTENDANT')}
          />
          <RoleOption
            selected={role === 'DOCTOR'}
            icon={<AssignmentIndIcon sx={{ fontSize: 22 }} />}
            title="Médico"
            desc="Visualização e emissão de laudos"
            onClick={() => setRole('DOCTOR')}
          />
        </Box>

        {/* Name */}
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151', mb: 0.9, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Nome completo
        </Typography>
        <TextField
          fullWidth
          placeholder="Digite seu nome completo"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: '#c4c9d4', fontSize: 17, mr: 0.5 }} />
                </InputAdornment>
              )
            }
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '13px',
              backgroundColor: '#f9fafb',
              boxShadow: '0 0 0 1.5px #e8eaed',
              transition: 'box-shadow 0.2s',
              '& fieldset': { border: 'none' },
              '&.Mui-focused': { boxShadow: '0 0 0 2px #e05a47, 0 4px 14px rgba(224,90,71,0.1)' },
              '& input': { py: 1.6, fontSize: '0.9rem', fontWeight: 500, color: '#111827' }
            }
          }}
        />

        {/* Email */}
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151', mb: 0.9, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Endereço de e-mail
        </Typography>
        <TextField
          fullWidth
          placeholder="seuemail@hospital.com"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: '#c4c9d4', fontSize: 17, mr: 0.5 }} />
                </InputAdornment>
              )
            }
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '13px',
              backgroundColor: '#f9fafb',
              boxShadow: '0 0 0 1.5px #e8eaed',
              transition: 'box-shadow 0.2s',
              '& fieldset': { border: 'none' },
              '&.Mui-focused': { boxShadow: '0 0 0 2px #e05a47, 0 4px 14px rgba(224,90,71,0.1)' },
              '& input': { py: 1.6, fontSize: '0.9rem', fontWeight: 500, color: '#111827' }
            }
          }}
        />

        {/* Password */}
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151', mb: 0.9, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Crie uma senha forte
        </Typography>
        <TextField
          fullWidth
          placeholder="Mínimo 6 caracteres"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#c4c9d4', fontSize: 17, mr: 0.5 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end" size="small" sx={{ mr: 0.2 }}>
                    {showPassword
                      ? <VisibilityOff sx={{ fontSize: 17, color: '#c4c9d4' }} />
                      : <Visibility sx={{ fontSize: 17, color: '#c4c9d4' }} />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
          sx={{
            mb: password ? 1 : 3.5,
            '& .MuiOutlinedInput-root': {
              borderRadius: '13px',
              backgroundColor: '#f9fafb',
              boxShadow: '0 0 0 1.5px #e8eaed',
              transition: 'box-shadow 0.2s',
              '& fieldset': { border: 'none' },
              '&.Mui-focused': { boxShadow: '0 0 0 2px #e05a47, 0 4px 14px rgba(224,90,71,0.1)' },
              '& input': { py: 1.6, fontSize: '0.9rem', fontWeight: 500, color: '#111827' }
            }
          }}
        />

        {/* Password strength indicator */}
        {password && (
          <Box sx={{ mb: 3.5 }}>
            <LinearProgress
              variant="determinate"
              value={strength.level}
              sx={{
                height: 4,
                borderRadius: '99px',
                bgcolor: '#e8eaed',
                mb: 0.8,
                '& .MuiLinearProgress-bar': { bgcolor: strength.color, borderRadius: '99px', transition: 'all 0.35s ease' }
              }}
            />
            <Typography sx={{ fontSize: '0.7rem', color: strength.color, fontWeight: 600 }}>
              Força da senha: {strength.label}
            </Typography>
          </Box>
        )}

        {/* Submit */}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={loading}
          endIcon={!loading && <ArrowForwardIcon sx={{ fontSize: 17 }} />}
          sx={{
            py: 1.85,
            borderRadius: '13px',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            bgcolor: '#0f1117',
            color: '#ffffff',
            boxShadow: '0 4px 18px rgba(15,17,23,0.18)',
            transition: 'all 0.2s ease',
            mb: 3.5,
            '&:hover': { bgcolor: '#1e2535', transform: 'translateY(-1px)', boxShadow: '0 8px 26px rgba(15,17,23,0.26)' },
            '&:active': { transform: 'translateY(0)' },
            '&.Mui-disabled': { bgcolor: '#d1d5db', color: '#fff' }
          }}
        >
          {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Criar minha conta'}
        </Button>

        {/* Login link */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>
            Já possui conta?{' '}
            <Box
              component="span"
              onClick={() => navigate('/login')}
              sx={{ color: '#e05a47', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Fazer login
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
