import { DiscountType } from '@prisma/client';
export declare class UpdateProductDto {
    title?: string;
    description?: string;
    priceCents?: number;
    currency?: string;
    stock?: number;
    isActive?: boolean;
    categoryId?: string;
    slug?: string;
    sku?: string;
    isFeatured?: boolean;
    discountType?: DiscountType;
    discountValue?: number;
    originalPriceCents?: number;
    promoStartAt?: Date;
    promoEndAt?: Date;
}
