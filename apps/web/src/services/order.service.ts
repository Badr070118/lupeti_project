import { fetchApi } from '@/lib/api';
import type { CheckoutPayload, Order } from '@/types';

async function checkout(accessToken: string, payload: CheckoutPayload) {
  return fetchApi<Order>('/orders/checkout', {
    method: 'POST',
    body: payload,
    accessToken,
  });
}

async function listMine(accessToken: string) {
  return fetchApi<Order[]>('/orders/my', {
    accessToken,
    cache: 'no-store',
  });
}

async function getMine(accessToken: string, id: string) {
  return fetchApi<Order>(`/orders/my/${id}`, {
    accessToken,
    cache: 'no-store',
  });
}

export const orderService = {
  checkout,
  listMine,
  getMine,
};
