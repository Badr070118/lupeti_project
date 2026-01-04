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
  const data = await fetchApi<Order[] | { data: Order[] }>('/orders/my', {
    accessToken,
    cache: 'no-store',
  });
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
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
