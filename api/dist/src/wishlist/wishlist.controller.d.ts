import type { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    list(req: Request & {
        user?: JwtPayload;
    }): Promise<{
        product: {
            pricing: {
                originalPriceCents: number;
                finalPriceCents: number;
                isPromoActive: boolean;
                discountType: import(".prisma/client").$Enums.DiscountType | null;
                discountValue: number | null;
                savingsCents: number;
            };
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
            };
            images: {
                id: string;
                createdAt: Date;
                url: string;
                altText: string | null;
                sortOrder: number;
                productId: string;
            }[];
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            discountType: import(".prisma/client").$Enums.DiscountType | null;
            originalPriceCents: number | null;
            isFeatured: boolean;
            promoStartAt: Date | null;
            currency: string;
            sku: string | null;
            title: string;
            description: string;
            priceCents: number;
            discountValue: number | null;
            promoEndAt: Date | null;
            stock: number;
            isActive: boolean;
            categoryId: string;
        };
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
    }[]>;
    add(req: Request & {
        user?: JwtPayload;
    }, dto: AddWishlistItemDto): Promise<{
        product: {
            pricing: {
                originalPriceCents: number;
                finalPriceCents: number;
                isPromoActive: boolean;
                discountType: import(".prisma/client").$Enums.DiscountType | null;
                discountValue: number | null;
                savingsCents: number;
            };
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
            };
            images: {
                id: string;
                createdAt: Date;
                url: string;
                altText: string | null;
                sortOrder: number;
                productId: string;
            }[];
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            discountType: import(".prisma/client").$Enums.DiscountType | null;
            originalPriceCents: number | null;
            isFeatured: boolean;
            promoStartAt: Date | null;
            currency: string;
            sku: string | null;
            title: string;
            description: string;
            priceCents: number;
            discountValue: number | null;
            promoEndAt: Date | null;
            stock: number;
            isActive: boolean;
            categoryId: string;
        };
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
    }>;
    remove(req: Request & {
        user?: JwtPayload;
    }, productId: string): Promise<{
        success: boolean;
    }>;
}
