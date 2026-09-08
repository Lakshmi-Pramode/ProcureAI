import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import type { User } from '../types';
import { demoUser } from '../data/demo';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, role?: string) => Promise<boolean>;
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
          // Keep existing or demo
        });
    }
  }, [user]);

  const login = useCallback(async (email: string, _password?: string, role = 'officer'): Promise<boolean> => {
    try {
      const resp = await api.auth.login(email, role);
      if (resp && resp.user) {
        setUser(resp.user);
        sessionStorage.setItem('bidguard_user', JSON.stringify(resp.user));
        return true;
      }
    } catch (err) {
      console.warn('API login failed, falling back to demo session:', err);
    }

    // Demo fallback
    setUser(demoUser);
    sessionStorage.setItem('bidguard_user', JSON.stringify(demoUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('bidguard_user');
    sessionStorage.removeItem('bidguard_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
