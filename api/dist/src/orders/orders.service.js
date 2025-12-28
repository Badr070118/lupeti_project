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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const orderInclude = {
    items: {
        orderBy: { id: 'asc' },
    },
};
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkout(userId, dto) {
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
                throw new common_1.BadRequestException('Cart is empty');
            }
            let subtotal = 0;
            for (const item of cart.items) {
                if (!item.product || !item.product.isActive) {
                    throw new common_1.ConflictException(`Product ${item.product?.title ?? item.productId} is not available`);
                }
                if (item.quantity < 1 || item.quantity > 20) {
                    throw new common_1.BadRequestException('Invalid cart quantity detected');
                }
                if (item.product.stock < item.quantity) {
                    throw new common_1.ConflictException(`Insufficient stock for ${item.product.title}`);
                }
                subtotal += item.product.priceCents * item.quantity;
            }
            const shippingMethod = (dto.shippingMethod ?? 'STANDARD').toUpperCase();
            const shippingCents = this.calculateShipping(shippingMethod);
            const total = subtotal + shippingCents;
            const order = await tx.order.create({
                data: {
                    userId,
                    status: client_1.OrderStatus.PENDING_PAYMENT,
                    currency: 'TRY',
                    subtotalCents: subtotal,
                    shippingCents,
                    totalCents: total,
                    shippingMethod,
                    shippingAddress: dto.shippingAddress,
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
    listMyOrders(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: orderInclude,
        });
    }
    async getMyOrder(userId, id) {
        const order = await this.prisma.order.findFirst({
            where: { id, userId },
            include: orderInclude,
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async listAllOrders(query) {
        const page = query.page ?? 1;
        const limit = Math.min(Math.max(query.limit ?? 20, 1), 50);
        const skip = (page - 1) * limit;
        const where = {};
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
    async updateStatus(id, dto) {
        try {
            return await this.prisma.order.update({
                where: { id },
                data: { status: dto.status },
                include: orderInclude,
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025') {
                throw new common_1.NotFoundException('Order not found');
            }
            throw error;
        }
    }
    calculateShipping(method) {
        return method.toUpperCase() === 'EXPRESS' ? 2500 : 0;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map