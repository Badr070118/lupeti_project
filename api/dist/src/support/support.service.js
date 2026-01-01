"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const support_notifier_service_1 = require("./support-notifier.service");
const ticketInclude = {
    user: {
        select: {
            id: true,
            email: true,
            name: true,
        },
    },
    replies: {
        orderBy: { createdAt: 'asc' },
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
let SupportService = class SupportService {
    prisma;
    notifier;
    constructor(prisma, notifier) {
        this.prisma = prisma;
        this.notifier = notifier;
    }
    async createTicket(dto, user) {
        const email = dto.email?.toLowerCase() ?? user?.email;
        if (!email) {
            throw new common_1.BadRequestException('Email is required');
        }
        const ticket = await this.prisma.supportTicket.create({
            data: {
                email,
                subject: dto.subject,
                message: dto.message,
                category: dto.category ?? client_1.TicketCategory.OTHER,
                status: client_1.TicketStatus.OPEN,
                userId: user?.sub ?? null,
            },
            include: ticketInclude,
        });
        await this.notifier.notifySupport(`New ticket: ${ticket.subject}`, `${ticket.email}\n\n${ticket.message}`);
        return ticket;
    }
    async listTickets(query) {
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
    async getTicket(id) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id },
            include: ticketInclude,
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket not found');
        }
        return ticket;
    }
    async updateStatus(id, dto, adminId) {
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
    async replyToTicket(id, dto, admin) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id },
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket not found');
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
                status: ticket.status === client_1.TicketStatus.CLOSED
                    ? client_1.TicketStatus.CLOSED
                    : client_1.TicketStatus.IN_PROGRESS,
                assignedToId: admin.sub,
                updatedAt: new Date(),
            },
        });
        await this.notifier.notifyCustomer(ticket.email, `Reply to your ticket "${ticket.subject}"`, dto.message);
        return this.getTicket(id);
    }
    buildWhere(query) {
        const where = {};
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
    async ensureTicketExists(id) {
        const exists = await this.prisma.supportTicket.count({ where: { id } });
        if (!exists) {
            throw new common_1.NotFoundException('Ticket not found');
        }
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        support_notifier_service_1.SupportNotifierService])
], SupportService);
//# sourceMappingURL=support.service.js.map