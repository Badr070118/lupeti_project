import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { AddToCartButton } from '@/features/cart/components/add-to-cart-button';
import { Link } from '@/i18n/routing';
import { resolveProductImage } from '@/lib/product-images';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('shop');
  const cover = resolveProductImage(
    product.slug,
    product.images?.[0]?.url,
  );
  const pricing =
    product.pricing ?? {
      originalPriceCents: product.priceCents,
      finalPriceCents: product.priceCents,
      discountType: null,
      discountValue: null,
      savingsCents: 0,
      isPromoActive: false,
    };
  let categoryLabel = product.category.name;
  try {
    categoryLabel = t(`categoryLabel.${product.category.slug}`);
  } catch {
    categoryLabel = product.category.name;
  }
  const discountBadge =
    pricing.isPromoActive && pricing.savingsCents > 0
      ? pricing.discountType === 'PERCENT' && pricing.discountValue
        ? `-${pricing.discountValue}%`
        : `-${formatPrice(pricing.savingsCents, product.currency)}`
      : null;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="product-card">
      <Link
        href={{ pathname: '/product/[slug]', params: { slug: product.slug } }}
        className="product-card__media"
      >
        {cover ? (
          <Image
            src={cover}
            alt={product.title}
            fill
            sizes="(max-width:768px) 100vw, 30vw"
            className="object-contain p-6"
            priority={product.isActive}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            {product.title}
          </div>
        )}
        {discountBadge && (
          <span className="absolute left-4 top-4 rounded-full bg-rose-500/90 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            {discountBadge}
          </span>
        )}
      </Link>
      <div className="product-card__body">
        <div className="product-card__meta">
          <span className="category-pill">
            {categoryLabel}
          </span>
          <span className="text-[0.75rem] uppercase tracking-[0.2em] text-[color:var(--muted)]">
            {product.stock > 0 ? t('stock') : t('soldOut')}
          </span>
        </div>
        <Link
          href={{ pathname: '/product/[slug]', params: { slug: product.slug } }}
          className="product-card__title"
        >
          {product.title}
        </Link>
        <p className="product-card__description line-clamp-2">{product.description}</p>
        <div className="product-card__footer">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              {t('priceLabel')}
            </p>
            <div className="text-xl font-semibold text-[color:var(--text)]">
              {formatPrice(pricing.finalPriceCents, product.currency)}
              {pricing.isPromoActive && (
                <span className="ml-2 text-sm font-normal text-[color:var(--muted)] line-through">
                  {formatPrice(pricing.originalPriceCents, product.currency)}
                </span>
              )}
            </div>
          </div>
          <AddToCartButton
            productId={product.id}
            disabled={isOutOfStock}
            disabledLabel={t('soldOut')}
          />
        </div>
      </div>
    </div>
  );
}
