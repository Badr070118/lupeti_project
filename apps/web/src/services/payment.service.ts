import { fetchApi } from '@/lib/api';
import type { PaytrInitiateResponse } from '@/types';

async function initiatePaytr(accessToken: string, orderId: string) {
  return fetchApi<PaytrInitiateResponse>('/payments/paytr/initiate', {
    method: 'POST',
    body: { orderId },
    accessToken,
  });
}

export const paymentService = {
  initiatePaytr,
};
