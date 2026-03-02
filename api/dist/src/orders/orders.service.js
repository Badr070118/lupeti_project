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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const product_pricing_util_1 = require("../products/product-pricing.util");
const settings_service_1 = require("../settings/settings.service");
const support_notifier_service_1 = require("../support/support-notifier.service");
const orderInclude = {
    items: {
        orderBy: { id: 'asc' },
    },
};
let OrdersService = OrdersService_1 = class OrdersService {
    prisma;
    settingsService;
    notifier;
    logger = new common_1.Logger(OrdersService_1.name);
    constructor(prisma, settingsService, notifier) {
        this.prisma = prisma;
        this.settingsService = settingsService;
        this.notifier = notifier;
    }
    async checkout(userId, dto) {
        const storeSettings = await this.settingsService.getStoreSettings();
        if (!storeSettings.enableCheckout) {
            throw new common_1.ConflictException('Checkout is currently disabled');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const shippingMethod = (dto.shippingMethod ?? 'STANDARD').toUpperCase();
        const paymentProvider = (dto.paymentProvider ?? 'PAYTR').toUpperCase();
        const shippingCents = shippingMethod === 'EXPRESS'
            ? storeSettings.shippingExpressCents
            : storeSettings.shippingStandardCents;
        const order = await this.prisma.$transaction(async (tx) => {
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
                const pricing = (0, product_pricing_util_1.computeProductPricing)(item.product);
                subtotal += pricing.finalPriceCents * item.quantity;
            }
            const total = subtotal + shippingCents;
            const order = await tx.order.create({
                data: {
                    userId,
                    status: client_1.OrderStatus.PENDING_PAYMENT,
                    currency: storeSettings.currency,
                    subtotalCents: subtotal,
                    shippingCents,
                    totalCents: total,
                    shippingMethod,
                    shippingAddress: dto.shippingAddress,
                    items: {
                        create: cart.items.map((item) => {
                            const pricing = (0, product_pricing_util_1.computeProductPricing)(item.product);
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
                    status: paymentProvider === client_1.PaymentProvider.COD
                        ? client_1.PaymentStatus.PENDING
                        : client_1.PaymentStatus.INITIATED,
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
        this.notifyOrderPlaced(user.email, order).catch((error) => {
            this.logger.warn(`Order confirmation failed for ${order.id}: ${error}`);
        });
        return order;
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
    async getOrder(id) {
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
            const updated = await this.prisma.order.update({
                where: { id },
                data: { status: dto.status },
                include: orderInclude,
            });
            this.notifyOrderStatusChange(updated).catch((error) => {
                this.logger.warn(`Order status email failed for ${updated.id}: ${error}`);
            });
            return updated;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025') {
                throw new common_1.NotFoundException('Order not found');
            }
            throw error;
        }
    }
    async notifyOrderPlaced(email, order) {
        if (!email)
            return;
        const subject = `Lupeti order confirmation #${order.id}`;
        const body = [
            `Hello,`,
            ``,
            `Thank you for your order with Lupeti.`,
            `Order ID: ${order.id}`,
            `Status: ${this.formatStatus(order.status)}`,
            ``,
            `Items:`,
            ...order.items.map((item) => `- ${item.titleSnapshot} x${item.quantity} (${this.formatMoney(item.lineTotalCents, order.currency)})`),
            ``,
            `Total: ${this.formatMoney(order.totalCents, order.currency)}`,
            ``,
            `We will keep you updated as your order progresses.`,
            ``,
            `Lupeti Support`,
        ].join('\n');
        await this.notifier.notifyCustomer(email, subject, body);
    }
    async notifyOrderStatusChange(order) {
        const user = await this.prisma.user.findUnique({
            where: { id: order.userId },
            select: { email: true },
        });
        if (!user?.email)
            return;
        const subject = `Your Lupeti order #${order.id} is now ${this.formatStatus(order.status)}`;
        const body = [
            `Hello,`,
            ``,
            `Your order status has been updated.`,
            `Order ID: ${order.id}`,
            `Current status: ${this.formatStatus(order.status)}`,
            ``,
            `Thank you for shopping with Lupeti.`,
            ``,
            `Lupeti Support`,
        ].join('\n');
        await this.notifier.notifyCustomer(user.email, subject, body);
    }
    formatStatus(status) {
        const map = {
            PENDING_PAYMENT: 'Pending payment',
            PAID: 'Paid',
            FAILED: 'Payment failed',
            CANCELLED: 'Cancelled',
            SHIPPED: 'Shipped',
            DELIVERED: 'Delivered',
        };
        return map[status] ?? status;
    }
    formatMoney(cents, currency) {
        return `${(cents / 100).toFixed(2)} ${currency}`;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        settings_service_1.SettingsService,
        support_notifier_service_1.SupportNotifierService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map