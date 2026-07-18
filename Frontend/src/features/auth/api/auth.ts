import api from '@/lib/axios';
import type { LoginCredentials, LoginResponse, RegisterCredentials } from '../types';

/**
 * Envia uma requisição de login ao backend.
 * @param credentials E-mail e senha do usuário.
 */
export async function loginRequest(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/api/auth/login', credentials);
  return response.data;
}

/**
 * Envia uma requisição de cadastro de usuário ao backend.
 * @param credentials Dados do novo usuário (nome, e-mail, senha e perfil).
 */
export async function registerRequest(credentials: RegisterCredentials): Promise<void> {
  await api.post('/api/users', credentials);
}
