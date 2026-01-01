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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview() {
        const [productStats, userStats, orderStats, ticketStats, revenue] = await this.prisma.$transaction([
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
                            client_1.OrderStatus.PAID,
                            client_1.OrderStatus.SHIPPED,
                            client_1.OrderStatus.DELIVERED,
                        ],
                    },
                },
            }),
        ]);
        const activeUsers = await this.prisma.user.count({
            where: {
                deletedAt: null,
                status: client_1.UserStatus.ACTIVE,
            },
        });
        const openTickets = await this.prisma.supportTicket.count({
            where: { status: client_1.TicketStatus.OPEN },
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map