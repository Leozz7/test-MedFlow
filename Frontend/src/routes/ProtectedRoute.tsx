import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('medflow_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    try {
      // No futuro, podemos ler a role real decodificada do token usando jwt-decode
      // const decoded = jwtDecode<{ role: string }>(token);
      // if (!allowedRoles.includes(decoded.role)) {
      //   return <Navigate to="/unauthorized" replace />;
      // }
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
