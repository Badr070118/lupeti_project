import { fetchApi } from '@/lib/api';
import type { Cart } from '@/types';

async function getCart(accessToken: string) {
  return fetchApi<Cart>('/cart', {
    accessToken,
    cache: 'no-store',
  });
}

async function addItem(accessToken: string, productId: string, quantity = 1) {
  return fetchApi<Cart>('/cart/items', {
    method: 'POST',
    body: { productId, quantity },
    accessToken,
  });
}

async function updateItem(
  accessToken: string,
  itemId: string,
  quantity: number,
) {
  return fetchApi<Cart>(`/cart/items/${itemId}`, {
    method: 'PATCH',
    body: { quantity },
    accessToken,
  });
}

async function removeItem(accessToken: string, itemId: string) {
  return fetchApi<Cart>(`/cart/items/${itemId}`, {
    method: 'DELETE',
    accessToken,
  });
}

async function clearCart(accessToken: string) {
  return fetchApi<Cart>('/cart/clear', {
    method: 'DELETE',
    accessToken,
  });
}

export const cartService = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};
