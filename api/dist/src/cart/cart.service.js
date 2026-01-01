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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const product_pricing_util_1 = require("../products/product-pricing.util");
const cartInclude = {
    items: {
        include: {
            product: {
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    priceCents: true,
                    originalPriceCents: true,
                    discountType: true,
                    discountValue: true,
                    promoStartAt: true,
                    promoEndAt: true,
                    currency: true,
                    stock: true,
                    isActive: true,
                    images: {
                        orderBy: [
                            { sortOrder: 'asc' },
                            { createdAt: 'asc' },
                        ],
                        take: 1,
                    },
                },
            },
        },
        orderBy: { createdAt: 'asc' },
    },
};
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        const cart = await this.ensureCart(userId);
        const result = await this.prisma.cart.findUnique({
            where: { id: cart.id },
            include: cartInclude,
        });
        return this.mapCartProductImages(result);
    }
    async addItem(userId, dto) {
        const cart = await this.ensureCart(userId);
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product || !product.isActive) {
            throw new common_1.NotFoundException('Product is not available');
        }
        const existing = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: dto.productId,
                },
            },
        });
        const nextQuantity = (existing?.quantity ?? 0) + dto.quantity;
        this.assertQuantity(nextQuantity);
        this.assertStock(product.stock, nextQuantity);
        if (existing) {
            await this.prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: nextQuantity },
            });
        }
        else {
            await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: dto.productId,
                    quantity: dto.quantity,
                },
            });
        }
        const result = await this.prisma.cart.findUnique({
            where: { id: cart.id },
            include: cartInclude,
        });
        return this.mapCartProductImages(result);
    }
    async updateItem(userId, itemId, dto) {
        this.assertQuantity(dto.quantity);
        const item = await this.prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cart: { userId },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        const product = await this.prisma.product.findUnique({
            where: { id: item.productId },
        });
        if (!product || !product.isActive) {
            throw new common_1.ConflictException('Product is not available');
        }
        this.assertStock(product.stock, dto.quantity);
        await this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: dto.quantity },
        });
        return this.getCart(userId);
    }
    async removeItem(userId, itemId) {
        const item = await this.prisma.cartItem.findFirst({
            where: { id: itemId, cart: { userId } },
        });
        if (!item) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
        });
        if (cart) {
            await this.prisma.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
        }
        return this.getCart(userId);
    }
    assertQuantity(quantity) {
        if (quantity < 1 || quantity > 20) {
            throw new common_1.BadRequestException('Quantity must be between 1 and 20');
        }
    }
    assertStock(stock, quantity) {
        if (stock < quantity) {
            throw new common_1.ConflictException('Insufficient stock for this product');
        }
    }
    ensureCart(userId) {
        return this.prisma.cart.upsert({
            where: { userId },
            update: {},
            create: { userId },
        });
    }
    mapCartProductImages(cart) {
        if (!cart) {
            return cart;
        }
        return {
            ...cart,
            items: cart.items.map((item) => {
                const { images: imageRecords, ...product } = item.product;
                const [image] = imageRecords ?? [];
                const pricing = (0, product_pricing_util_1.computeProductPricing)(product);
                return {
                    ...item,
                    product: {
                        ...product,
                        pricing,
                        imageUrl: image?.url ?? null,
                    },
                };
            }),
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map