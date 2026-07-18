import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { loginRequest, registerRequest } from '../api/auth';
import type { LoginCredentials, RegisterCredentials } from '../types';

/**
 * Login
 * (sessionStorage)
 */
export function useLoginMutation() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginRequest(credentials),
    onSuccess: (data) => {
      const token = data.token || (data as any).Token;
      if (token) {
        login(token);
      }
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => registerRequest(credentials),
  });
}
