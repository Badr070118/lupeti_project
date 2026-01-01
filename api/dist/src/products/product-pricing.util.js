"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromotionDateActive = isPromotionDateActive;
exports.computeProductPricing = computeProductPricing;
const client_1 = require("@prisma/client");
const DISCOUNT_MAP = {
    [client_1.DiscountType.PERCENT]: (price, value) => {
        const clamped = Math.min(Math.max(value, 0), 95);
        const discount = Math.round((price * clamped) / 100);
        return price - discount;
    },
    [client_1.DiscountType.AMOUNT]: (price, value) => price - value,
};
function isPromotionDateActive(product, now = new Date()) {
    if (product.promoStartAt && product.promoStartAt > now) {
        return false;
    }
    if (product.promoEndAt && product.promoEndAt < now) {
        return false;
    }
    return true;
}
function computeProductPricing(product) {
    const basePrice = product.originalPriceCents ?? product.priceCents;
    let originalPrice = basePrice;
    let finalPrice = product.priceCents ?? basePrice;
    let isPromoActive = false;
    let appliedDiscountType = null;
    let appliedDiscountValue = null;
    const hasDiscountValue = Boolean(product.discountType) && typeof product.discountValue === 'number';
    if (hasDiscountValue && isPromotionDateActive(product)) {
        const calculator = DISCOUNT_MAP[product.discountType];
        const computed = calculator(basePrice, Math.max(product.discountValue ?? 0, 0));
        finalPrice = Math.max(0, computed);
        originalPrice = basePrice;
        isPromoActive = finalPrice < originalPrice;
        appliedDiscountType = product.discountType ?? null;
        appliedDiscountValue = product.discountValue ?? null;
    }
    else if (typeof product.originalPriceCents === 'number' &&
        product.priceCents < (product.originalPriceCents ?? product.priceCents)) {
        originalPrice = product.originalPriceCents;
        finalPrice = product.priceCents;
        isPromoActive = true;
    }
    else {
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
//# sourceMappingURL=product-pricing.util.js.map