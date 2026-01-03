import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { File as MulterFile } from 'multer';
import { ensureSlug, slugify } from '../common/utils/slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { computeProductPricing } from './product-pricing.util';
import { ProductMediaService } from './product-media.service';

const productInclude = {
  category: true,
  images: {
    orderBy: [{ sortOrder: 'asc' as const }, { createdAt: 'asc' as const }],
  },
};

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

const CATEGORY_SLUG_MAP: Record<string, string> = {
  chien: 'dog',
  dog: 'dog',
  chat: 'cat',
  cat: 'cat',
};

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: ProductMediaService,
  ) {}

  async listPublic(query: ProductQueryDto) {
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

  async listAdmin(query: ProductQueryDto) {
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

  async lookup(ids: string[]) {
    if (!ids.length) return [];
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: ids },
        isActive: true,
        deletedAt: null,
      },
      include: productInclude,
    });

    const mapped = products.map((item) => this.mapProduct(item));
    const lookup = new Map(mapped.map((item) => [item.id, item]));
    return ids.map((id) => lookup.get(id)).filter(Boolean);
  }

  async getPublic(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        slug,
        isActive: true,
        deletedAt: null,
      },
      include: productInclude,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.mapProduct(product);
  }

  async getById(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id },
      include: productInclude,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.mapProduct(product);
  }

  async create(dto: CreateProductDto) {
    this.assertPromoWindow(dto.promoStartAt, dto.promoEndAt);
    const slug = await this.generateProductSlug(
      ensureSlug(dto.slug ?? dto.title, dto.title),
    );
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
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    this.assertPromoWindow(dto.promoStartAt, dto.promoEndAt);

    const data: Prisma.ProductUpdateInput = {};
    if (dto.title) data.title = dto.title;
    if (dto.description) data.description = dto.description;
    if (dto.priceCents !== undefined) data.priceCents = dto.priceCents;
    if (dto.currency !== undefined) {
      data.currency = this.normalizeCurrency(dto.currency);
    }
    if (dto.stock !== undefined) data.stock = dto.stock;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.isFeatured !== undefined) data.isFeatured = dto.isFeatured;
    if (dto.sku !== undefined) data.sku = dto.sku || null;
    if (dto.discountType !== undefined)
      data.discountType = dto.discountType ?? null;
    if (dto.discountValue !== undefined)
      data.discountValue = dto.discountValue ?? null;
    if (dto.originalPriceCents !== undefined)
      data.originalPriceCents = dto.originalPriceCents ?? null;
    if (dto.promoStartAt !== undefined)
      data.promoStartAt = dto.promoStartAt ?? null;
    if (dto.promoEndAt !== undefined) data.promoEndAt = dto.promoEndAt ?? null;
    if (dto.categoryId) {
      data.category = {
        connect: { id: dto.categoryId },
      };
    }

    if (dto.slug) {
      data.slug = await this.generateProductSlug(
        ensureSlug(dto.slug, dto.slug),
        id,
      );
    }

    try {
      const product = await this.prisma.product.update({
        where: { id },
        data,
        include: productInclude,
      });
      return this.mapProduct(product);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.product.update({
        where: { id },
        data: {
          isActive: false,
          deletedAt: new Date(),
        },
      });
      return { success: true };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Product not found');
      }
      throw error;
    }
  }

  async addImage(productId: string, dto: CreateProductImageDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
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

  async removeImage(imageId: string) {
    try {
      await this.prisma.productImage.delete({
        where: { id: imageId },
      });
      return { success: true };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Product image not found');
      }
      throw error;
    }
  }

  async uploadProductImage(file: MulterFile) {
    return this.mediaService.saveProductImage(file);
  }

  private async generateProductSlug(desired: string, excludeId?: string) {
    let base = desired || 'product';
    base = slugify(base) || 'product';
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

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Product with same slug or SKU exists');
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      throw new NotFoundException('Related category not found');
    }
    throw error;
  }

  private resolvePagination(query: ProductQueryDto) {
    const page = query.page ?? 1;
    const limit = Math.min(Math.max(query.limit ?? 12, 1), 50);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
  }

  private buildWhere(
    query: ProductQueryDto,
    options: { forAdmin: boolean },
  ): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
    };
    if (!options.forAdmin || !query.includeInactive) {
      where.isActive = true;
    }

    const categorySlug = query.category?.trim().toLowerCase();
    if (categorySlug) {
      const normalized =
        CATEGORY_SLUG_MAP[categorySlug] ?? categorySlug.toLowerCase();
      where.category = {
        slug: normalized,
      };
    }

    const searchTerm = query.search?.trim();
    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { category: { name: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceFilter: Prisma.IntFilter = {};
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

    if (query.inStock) {
      where.stock = { gt: 0 };
    }

    if (query.onSale) {
      const now = new Date();
      const promoWindow = [
        { OR: [{ promoStartAt: null }, { promoStartAt: { lte: now } }] },
        { OR: [{ promoEndAt: null }, { promoEndAt: { gte: now } }] },
      ];

      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        {
          OR: [
            {
              discountType: { not: null },
              discountValue: { not: null },
              AND: promoWindow,
            },
            {
              originalPriceCents: { not: null },
            },
          ],
        },
      ];
    }

    return where;
  }

  private buildSort(
    query: ProductQueryDto,
  ): Prisma.ProductOrderByWithRelationInput[] {
    const isFeaturedFirst =
      typeof query.featured === 'undefined'
        ? [{ isFeatured: 'desc' as const }]
        : [];
    const sort =
      query.sort === 'price_asc'
        ? [{ priceCents: 'asc' as const }]
        : query.sort === 'price_desc'
          ? [{ priceCents: 'desc' as const }]
          : query.sort === 'best_sellers'
            ? [
                { orderItems: { _count: 'desc' as const } },
                { createdAt: 'desc' as const },
              ]
            : [{ createdAt: 'desc' as const }];
    return [...isFeaturedFirst, ...sort];
  }

  private mapProduct(product: ProductWithRelations) {
    return {
      ...product,
      pricing: computeProductPricing(product),
    };
  }

  private assertPromoWindow(
    start?: Date | null,
    end?: Date | null,
  ): void | never {
    if (start && end && start > end) {
      throw new BadRequestException('Promo start date must be before end date');
    }
  }

  private normalizeCurrency(currency?: string | null) {
    return (currency ?? 'TRY').toUpperCase();
  }
}
