'use client';

import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { authService } from '@/services/auth.service';
import { AuthContext } from '@/hooks/use-auth';
import type { AuthResponse, User } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const t = useTranslations('notifications');

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
          title: t('loginSuccess'),
          variant: 'success',
        });
      } catch (error) {
        showToast({
          title: t('authError'),
          description: error instanceof Error ? error.message : t('genericError'),
          variant: 'error',
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [applySession, showToast, t],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const session = await authService.register(email, password);
        applySession(session);
        showToast({
          title: t('registerSuccess'),
          variant: 'success',
        });
      } catch (error) {
        showToast({
          title: t('authError'),
          description: error instanceof Error ? error.message : t('genericError'),
          variant: 'error',
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [applySession, showToast, t],
  );

  const logout = useCallback(async () => {
    await authService.logout(accessToken);
    applySession(null);
    showToast({
      title: t('logoutSuccess'),
      variant: 'info',
    });
  }, [accessToken, applySession, showToast, t]);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, loading, login, register, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}
