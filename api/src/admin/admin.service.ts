import { Injectable } from '@nestjs/common';
import { OrderStatus, TicketStatus, UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [productStats, userStats, orderStats, ticketStats, revenue] =
      await this.prisma.$transaction([
        this.prisma.product.aggregate({
          _count: { _all: true },
          _sum: { stock: true },
          where: { deletedAt: null },
        }),
        this.prisma.user.aggregate({
          _count: { _all: true },
          where: { deletedAt: null },
        }),
        this.prisma.order.count(),
        this.prisma.supportTicket.aggregate({
          _count: { _all: true },
        }),
        this.prisma.order.aggregate({
          _sum: { totalCents: true },
          where: {
            status: {
              in: [
                OrderStatus.PAID,
                OrderStatus.SHIPPED,
                OrderStatus.DELIVERED,
              ],
            },
          },
        }),
      ]);

    const [activeUsers, openTickets, ordersLast7, ordersLast30, revenueLast30, newUsers] =
      await this.prisma.$transaction([
        this.prisma.user.count({
          where: {
            deletedAt: null,
            status: UserStatus.ACTIVE,
          },
        }),
        this.prisma.supportTicket.count({
          where: { status: TicketStatus.OPEN },
        }),
        this.prisma.order.count({
          where: { createdAt: { gte: last7Days } },
        }),
        this.prisma.order.count({
          where: { createdAt: { gte: last30Days } },
        }),
        this.prisma.order.aggregate({
          _sum: { totalCents: true },
          where: {
            status: {
              in: [
                OrderStatus.PAID,
                OrderStatus.SHIPPED,
                OrderStatus.DELIVERED,
              ],
            },
            createdAt: { gte: last30Days },
          },
        }),
        this.prisma.user.count({
          where: {
            deletedAt: null,
            createdAt: { gte: last30Days },
          },
        }),
      ]);

    const bestSellerStats = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        lineTotalCents: true,
      },
      where: {
        order: {
          status: {
            in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
          },
        },
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    const bestSellerProducts = await this.prisma.product.findMany({
      where: { id: { in: bestSellerStats.map((item) => item.productId) } },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    const bestSellerMap = new Map(
      bestSellerProducts.map((product) => [product.id, product]),
    );

    const bestSellers = bestSellerStats.map((item) => {
      const product = bestSellerMap.get(item.productId);
      return {
        productId: item.productId,
        title: product?.title ?? 'Unknown product',
        slug: product?.slug ?? '',
        unitsSold: item._sum.quantity ?? 0,
        revenueCents: item._sum.lineTotalCents ?? 0,
      };
    });

    const revenueLast30Cents = revenueLast30._sum.totalCents ?? 0;
    const averageOrderValueCents =
      ordersLast30 > 0 ? Math.round(revenueLast30Cents / ordersLast30) : 0;

    return {
      products: {
        total: productStats._count._all,
        stock: productStats._sum.stock ?? 0,
      },
      users: {
        total: userStats._count._all,
        active: activeUsers,
      },
      orders: {
        total: orderStats,
        revenueCents: revenue._sum.totalCents ?? 0,
      },
      tickets: {
        total: ticketStats._count._all,
        open: openTickets,
      },
      performance: {
        ordersLast7Days: ordersLast7,
        ordersLast30Days: ordersLast30,
        revenueLast30Cents: revenueLast30Cents,
        averageOrderValueCents,
        newCustomersLast30Days: newUsers,
      },
      bestSellers,
    };
  }
}
