# Especificações Técnicas - Módulo de Autenticação (`auth`)

Este documento detalha as definições técnicas, schemas, interfaces e integração com a API para o módulo de Autenticação.

## 1. Integração com a API Backend

### 1.1 Cadastro de Usuário
*   **Endpoint:** `POST /api/users`
*   **Método:** `POST`
*   **Payload (JSON):**
    ```typescript
    interface CreateUserRequest {
      name: string;
      email: string;
      passwordHash: string; // Nota: Embora o backend chame de passwordHash no DTO de entrada, deve ser fornecido a senha aberta para o backend tratar, ou hash se exigido.
      role: 'ATTENDANT' | 'DOCTOR';
    }
    ```
*   **Resposta (200 OK):** Retorna o Guid do usuário criado.

### 1.2 Login do Usuário
*   **Endpoint:** `POST /api/auth/login`
*   **Método:** `POST`
*   **Payload (JSON):**
    ```typescript
    interface LoginRequest {
      email: string;
      password:  string;
    }
    ```
*   **Resposta (200 OK):**
    ```typescript
    interface LoginResponse {
      token: string;
    }
    ```

---

## 2. Estrutura do Payload do JWT (Claims)
Quando decodificado no frontend utilizando a biblioteca `jwt-decode`, o token possui o seguinte formato:
```typescript
interface DecodedToken {
  sub: string;         // GUID do Usuário
  email: string;       // E-mail do Usuário
  role: 'ATTENDANT' | 'DOCTOR'; // Papel de Acesso
  exp: number;         // Timestamp de expiração
  jti: string;         // Identificador do token
}
```

---

## 3. Validação de Formulários (Schemas Zod)

### 3.1 Schema de Login
```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('Formato de e-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

### 3.2 Schema de Registro
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().min(1, 'O e-mail é obrigatório').email('Formato de e-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['ATTENDANT', 'DOCTOR'], {
    errorMap: () => ({ message: 'Selecione um papel de acesso válido' }),
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
```

---

## 4. Estado de Autenticação (`AuthContext`)
O frontend deve manter um contexto global de autenticação (`AuthContext`) expondo as seguintes propriedades:
```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    role: 'ATTENDANT' | 'DOCTOR';
  } | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
```
