import type { PaytrInitiateResponse } from '@/types';
import { apiErrorMessage } from '@/lib/api-error-message';

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
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? payload.message
        : undefined;
    throw new Error(apiErrorMessage(response.status, message, 'Kartla ödeme başlatılamadı. Lütfen tekrar deneyin.'));
  }

  return payload as PaytrInitiateResponse;
}

export const paymentService = {
  initiatePaytr,
};
