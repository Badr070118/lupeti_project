import { ConflictException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';

describe('OrdersService inventory', () => {
  const item = { productId: 'product', quantity: 2 };
  let status: OrderStatus;
  let stock: number;
  let service: OrdersService;

  beforeEach(() => {
    status = OrderStatus.PENDING_PAYMENT;
    stock = 3;
    const tx = {
      $queryRaw: jest.fn(),
      order: {
        findUnique: jest.fn(async () => ({ id: 'order', userId: 'user', status, items: [item] })),
        update: jest.fn(async ({ data }: { data: { status: OrderStatus } }) => {
          status = data.status;
          return { id: 'order', userId: 'user', status, items: [item] };
        }),
      },
      product: {
        update: jest.fn(async ({ data }: { data: { stock: { increment: number } } }) => {
          stock += data.stock.increment;
        }),
      },
    };
    const prisma = {
      $transaction: async (callback: (client: typeof tx) => unknown) => callback(tx),
      user: { findUnique: jest.fn(async () => null) },
    };
    service = new OrdersService(prisma as never, {} as never, {} as never);
  });

  it('restores stock exactly once when an order is cancelled', async () => {
    await service.updateStatus('order', { status: OrderStatus.CANCELLED });
    await service.updateStatus('order', { status: OrderStatus.CANCELLED });
    expect(stock).toBe(5);
  });

  it('prevents a cancelled order from being reopened', async () => {
    await service.updateStatus('order', { status: OrderStatus.CANCELLED });
    await expect(service.updateStatus('order', { status: OrderStatus.PAID })).rejects.toBeInstanceOf(ConflictException);
    expect(stock).toBe(5);
  });
});
