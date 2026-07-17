export type UserRole = 'ATTENDANT' | 'DOCTOR';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface LoginResponse {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
