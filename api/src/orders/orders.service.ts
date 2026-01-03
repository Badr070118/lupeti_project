import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, PaymentProvider, PaymentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { computeProductPricing } from '../products/product-pricing.util';
import { SettingsService } from '../settings/settings.service';
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService,
  ) {}

  async checkout(userId: string, dto: CheckoutDto) {
    const storeSettings = await this.settingsService.getStoreSettings();
    if (!storeSettings.enableCheckout) {
      throw new ConflictException('Checkout is currently disabled');
    }
    const shippingMethod = (
      dto.shippingMethod ?? 'STANDARD'
    ).toUpperCase() as 'STANDARD' | 'EXPRESS';
    const paymentProvider = (
      dto.paymentProvider ?? 'PAYTR'
    ).toUpperCase() as PaymentProvider;
    const shippingCents =
      shippingMethod === 'EXPRESS'
        ? storeSettings.shippingExpressCents
        : storeSettings.shippingStandardCents;
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
        const pricing = computeProductPricing(item.product);
        subtotal += pricing.finalPriceCents * item.quantity;
      }

      const total = subtotal + shippingCents;

      const order = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING_PAYMENT,
          currency: storeSettings.currency,
          subtotalCents: subtotal,
          shippingCents,
          totalCents: total,
          shippingMethod,
          shippingAddress:
            dto.shippingAddress as unknown as Prisma.InputJsonValue,
          items: {
            create: cart.items.map((item) => {
              const pricing = computeProductPricing(item.product);
              return {
                productId: item.productId,
                titleSnapshot: item.product.title,
                priceCentsSnapshot: pricing.finalPriceCents,
                quantity: item.quantity,
                lineTotalCents: pricing.finalPriceCents * item.quantity,
              };
            }),
          },
        },
        include: orderInclude,
      });

      await tx.payment.create({
        data: {
          orderId: order.id,
          provider: paymentProvider,
          status:
            paymentProvider === PaymentProvider.COD
              ? PaymentStatus.PENDING
              : PaymentStatus.INITIATED,
          amountCents: order.totalCents,
          currency: order.currency,
        },
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

  async getOrder(id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id },
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

}
