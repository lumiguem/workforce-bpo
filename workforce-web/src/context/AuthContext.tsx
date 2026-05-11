import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as authService from '@/services/authService';

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: authService.LoginPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getInitialToken(): string | null {
  return localStorage.getItem('token');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getInitialToken);

  const login = useCallback(async (payload: authService.LoginPayload) => {
    const { token: receivedToken } = await authService.login(payload);
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    token,
    isAuthenticated: Boolean(token),
    login,
    logout,
  }), [token, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

