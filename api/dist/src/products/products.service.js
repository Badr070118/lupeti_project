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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const slugify_1 = require("../common/utils/slugify");
const prisma_service_1 = require("../prisma/prisma.service");
const product_pricing_util_1 = require("./product-pricing.util");
const product_media_service_1 = require("./product-media.service");
const productInclude = {
    category: true,
    images: {
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    },
};
const CATEGORY_SLUG_MAP = {
    chien: 'dog',
    dog: 'dog',
    chat: 'cat',
    cat: 'cat',
};
let ProductsService = class ProductsService {
    prisma;
    mediaService;
    constructor(prisma, mediaService) {
        this.prisma = prisma;
        this.mediaService = mediaService;
    }
    async listPublic(query) {
        const { page, limit, skip } = this.resolvePagination(query);
        const where = this.buildWhere(query, { forAdmin: false });
        const orderBy = this.buildSort(query);
        const [items, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: productInclude,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            data: items.map((item) => this.mapProduct(item)),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    }
    async listAdmin(query) {
        const page = query.page ?? 1;
        const limit = Math.min(Math.max(query.limit ?? 12, 1), 50);
        const skip = (page - 1) * limit;
        const where = this.buildWhere(query, { forAdmin: true });
        const orderBy = this.buildSort(query);
        const [items, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: productInclude,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            data: items.map((item) => this.mapProduct(item)),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    }
    async getPublic(slug) {
        const product = await this.prisma.product.findFirst({
            where: {
                slug,
                isActive: true,
                deletedAt: null,
            },
            include: productInclude,
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.mapProduct(product);
    }
    async getById(id) {
        const product = await this.prisma.product.findFirst({
            where: { id },
            include: productInclude,
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.mapProduct(product);
    }
    async create(dto) {
        this.assertPromoWindow(dto.promoStartAt, dto.promoEndAt);
        const slug = await this.generateProductSlug((0, slugify_1.ensureSlug)(dto.slug ?? dto.title, dto.title));
        try {
            const product = await this.prisma.product.create({
                data: {
                    slug,
                    sku: dto.sku?.trim() || null,
                    title: dto.title,
                    description: dto.description,
                    priceCents: dto.priceCents,
                    originalPriceCents: dto.originalPriceCents ?? null,
                    discountType: dto.discountType ?? null,
                    discountValue: dto.discountValue ?? null,
                    promoStartAt: dto.promoStartAt ?? null,
                    promoEndAt: dto.promoEndAt ?? null,
                    isFeatured: dto.isFeatured ?? false,
                    currency: this.normalizeCurrency(dto.currency),
                    stock: dto.stock,
                    isActive: dto.isActive ?? true,
                    category: {
                        connect: { id: dto.categoryId },
                    },
                    images: dto.images?.length
                        ? {
                            create: dto.images.map((image, index) => ({
                                url: image.url,
                                altText: image.altText ?? null,
                                sortOrder: image.sortOrder ?? index,
                            })),
                        }
                        : undefined,
                },
                include: productInclude,
            });
            return this.mapProduct(product);
        }
        catch (error) {
            this.handlePrismaError(error);
        }
    }
    async update(id, dto) {
        const existing = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Product not found');
        }
        this.assertPromoWindow(dto.promoStartAt, dto.promoEndAt);
        const data = {};
        if (dto.title)
            data.title = dto.title;
        if (dto.description)
            data.description = dto.description;
        if (dto.priceCents !== undefined)
            data.priceCents = dto.priceCents;
        if (dto.currency !== undefined) {
            data.currency = this.normalizeCurrency(dto.currency);
        }
        if (dto.stock !== undefined)
            data.stock = dto.stock;
        if (dto.isActive !== undefined)
            data.isActive = dto.isActive;
        if (dto.isFeatured !== undefined)
            data.isFeatured = dto.isFeatured;
        if (dto.sku !== undefined)
            data.sku = dto.sku || null;
        if (dto.discountType !== undefined)
            data.discountType = dto.discountType ?? null;
        if (dto.discountValue !== undefined)
            data.discountValue = dto.discountValue ?? null;
        if (dto.originalPriceCents !== undefined)
            data.originalPriceCents = dto.originalPriceCents ?? null;
        if (dto.promoStartAt !== undefined)
            data.promoStartAt = dto.promoStartAt ?? null;
        if (dto.promoEndAt !== undefined)
            data.promoEndAt = dto.promoEndAt ?? null;
        if (dto.categoryId) {
            data.category = {
                connect: { id: dto.categoryId },
            };
        }
        if (dto.slug) {
            data.slug = await this.generateProductSlug((0, slugify_1.ensureSlug)(dto.slug, dto.slug), id);
        }
        try {
            const product = await this.prisma.product.update({
                where: { id },
                data,
                include: productInclude,
            });
            return this.mapProduct(product);
        }
        catch (error) {
            this.handlePrismaError(error);
        }
    }
    async remove(id) {
        try {
            await this.prisma.product.update({
                where: { id },
                data: {
                    isActive: false,
                    deletedAt: new Date(),
                },
            });
            return { success: true };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025') {
                throw new common_1.NotFoundException('Product not found');
            }
            throw error;
        }
    }
    async addImage(productId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.prisma.productImage.create({
            data: {
                productId,
                url: dto.url,
                altText: dto.altText ?? null,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }
    async removeImage(imageId) {
        try {
            await this.prisma.productImage.delete({
                where: { id: imageId },
            });
            return { success: true };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025') {
                throw new common_1.NotFoundException('Product image not found');
            }
            throw error;
        }
    }
    async uploadProductImage(file) {
        return this.mediaService.saveProductImage(file);
    }
    async generateProductSlug(desired, excludeId) {
        let base = desired || 'product';
        base = (0, slugify_1.slugify)(base) || 'product';
        let candidate = base;
        let counter = 2;
        while (true) {
            const existing = await this.prisma.product.findUnique({
                where: { slug: candidate },
            });
            if (!existing || existing.id === excludeId) {
                return candidate;
            }
            candidate = `${base}-${counter}`;
            counter += 1;
        }
    }
    handlePrismaError(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            throw new common_1.ConflictException('Product with same slug or SKU exists');
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2003') {
            throw new common_1.NotFoundException('Related category not found');
        }
        throw error;
    }
    resolvePagination(query) {
        const page = query.page ?? 1;
        const limit = Math.min(Math.max(query.limit ?? 12, 1), 50);
        const skip = (page - 1) * limit;
        return { page, limit, skip };
    }
    buildWhere(query, options) {
        const where = {
            deletedAt: null,
        };
        if (!options.forAdmin || !query.includeInactive) {
            where.isActive = true;
        }
        const categorySlug = query.category?.trim().toLowerCase();
        if (categorySlug) {
            const normalized = CATEGORY_SLUG_MAP[categorySlug] ?? categorySlug.toLowerCase();
            where.category = {
                slug: normalized,
            };
        }
        const searchTerm = query.search?.trim();
        if (searchTerm) {
            where.OR = [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            const priceFilter = {};
            if (query.minPrice !== undefined) {
                priceFilter.gte = query.minPrice;
            }
            if (query.maxPrice !== undefined) {
                priceFilter.lte = query.maxPrice;
            }
            where.priceCents = priceFilter;
        }
        if (query.featured !== undefined) {
            where.isFeatured = query.featured;
        }
        return where;
    }
    buildSort(query) {
        const isFeaturedFirst = typeof query.featured === 'undefined'
            ? [{ isFeatured: 'desc' }]
            : [];
        const sort = query.sort === 'price_asc'
            ? [{ priceCents: 'asc' }]
            : query.sort === 'price_desc'
                ? [{ priceCents: 'desc' }]
                : [{ createdAt: 'desc' }];
        return [...isFeaturedFirst, ...sort];
    }
    mapProduct(product) {
        return {
            ...product,
            pricing: (0, product_pricing_util_1.computeProductPricing)(product),
        };
    }
    assertPromoWindow(start, end) {
        if (start && end && start > end) {
            throw new common_1.BadRequestException('Promo start date must be before end date');
        }
    }
    normalizeCurrency(currency) {
        return (currency ?? 'TRY').toUpperCase();
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        product_media_service_1.ProductMediaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map