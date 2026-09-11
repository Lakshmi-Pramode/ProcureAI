import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import type { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (user: any) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('bidguard_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Check auth on mount
  useEffect(() => {
    const token = sessionStorage.getItem('bidguard_token');
    if (token && !user) {
      api.auth.me()
        .then(u => {
          if (u) {
            setUser(u);
            sessionStorage.setItem('bidguard_user', JSON.stringify(u));
          }
        })
        .catch(() => {
          // invalid token
          sessionStorage.removeItem('bidguard_token');
        });
    }
  }, [user]);

  const login = useCallback(async (email: string, password?: string): Promise<boolean> => {
    try {
      const resp = await api.auth.login(email, password);
      if (resp && resp.user) {
        setUser(resp.user);
        sessionStorage.setItem('bidguard_user', JSON.stringify(resp.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed:', err);
      throw err; // Let the UI handle the error message
    }
  }, []);

  const register = useCallback(async (userData: any): Promise<boolean> => {
    try {
      const resp = await api.auth.register(userData);
      if (resp && resp.user) {
        setUser(resp.user);
        sessionStorage.setItem('bidguard_user', JSON.stringify(resp.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Registration failed:', err);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('bidguard_user');
    sessionStorage.removeItem('bidguard_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
