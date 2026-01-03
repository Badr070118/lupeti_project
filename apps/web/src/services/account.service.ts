import { fetchApi } from '@/lib/api';
import type { Address, User } from '@/types';

type AddressPayload = Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export const accountService = {
  getProfile(accessToken: string) {
    return fetchApi<User>('/account/profile', { accessToken, cache: 'no-store' });
  },

  updateProfile(accessToken: string, payload: { name?: string }) {
    return fetchApi<User>('/account/profile', {
      method: 'PATCH',
      accessToken,
      body: payload,
    });
  },

  listAddresses(accessToken: string) {
    return fetchApi<Address[]>('/account/addresses', {
      accessToken,
      cache: 'no-store',
    });
  },

  createAddress(accessToken: string, payload: AddressPayload) {
    return fetchApi<Address>('/account/addresses', {
      method: 'POST',
      accessToken,
      body: payload,
    });
  },

  updateAddress(accessToken: string, id: string, payload: Partial<AddressPayload>) {
    return fetchApi<Address>(`/account/addresses/${id}`, {
      method: 'PATCH',
      accessToken,
      body: payload,
    });
  },

  removeAddress(accessToken: string, id: string) {
    return fetchApi<{ success: boolean }>(`/account/addresses/${id}`, {
      method: 'DELETE',
      accessToken,
    });
  },
};
