# Especificações Técnicas - Estruturas Globais e Compartilhadas (`shared`)

Este documento especifica os detalhes técnicos, bibliotecas e configurações globais.

## 1. Variáveis de Ambiente (`.env`)
O projeto utilizará variáveis de ambiente para definir parâmetros dinâmicos:
```ini
VITE_API_URL=http://localhost:5001
```

---

## 2. Configuração do Cliente HTTP (Axios)
Arquivo `src/lib/axios.ts`:
```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medflow:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para capturar 401 e deslogar automaticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('medflow:token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 3. Estrutura de Roteamento (React Router Dom)
Configuração de rotas e proteção em `src/routes/AppRoutes.tsx`:
```typescript
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import AttendantDashboard from '../pages/exams/AttendantDashboard';
import DoctorDashboard from '../pages/exams/DoctorDashboard';
import ProtectedRoute from './ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rota Privada do Atendente */}
      <Route path="/dashboard/attendant" element={
        <ProtectedRoute allowedRole="ATTENDANT">
          <AttendantDashboard />
        </ProtectedRoute>
      } />

      {/* Rota Privada do Médico */}
      <Route path="/dashboard/doctor" element={
        <ProtectedRoute allowedRole="DOCTOR">
          <DoctorDashboard />
        </ProtectedRoute>
      } />

      {/* Redirecionamentos de Fallback */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<div>Página Não Encontrada (404)</div>} />
    </Routes>
  );
}
```

---

## 4. Gerenciamento de Notificações (`SnackbarContext`)
Provedor global de toasts expondo métodos simples:
```typescript
interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}
```
Implementado utilizando os componentes `Snackbar` e `Alert` do MUI.
