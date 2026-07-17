import { Box, Container, Typography, Card, CardContent, Button } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
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
           <Typography variant="body1" sx={{ mb: 2 }}>
            Seja bem-vindo, <strong>{user?.email}</strong> ({user?.role})!
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Este é o painel principal do MedFlow. Esta é uma área restrita e segura.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
