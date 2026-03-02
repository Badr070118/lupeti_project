import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string): Promise<{
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
    add(userId: string, productId: string): Promise<{
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
    remove(userId: string, productId: string): Promise<{
        success: boolean;
    }>;
    private mapItem;
}
