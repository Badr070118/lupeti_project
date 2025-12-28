import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ensureSlug, slugify } from '../common/utils/slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const productInclude = {
  category: true,
  images: {
    orderBy: [{ sortOrder: 'asc' as const }, { createdAt: 'asc' as const }],
  },
};

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(query: ProductQueryDto) {
    const page = query.page ?? 1;
    const limit = Math.min(Math.max(query.limit ?? 12, 1), 50);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
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
      const priceFilter: Prisma.IntFilter = {};
      if (query.minPrice !== undefined) {
        priceFilter.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        priceFilter.lte = query.maxPrice;
      }
      where.priceCents = priceFilter;
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      query.sort === 'price_asc'
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

  async getPublic(slug: string): Promise<ProductWithRelations> {
    const product = await this.prisma.product.findFirst({
      where: {
        slug,
        isActive: true,
      },
      include: productInclude,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    const slug = await this.generateProductSlug(
      ensureSlug(dto.slug ?? dto.title, dto.title),
    );
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

    const data: Prisma.ProductUpdateInput = {};
    if (dto.title) data.title = dto.title;
    if (dto.description) data.description = dto.description;
    if (dto.priceCents !== undefined) data.priceCents = dto.priceCents;
    if (dto.currency !== undefined) {
      data.currency = dto.currency.toUpperCase();
    }
    if (dto.stock !== undefined) data.stock = dto.stock;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
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
      return await this.prisma.product.update({
        where: { id },
        data,
        include: productInclude,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.product.delete({
        where: { id },
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
      throw new ConflictException('Product slug already exists');
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      throw new NotFoundException('Related category not found');
    }
    throw error;
  }
}
