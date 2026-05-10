import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, getToken, setToken } from '../api/http';

export type AuthUser = { id: string; email: string; nombre: string; rol: string };
type AuthState = {
  user: AuthUser | null; loading: boolean; bootstrapped: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    if (!getToken()) { setBootstrapped(true); return; }
    api<AuthUser>('/auth/me').then(setUser).catch(() => setToken(null)).finally(() => setBootstrapped(true));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api<{ accessToken: string; user: AuthUser }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      setToken(res.accessToken);
      setUser(res.user);
      return res.user;
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => { setToken(null); setUser(null); }, []);

  const value = useMemo(() => ({ user, loading, bootstrapped, login, logout }), [user, loading, bootstrapped, login, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth fuera de AuthProvider');
  return ctx;
}