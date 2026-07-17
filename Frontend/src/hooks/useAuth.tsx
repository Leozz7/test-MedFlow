import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  name: string;
  exp: number;
}

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthReady: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const login = (newToken: string) => {
    localStorage.setItem('medflow_token', newToken);
    setToken(newToken);
    try {
      const decoded = jwtDecode<DecodedToken>(newToken);
      setUser({
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      });
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('medflow_token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('medflow_token');
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          logout();
        } else {
          setToken(storedToken);
          setUser({
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name,
          });
        }
      } catch {
        logout();
      }
    }
    setIsAuthReady(true);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
