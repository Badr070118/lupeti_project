import { DiscountType, Product } from '@prisma/client';

type PricedProduct = Pick<
  Product,
  | 'priceCents'
  | 'originalPriceCents'
  | 'discountType'
  | 'discountValue'
  | 'promoStartAt'
  | 'promoEndAt'
>;

const DISCOUNT_MAP: Record<
  DiscountType,
  (price: number, value: number) => number
> = {
  [DiscountType.PERCENT]: (price, value) => {
    const clamped = Math.min(Math.max(value, 0), 95);
    const discount = Math.round((price * clamped) / 100);
    return price - discount;
  },
  [DiscountType.AMOUNT]: (price, value) => price - value,
};

export function isPromotionDateActive(
  product: PricedProduct,
  now: Date = new Date(),
) {
  if (product.promoStartAt && product.promoStartAt > now) {
    return false;
  }
  if (product.promoEndAt && product.promoEndAt < now) {
    return false;
  }
  return true;
}

export function computeProductPricing(product: PricedProduct) {
  const basePrice = product.originalPriceCents ?? product.priceCents;
  let originalPrice = basePrice;
  let finalPrice = product.priceCents ?? basePrice;
  let isPromoActive = false;
  let appliedDiscountType: DiscountType | null = null;
  let appliedDiscountValue: number | null = null;

  const hasDiscountValue =
    Boolean(product.discountType) && typeof product.discountValue === 'number';

  if (hasDiscountValue && isPromotionDateActive(product)) {
    const calculator = DISCOUNT_MAP[product.discountType as DiscountType];
    const computed = calculator(
      basePrice,
      Math.max(product.discountValue ?? 0, 0),
    );
    finalPrice = Math.max(0, computed);
    originalPrice = basePrice;
    isPromoActive = finalPrice < originalPrice;
    appliedDiscountType = product.discountType ?? null;
    appliedDiscountValue = product.discountValue ?? null;
  } else if (
    typeof product.originalPriceCents === 'number' &&
    product.priceCents < (product.originalPriceCents ?? product.priceCents)
  ) {
    originalPrice = product.originalPriceCents;
    finalPrice = product.priceCents;
    isPromoActive = true;
  } else {
    originalPrice = basePrice;
    finalPrice = basePrice;
  }

  return {
    originalPriceCents: originalPrice,
    finalPriceCents: finalPrice,
    isPromoActive,
    discountType: appliedDiscountType,
    discountValue: appliedDiscountValue,
    savingsCents: isPromoActive ? originalPrice - finalPrice : 0,
  };
}
