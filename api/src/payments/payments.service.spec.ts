import { ConflictException } from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { createHmac } from 'crypto';
import { PaymentsService } from './payments.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PaytrCallbackDto } from './dto/paytr-callback.dto';

describe('PayTR callback', () => {
  it('accepts the documented PayTR callback fields with strict validation', async () => {
    const dto = plainToInstance(PaytrCallbackDto, {
      merchant_oid: 'merchant', status: 'success', total_amount: '100', hash: 'hash',
      payment_amount: '100', currency: 'TL', payment_type: 'card', test_mode: '1',
    });
    expect(await validate(dto, { whitelist: true, forbidNonWhitelisted: true })).toHaveLength(0);
  });

  it('rejects an unknown callback status', async () => {
    const dto = plainToInstance(PaytrCallbackDto, {
      merchant_oid: 'merchant', status: 'unexpected', total_amount: '100', hash: 'hash',
    });
    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('accepts a signed success with a higher collected amount and ignores duplicates', async () => {
    let orderStatus: OrderStatus = OrderStatus.PENDING_PAYMENT;
    let paymentStatus: PaymentStatus = PaymentStatus.PENDING;
    const payment = { id: 'payment', orderId: 'order', amountCents: 100 };
    const events = jest.fn();
    const tx = {
      $queryRaw: jest.fn(),
      order: {
        findUnique: jest.fn(async () => ({ status: orderStatus, payment: { status: paymentStatus }, items: [] })),
        update: jest.fn(async ({ data }: { data: { status: OrderStatus } }) => { orderStatus = data.status; }),
      },
      payment: { update: jest.fn(async ({ data }: { data: { status: PaymentStatus } }) => { paymentStatus = data.status; }) },
      product: { update: jest.fn() }, paymentEvent: { create: events },
    };
    const prisma = { payment: { findFirst: jest.fn(async () => payment) }, $transaction: async (callback: (client: typeof tx) => unknown) => callback(tx) };
    const service = new PaymentsService(prisma as never, { get: (key: string) => key === 'PAYTR_MERCHANT_KEY' ? 'key' : 'salt' } as never, {} as never);
    const payload = { merchant_oid: 'merchant', status: 'success', total_amount: '110', payment_amount: '100', hash: createHmac('sha256', 'key').update('merchantsaltsuccess110').digest('base64') };
    expect(await service.handlePaytrCallback(payload)).toBe('OK');
    expect(await service.handlePaytrCallback(payload)).toBe('OK');
    expect(orderStatus).toBe(OrderStatus.PAID);
    expect(paymentStatus).toBe(PaymentStatus.PAID);
    expect(events).toHaveBeenCalledTimes(1);
    expect(tx.product.update).not.toHaveBeenCalled();
  });
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

describe('PayTR initiation', () => {
  it('uses the configured public test IP and PayTR currency without exposing a real payment', async () => {
    const payment = { id: 'payment', orderId: 'order', provider: 'PAYTR', providerReference: null, amountCents: 100, currency: 'TRY' };
    const order = { id: 'order', status: OrderStatus.PENDING_PAYMENT, totalCents: 100, currency: 'TRY', user: { email: 'test@example.invalid' }, items: [], shippingAddress: {} };
    const prisma = {
      order: { findFirst: jest.fn().mockResolvedValue(order) },
      payment: {
        findUnique: jest.fn().mockResolvedValue(payment),
        update: jest.fn().mockResolvedValue({ ...payment, providerReference: 'payment' }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      paymentEvent: { create: jest.fn() },
    };
    const values: Record<string, string> = {
      PAYTR_TEST_MODE: '1', PAYTR_TEST_PUBLIC_IP: '8.8.8.8', PAYTR_MERCHANT_ID: 'merchant',
      PAYTR_MERCHANT_KEY: 'key', PAYTR_MERCHANT_SALT: 'salt', PAYTR_OK_URL: 'https://example.test/ok',
      PAYTR_FAIL_URL: 'https://example.test/fail', PAYTR_CALLBACK_URL: 'https://example.test/callback',
    };
    const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, text: async () => JSON.stringify({ status: 'success', token: 'test-token' }) } as Response);
    try {
      const service = new PaymentsService(prisma as never, { get: (key: string) => values[key] } as never, { isPaytrEnabled: async () => true } as never);
      const result = await service.initiatePaytr('user', { orderId: 'order' }, '127.0.0.1');
      const options = fetchMock.mock.calls[0][1];
      const body = new URLSearchParams(options?.body as string);
      expect(body.get('user_ip')).toBe('8.8.8.8');
      expect(body.get('currency')).toBe('TL');
      expect(body.get('test_mode')).toBe('1');
      expect(result.iframeUrl).toContain('test-token');
      delete values.PAYTR_TEST_PUBLIC_IP;
      await service.initiatePaytr('user', { orderId: 'order' }, '127.0.0.1');
      const fallbackBody = new URLSearchParams(fetchMock.mock.calls[1][1]?.body as string);
      expect(fallbackBody.get('user_ip')).toBe('127.0.0.1');
    } finally {
      fetchMock.mockRestore();
    }
  });
});
