import { Box, Button, Container, TextField, Typography, Card, CardContent } from '@mui/material';

export function RegisterPage() {
  return (
    <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Card sx={{ width: '100%', p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              MedFlow
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Crie a sua conta de usuário
            </Typography>
            <TextField fullWidth label="Nome Completo" variant="outlined" size="small" />
            <TextField fullWidth label="Email" variant="outlined" size="small" />
            <TextField fullWidth label="Senha" type="password" variant="outlined" size="small" />
            <Button fullWidth variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
              Registrar
            </Button>
            <Button fullWidth variant="text" size="small">
              Já tem conta? Entre no sistema
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
