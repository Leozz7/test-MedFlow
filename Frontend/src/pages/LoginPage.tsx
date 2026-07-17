import { Box, Button, Container, TextField, Typography, Card, CardContent } from '@mui/material';

export default function LoginPage() {
  return (
    <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Card sx={{ width: '100%', p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              MedFlow
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Entre com suas credenciais de acesso
            </Typography>
            <TextField fullWidth label="Email" variant="outlined" margin="normal" size="small" />
            <TextField fullWidth label="Senha" type="password" variant="outlined" margin="normal" size="small" />
            <Button fullWidth variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
              Entrar
            </Button>
            <Button fullWidth variant="text" size="small">
              Ainda não tem conta? Cadastre-se
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
