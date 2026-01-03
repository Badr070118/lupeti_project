import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { computeProductPricing } from '../products/product-pricing.util';

const wishlistInclude = {
  product: {
    include: {
      category: true,
      images: {
        orderBy: [{ sortOrder: 'asc' as const }, { createdAt: 'asc' as const }],
      },
    },
  },
};

type WishlistItemWithProduct = Prisma.WishlistItemGetPayload<{
  include: typeof wishlistInclude;
}>;

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: wishlistInclude,
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => this.mapItem(item));
  }

  async add(userId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, isActive: true, deletedAt: null },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
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

  async remove(userId: string, productId: string) {
    const deleted = await this.prisma.wishlistItem.deleteMany({
      where: { userId, productId },
    });
    if (deleted.count === 0) {
      throw new NotFoundException('Wishlist item not found');
    }
    return { success: true };
  }

  private mapItem(item: WishlistItemWithProduct) {
    return {
      ...item,
      product: {
        ...item.product,
        pricing: computeProductPricing(item.product),
      },
    };
  }
}
