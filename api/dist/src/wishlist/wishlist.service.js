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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const product_pricing_util_1 = require("../products/product-pricing.util");
const wishlistInclude = {
    product: {
        include: {
            category: true,
            images: {
                orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
            },
        },
    },
};
let WishlistService = class WishlistService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(userId) {
        const items = await this.prisma.wishlistItem.findMany({
            where: { userId },
            include: wishlistInclude,
            orderBy: { createdAt: 'desc' },
        });
        return items.map((item) => this.mapItem(item));
    }
    async add(userId, productId) {
        const product = await this.prisma.product.findFirst({
            where: { id: productId, isActive: true, deletedAt: null },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const item = await this.prisma.wishlistItem.upsert({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
            update: {},
            create: { userId, productId },
            include: wishlistInclude,
        });
        return this.mapItem(item);
    }
    async remove(userId, productId) {
        const deleted = await this.prisma.wishlistItem.deleteMany({
            where: { userId, productId },
        });
        if (deleted.count === 0) {
            throw new common_1.NotFoundException('Wishlist item not found');
        }
        return { success: true };
    }
    mapItem(item) {
        return {
            ...item,
            product: {
                ...item.product,
                pricing: (0, product_pricing_util_1.computeProductPricing)(item.product),
            },
        };
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map