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
  CircularProgress
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  MedicalServices as MedicalServicesIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import api from '@/lib/axios';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTogglePassword = () => setShowPassword((p) => !p);

  const generateMockToken = (selectedEmail: string, selectedRole: string) => {
    const payload = {
      sub: 'mock-user-id-123',
      email: selectedEmail,
      role: selectedRole,
      exp: Math.floor(Date.now() / 1000) + 86400 // Expira em 24h
    };
    
    try {
      // Cria um token JWT estruturado fake
      const headerStr = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
      const payloadStr = JSON.stringify(payload);
      
      // btoa com suporte a caracteres latinos/utf8 simples
      const headerB64 = btoa(unescape(encodeURIComponent(headerStr)))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      const payloadB64 = btoa(unescape(encodeURIComponent(payloadStr)))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        
      return `${headerB64}.${payloadB64}.mocksignature`;
    } catch (e) {
      console.error('Erro ao gerar token mock', e);
      return null;
    }
  };

  const handleMockLogin = (type: 'ATTENDANT' | 'DOCTOR') => {
    const mockEmail = type === 'ATTENDANT' ? 'atendente@medflow.com' : 'medico@medflow.com';
    const mockToken = generateMockToken(mockEmail, type);
    
    if (mockToken) {
      login(mockToken);
      // O médico vai para /laudar e o atendente vai para /dashboard
      if (type === 'DOCTOR') {
        navigate('/laudar');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Erro ao gerar credenciais de testes.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, insira seu e-mail e senha.');
      return;
    }

    // Bypass de login para credenciais mockadas informadas
    if (email === 'atendente@medflow.com' && password === '123456') {
      handleMockLogin('ATTENDANT');
      return;
    }
    if (email === 'medico@medflow.com' && password === '123456') {
      handleMockLogin('DOCTOR');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const token = response.data.token || response.data.Token;
      if (token) {
        login(token);
        try {
          const decoded = jwtDecode<{ role: string }>(token);
          if (decoded.role?.toUpperCase() === 'DOCTOR') {
            navigate('/laudar');
          } else {
            navigate('/dashboard');
          }
        } catch {
          navigate('/dashboard');
        }
      } else {
        setError('Ocorreu um erro ao obter a credencial de acesso.');
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('E-mail ou senha incorretos. Por favor, verifique.');
      } else {
        setError('Erro na comunicação com o servidor. Tente novamente mais tarde.');
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
        <Box sx={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', filter: 'blur(120px)', opacity: 0.2, bgcolor: '#e05a47', top: '-10%', right: '-5%' }} />
        <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', filter: 'blur(130px)', opacity: 0.1, bgcolor: '#6366f1', bottom: '-10%', left: '-5%' }} />
      </Box>

      {/* Card */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 420,
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
        <Box sx={{ mb: 4.5 }}>
          <Typography
            sx={{
              fontSize: { xs: '1.9rem', sm: '2.1rem' },
              fontWeight: 800,
              color: '#0f1117',
              letterSpacing: '-1.5px',
              lineHeight: 1.05,
              mb: 1.2
            }}
          >
            Bem-vindo<br />de volta.
          </Typography>
          <Typography sx={{ fontSize: '0.87rem', color: '#6b7280', fontWeight: 500, lineHeight: 1.65 }}>
            Insira suas credenciais para acessar a plataforma de gestão de exames.
          </Typography>
        </Box>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            variant="outlined"
            sx={{
              borderRadius: '13px',
              borderColor: '#fca5a5',
              bgcolor: '#fff5f5',
              color: '#991b1b',
              mb: 3.5,
              fontSize: '0.82rem',
              '& .MuiAlert-icon': { color: '#ef4444' }
            }}
          >
            {error}
          </Alert>
        )}

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
            mb: 2.5,
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.9 }}>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            Senha de acesso
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={() => setError('Contate a TI da sua clínica para redefinir sua senha.')}
            sx={{ textTransform: 'none', color: '#e05a47', fontWeight: 600, fontSize: '0.77rem', p: 0, minWidth: 0, '&:hover': { color: '#c84937', bgcolor: 'transparent' } }}
          >
            Esqueceu?
          </Button>
        </Box>
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
            mb: 3,
            '&:hover': { bgcolor: '#1e2535', transform: 'translateY(-1px)', boxShadow: '0 8px 26px rgba(15,17,23,0.26)' },
            '&:active': { transform: 'translateY(0)' },
            '&.Mui-disabled': { bgcolor: '#d1d5db', color: '#fff' }
          }}
        >
          {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Entrar na plataforma'}
        </Button>

        {/* Mock Accounts for Testing */}
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f9fafb', borderRadius: '14px', border: '1px dashed #e8eaed' }}>
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', mb: 1, letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'center' }}>
            Acesso Rápido para Testes (Mock)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              onClick={() => handleMockLogin('ATTENDANT')}
              sx={{
                fontSize: '0.7rem',
                textTransform: 'none',
                fontWeight: 700,
                color: '#e05a47',
                borderColor: 'rgba(224,90,71,0.3)',
                borderRadius: '9px',
                py: 0.8,
                '&:hover': { borderColor: '#e05a47', bgcolor: 'rgba(224,90,71,0.04)' }
              }}
            >
              Atendente
            </Button>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              onClick={() => handleMockLogin('DOCTOR')}
              sx={{
                fontSize: '0.7rem',
                textTransform: 'none',
                fontWeight: 700,
                color: '#6366f1',
                borderColor: 'rgba(99,102,241,0.3)',
                borderRadius: '9px',
                py: 0.8,
                '&:hover': { borderColor: '#6366f1', bgcolor: 'rgba(99,102,241,0.04)' }
              }}
            >
              Médico
            </Button>
          </Box>
        </Box>

        {/* Register link */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>
            Novo na plataforma?{' '}
            <Box
              component="span"
              onClick={() => navigate('/register')}
              sx={{ color: '#e05a47', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Criar conta
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
