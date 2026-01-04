import type { PaytrInitiateResponse } from '@/types';

async function initiatePaytr(accessToken: string, orderId: string) {
  const response = await fetch('/api/payment/paytr/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ orderId }),
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => null)) as
    | PaytrInitiateResponse
    | { message?: string };

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Unable to initiate PayTR payment');
  }

  return payload as PaytrInitiateResponse;
}

export const paymentService = {
  initiatePaytr,
};
