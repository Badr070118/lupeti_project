import { fetchApi } from '@/lib/api';
import type { PublicSettings } from '@/types';

async function getPublic() {
  return fetchApi<PublicSettings>('/settings/public', { cache: 'no-store' });
}

export const settingsService = {
  getPublic,
};
