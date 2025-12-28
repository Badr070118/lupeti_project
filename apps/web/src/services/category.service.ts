import { fetchApi } from '@/lib/api';
import type { Category } from '@/types';

async function listCategories() {
  return fetchApi<Category[]>('/categories', { cache: 'no-store' });
}

export const categoryService = {
  list: listCategories,
};
