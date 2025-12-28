import { ApiError, fetchApi } from '@/lib/api';
import type { AuthResponse, User } from '@/types';

export const authService = {
  async login(email: string, password: string) {
    return fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  async register(email: string, password: string) {
    return fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: { email, password },
    });
  },

  async logout(accessToken: string | null) {
    if (!accessToken) return;
    try {
      await fetchApi<void>('/auth/logout', {
        method: 'POST',
        accessToken,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return;
      }
      throw error;
    }
  },

  async refresh() {
    return fetchApi<AuthResponse>('/auth/refresh', {
      method: 'POST',
    });
  },

  async me(accessToken: string) {
    return fetchApi<User>('/auth/me', {
      accessToken,
    });
  },
};
