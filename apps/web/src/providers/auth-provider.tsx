'use client';

import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { AuthContext } from '@/hooks/use-auth';
import type { AuthResponse, User } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const applySession = useCallback((session: AuthResponse | null) => {
    setUser(session?.user ?? null);
    setAccessToken(session?.accessToken ?? null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const session = await authService.refresh();
      applySession(session);
    } catch {
      applySession(null);
    } finally {
      setLoading(false);
    }
  }, [applySession]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const session = await authService.login(email, password);
        applySession(session);
        showToast({
          title: 'Welcome back!',
          description: 'You are now signed in.',
          variant: 'success',
        });
      } catch (error) {
        showToast({
          title: 'Login failed',
          description:
            error instanceof Error ? error.message : 'Unknown error occurred',
          variant: 'error',
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [applySession, showToast],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const session = await authService.register(email, password);
        applySession(session);
        showToast({
          title: 'Account created',
          description: 'Welcome to Lupeti! You are now signed in.',
          variant: 'success',
        });
      } catch (error) {
        showToast({
          title: 'Registration failed',
          description:
            error instanceof Error ? error.message : 'Unknown error occurred',
          variant: 'error',
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [applySession, showToast],
  );

  const logout = useCallback(async () => {
    await authService.logout(accessToken);
    applySession(null);
    showToast({
      title: 'Signed out',
      description: 'Come back soon!',
      variant: 'info',
    });
  }, [accessToken, applySession, showToast]);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, loading, login, register, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}
