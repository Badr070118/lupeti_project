import { ConflictException } from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { createHmac } from 'crypto';
import { PaymentsService } from './payments.service';

describe('PayTR callback', () => {
  it('restores stock only on the first failure and rejects a later success', async () => {
    let status: OrderStatus = OrderStatus.PENDING_PAYMENT;
    let paymentStatus: PaymentStatus = PaymentStatus.PENDING;
    let stock = 0;
    const payment = { id: 'payment', orderId: 'order', amountCents: 100 };
    const tx = {
      $queryRaw: jest.fn(),
      order: {
        findUnique: jest.fn(async () => ({ status, payment: { status: paymentStatus }, items: [{ productId: 'product', quantity: 2 }] })),
        update: jest.fn(async ({ data }: { data: { status: OrderStatus } }) => { status = data.status; }),
      },
      payment: {
        update: jest.fn(async ({ data }: { data: { status: PaymentStatus } }) => { paymentStatus = data.status; }),
      },
      product: { update: jest.fn(async () => { stock += 2; }) },
      paymentEvent: { create: jest.fn() },
    };
    const prisma = {
      payment: { findFirst: jest.fn(async () => payment) },
      $transaction: async (callback: (client: typeof tx) => unknown) => callback(tx),
    };
    const config = { get: (key: string) => key === 'PAYTR_MERCHANT_KEY' ? 'key' : 'salt' };
    const service = new PaymentsService(prisma as never, config as never, {} as never);
    const payload = (result: string) => ({
      merchant_oid: 'merchant', status: result, total_amount: '100',
      hash: createHmac('sha256', 'key').update(`merchantsalt${result}100`).digest('base64'),
    });
    await service.handlePaytrCallback(payload('failed'));
    await service.handlePaytrCallback(payload('failed'));
    expect(stock).toBe(2);
    await expect(service.handlePaytrCallback(payload('success'))).rejects.toBeInstanceOf(ConflictException);
    expect(stock).toBe(2);
  });
});
