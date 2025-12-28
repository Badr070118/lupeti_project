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
const productInclude = {
    category: true,
    images: {
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    },
};
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listPublic(query) {
        const page = query.page ?? 1;
        const limit = Math.min(Math.max(query.limit ?? 12, 1), 50);
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
        };
        const categorySlug = query.category?.trim();
        if (categorySlug) {
            where.category = {
                slug: categorySlug,
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
        const orderBy = query.sort === 'price_asc'
            ? { priceCents: 'asc' }
            : query.sort === 'price_desc'
                ? { priceCents: 'desc' }
                : { createdAt: 'desc' };
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
            data: items,
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
            },
            include: productInclude,
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async create(dto) {
        const slug = await this.generateProductSlug((0, slugify_1.ensureSlug)(dto.slug ?? dto.title, dto.title));
        try {
            return await this.prisma.product.create({
                data: {
                    slug,
                    title: dto.title,
                    description: dto.description,
                    priceCents: dto.priceCents,
                    currency: (dto.currency ?? 'TRY').toUpperCase(),
                    stock: dto.stock,
                    isActive: dto.isActive ?? true,
                    category: {
                        connect: { id: dto.categoryId },
                    },
                },
                include: productInclude,
            });
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
        const data = {};
        if (dto.title)
            data.title = dto.title;
        if (dto.description)
            data.description = dto.description;
        if (dto.priceCents !== undefined)
            data.priceCents = dto.priceCents;
        if (dto.currency !== undefined) {
            data.currency = dto.currency.toUpperCase();
        }
        if (dto.stock !== undefined)
            data.stock = dto.stock;
        if (dto.isActive !== undefined)
            data.isActive = dto.isActive;
        if (dto.categoryId) {
            data.category = {
                connect: { id: dto.categoryId },
            };
        }
        if (dto.slug) {
            data.slug = await this.generateProductSlug((0, slugify_1.ensureSlug)(dto.slug, dto.slug), id);
        }
        try {
            return await this.prisma.product.update({
                where: { id },
                data,
                include: productInclude,
            });
        }
        catch (error) {
            this.handlePrismaError(error);
        }
    }
    async remove(id) {
        try {
            await this.prisma.product.delete({
                where: { id },
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
            throw new common_1.ConflictException('Product slug already exists');
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2003') {
            throw new common_1.NotFoundException('Related category not found');
        }
        throw error;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map