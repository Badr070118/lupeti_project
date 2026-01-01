import { DiscountType } from '@prisma/client';
import { CreateProductImageDto } from './create-product-image.dto';
export declare class CreateProductDto {
    title: string;
    description: string;
    priceCents: number;
    currency?: string;
    stock: number;
    isActive?: boolean;
    categoryId: string;
    isFeatured?: boolean;
    slug?: string;
    sku?: string;
    originalPriceCents?: number;
    discountType?: DiscountType;
    discountValue?: number;
    promoStartAt?: Date;
    promoEndAt?: Date;
    images?: CreateProductImageDto[];
}
