import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { computeProductPricing } from '../products/product-pricing.util';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

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
              { sortOrder: 'asc' as const },
              { createdAt: 'asc' as const },
            ],
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
};

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const cart = await this.ensureCart(userId);
    const result = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: cartInclude,
    });
    return this.mapCartProductImages(result);
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.ensureCart(userId);
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product is not available');
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
    } else {
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

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    this.assertQuantity(dto.quantity);
    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product || !product.isActive) {
      throw new ConflictException('Product is not available');
    }

    this.assertStock(product.stock, dto.quantity);

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });

    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cart: { userId } },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
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

  private assertQuantity(quantity: number) {
    if (quantity < 1 || quantity > 20) {
      throw new BadRequestException('Quantity must be between 1 and 20');
    }
  }

  private assertStock(stock: number, quantity: number) {
    if (stock < quantity) {
      throw new ConflictException('Insufficient stock for this product');
    }
  }

  private ensureCart(userId: string) {
    return this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  private mapCartProductImages(cart: any) {
    if (!cart) {
      return cart;
    }
    return {
      ...cart,
      items: cart.items.map((item) => {
        const { images: imageRecords, ...product } = item.product;
        const [image] = imageRecords ?? [];
        const pricing = computeProductPricing(product);
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
}
