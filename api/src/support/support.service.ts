import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TicketCategory, TicketStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { ReplyTicketDto } from './dto/reply-ticket.dto';
import { SupportQueryDto } from './dto/support-query.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { SupportNotifierService } from './support-notifier.service';

const ticketInclude = {
  user: {
    select: {
      id: true,
      email: true,
      name: true,
    },
  },
  replies: {
    orderBy: { createdAt: 'asc' as const },
    select: {
      id: true,
      body: true,
      authorRole: true,
      createdAt: true,
      author: {
        select: { id: true, email: true, name: true },
      },
    },
  },
};

@Injectable()
export class SupportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: SupportNotifierService,
  ) {}

  async createTicket(dto: CreateSupportTicketDto, user?: JwtPayload | null) {
    const email = dto.email?.toLowerCase() ?? user?.email;
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    const ticket = await this.prisma.supportTicket.create({
      data: {
        email,
        subject: dto.subject,
        message: dto.message,
        category: dto.category ?? TicketCategory.OTHER,
        status: TicketStatus.OPEN,
        userId: user?.sub ?? null,
      },
      include: ticketInclude,
    });

    await this.notifier.notifySupport(
      `New ticket: ${ticket.subject}`,
      `${ticket.email}\n\n${ticket.message}`,
    );

    return ticket;
  }

  async listTickets(query: SupportQueryDto) {
    const page = query.page ?? 1;
    const limit = Math.min(Math.max(query.limit ?? 20, 1), 100);
    const skip = (page - 1) * limit;

    const where = this.buildWhere(query);

    const [tickets, total] = await this.prisma.$transaction([
      this.prisma.supportTicket.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: ticketInclude,
      }),
      this.prisma.supportTicket.count({ where }),
    ]);

    return {
      data: tickets,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getTicket(id: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: ticketInclude,
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async updateStatus(id: string, dto: UpdateTicketStatusDto, adminId: string) {
    await this.ensureTicketExists(id);
    const updated = await this.prisma.supportTicket.update({
      where: { id },
      data: {
        status: dto.status,
        assignedToId: adminId,
      },
      include: ticketInclude,
    });
    return updated;
  }

  async replyToTicket(id: string, dto: ReplyTicketDto, admin: JwtPayload) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    await this.prisma.supportReply.create({
      data: {
        ticketId: id,
        authorId: admin.sub,
        authorRole: admin.role,
        body: dto.message,
      },
    });

    await this.prisma.supportTicket.update({
      where: { id },
      data: {
        status:
          ticket.status === TicketStatus.CLOSED
            ? TicketStatus.CLOSED
            : TicketStatus.IN_PROGRESS,
        assignedToId: admin.sub,
        updatedAt: new Date(),
      },
    });

    await this.notifier.notifyCustomer(
      ticket.email,
      `Reply to your ticket "${ticket.subject}"`,
      dto.message,
    );

    return this.getTicket(id);
  }

  private buildWhere(query: SupportQueryDto): Prisma.SupportTicketWhereInput {
    const where: Prisma.SupportTicketWhereInput = {};
    if (query.status) {
      where.status = query.status;
    }
    if (query.category) {
      where.category = query.category;
    }
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private async ensureTicketExists(id: string) {
    const exists = await this.prisma.supportTicket.count({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Ticket not found');
    }
  }
}
