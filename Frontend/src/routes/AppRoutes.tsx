import { useEffect, lazy, Suspense } from 'react';
import { useLocation, BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

// Pages
const Login = lazy(() => import('@/pages/LoginPage'));
const Register = lazy(() => import('@/pages/RegisterPage'));
const DashboardDoctor = lazy(() => import('@/pages/doctor/Dashboard'));
const DashboardAttendant = lazy(() => import('@/pages/attendant/Dashboard'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'background.default',
    }}
  >
    <CircularProgress color="primary" />
  </Box>
);

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { isAuthReady } = useAuth();

  if (!isAuthReady) {
    return <PageLoader />;
  }

  return <>{children}</>;
};

const GlobalAuthListener = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleUnauthorized = () => {
      if (window.location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [navigate]);
  return null;
};

const ProtectedRoute = () => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};

interface RoleProtectedRouteProps {
  allowedRoles: string[];
}

export const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
  const { user, token } = useAuth();

  if (!token || !user) return <Navigate to="/login" replace />;

  if (allowedRoles.some((r) => r.toLowerCase() === user.role?.toLowerCase())) {
    return <Outlet />;
  }

  const fallbackPath = user.role?.toUpperCase() === 'DOCTOR' ? '/laudar' : '/dashboard';
  return <Navigate to={fallbackPath} replace />;
};

const DefaultRouteRedirect = () => {
  const { user, token } = useAuth();
  
  if (!token || !user) return <Navigate to="/login" replace />;
  
  return <Navigate to={user.role?.toUpperCase() === 'DOCTOR' ? '/laudar' : '/dashboard'} replace />;
};

export function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GlobalAuthListener />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleProtectedRoute allowedRoles={['ATTENDANT']} />}>
              <Route path="/dashboard" element={<DashboardAttendant />} />
            </Route>
            <Route element={<RoleProtectedRoute allowedRoles={['DOCTOR']} />}>
              <Route path="/laudar" element={<DashboardDoctor />} />
            </Route> 
          </Route>

          {/* Redirecionamento Padrão */}
          <Route path="*" element={<DefaultRouteRedirect />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
