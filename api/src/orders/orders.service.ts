import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

const orderInclude = {
  items: {
    orderBy: { id: 'asc' as const },
  },
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(userId: string, dto: CheckoutDto) {
    return await this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      let subtotal = 0;

      for (const item of cart.items) {
        if (!item.product || !item.product.isActive) {
          throw new ConflictException(
            `Product ${item.product?.title ?? item.productId} is not available`,
          );
        }
        if (item.quantity < 1 || item.quantity > 20) {
          throw new BadRequestException('Invalid cart quantity detected');
        }
        if (item.product.stock < item.quantity) {
          throw new ConflictException(
            `Insufficient stock for ${item.product.title}`,
          );
        }
        subtotal += item.product.priceCents * item.quantity;
      }

      const shippingMethod = (
        dto.shippingMethod ?? 'STANDARD'
      ).toUpperCase() as 'STANDARD' | 'EXPRESS';
      const shippingCents = this.calculateShipping(shippingMethod);
      const total = subtotal + shippingCents;

      const order = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING_PAYMENT,
          currency: 'TRY',
          subtotalCents: subtotal,
          shippingCents,
          totalCents: total,
          shippingMethod,
          shippingAddress:
            dto.shippingAddress as unknown as Prisma.InputJsonValue,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              titleSnapshot: item.product.title,
              priceCentsSnapshot: item.product.priceCents,
              quantity: item.quantity,
              lineTotalCents: item.product.priceCents * item.quantity,
            })),
          },
        },
        include: orderInclude,
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }

  listMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: orderInclude,
    });
  }

  async getMyOrder(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: orderInclude,
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async listAllOrders(query: OrdersQueryDto) {
    const page = query.page ?? 1;
    const limit = Math.min(Math.max(query.limit ?? 20, 1), 50);
    const skip = (page - 1) * limit;
    const where: Prisma.OrderWhereInput = {};
    if (query.status) {
      where.status = query.status;
    }

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          ...orderInclude,
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: { status: dto.status },
        include: orderInclude,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Order not found');
      }
      throw error;
    }
  }

  private calculateShipping(method: string) {
    return method.toUpperCase() === 'EXPRESS' ? 2500 : 0;
  }
}
