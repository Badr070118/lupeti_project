import { fetchApi } from '@/lib/api';
import type { Category } from '@/types';

async function listCategories() {
  return fetchApi<Category[]>('/categories', { cache: 'no-store' });
}

export const categoryService = {
  list: listCategories,
  create(accessToken: string, payload: { name: string; slug?: string }) {
    return fetchApi<Category>('/categories', {
      method: 'POST',
      accessToken,
      body: payload,
    });
  },
  update(accessToken: string, id: string, payload: { name?: string; slug?: string }) {
    return fetchApi<Category>(`/categories/${id}`, {
      method: 'PATCH',
      accessToken,
      body: payload,
    });
  },
  remove(accessToken: string, id: string) {
    return fetchApi(`/categories/${id}`, {
      method: 'DELETE',
      accessToken,
    });
  },
};
