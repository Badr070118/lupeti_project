import { fetchApi } from '@/lib/api';
import type { WishlistItem } from '@/types';

export const wishlistService = {
  list(accessToken: string) {
    return fetchApi<WishlistItem[]>('/wishlist', {
      accessToken,
      cache: 'no-store',
    });
  },

  add(accessToken: string, productId: string) {
    return fetchApi<WishlistItem>('/wishlist/items', {
      method: 'POST',
      accessToken,
      body: { productId },
    });
  },

  remove(accessToken: string, productId: string) {
    return fetchApi<{ success: boolean }>(`/wishlist/items/${productId}`, {
      method: 'DELETE',
      accessToken,
    });
  },
};
