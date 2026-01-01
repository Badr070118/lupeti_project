import { Injectable } from '@nestjs/common';
import { OrderStatus, TicketStatus, UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
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

    const activeUsers = await this.prisma.user.count({
      where: {
        deletedAt: null,
        status: UserStatus.ACTIVE,
      },
    });

    const openTickets = await this.prisma.supportTicket.count({
      where: { status: TicketStatus.OPEN },
    });

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
    };
  }
}
