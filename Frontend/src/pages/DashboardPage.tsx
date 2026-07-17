import { Box, Container, Typography, Card, CardContent, Button } from '@mui/material';

export function DashboardPage() {
  const handleLogout = () => {
    localStorage.removeItem('medflow_token');
    window.location.href = '/login';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              MedFlow Dashboard
            </Typography>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Sair
            </Button>
          </Box>
          <Typography variant="body1">
            Seja bem-vindo ao painel principal do MedFlow. Esta é uma área restrita e segura.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
