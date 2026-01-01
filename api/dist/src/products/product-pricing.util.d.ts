import { Product } from '@prisma/client';
type PricedProduct = Pick<Product, 'priceCents' | 'originalPriceCents' | 'discountType' | 'discountValue' | 'promoStartAt' | 'promoEndAt'>;
export declare function isPromotionDateActive(product: PricedProduct, now?: Date): boolean;
export declare function computeProductPricing(product: PricedProduct): {
    originalPriceCents: number;
    finalPriceCents: number;
    isPromoActive: boolean;
    discountType: import(".prisma/client").$Enums.DiscountType | null;
    discountValue: number | null;
    savingsCents: number;
};
export {};
