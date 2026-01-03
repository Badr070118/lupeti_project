'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { AddToCartButton } from '@/features/cart/components/add-to-cart-button';
import { Badge } from '@/components/ui/badge';
import { ProductGallery } from './product-gallery';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { WishlistButton } from '@/features/wishlist/wishlist-button';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const t = useTranslations('product');
  const { showToast } = useToast();
  const pricing =
    product.pricing ?? {
      originalPriceCents: product.priceCents,
      finalPriceCents: product.priceCents,
      discountType: null,
      discountValue: null,
      savingsCents: 0,
      isPromoActive: false,
    };
  const isOutOfStock = product.stock <= 0;
  const maxQty = Math.min(Math.max(product.stock, 0), 20);
  const [quantity, setQuantity] = useState(1);

  const stockLabel = useMemo(() => {
    if (product.stock <= 0) return t('stockStatus.out');
    if (product.stock <= 5) return t('stockStatus.low');
    return t('stockStatus.in');
  }, [product.stock, t]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <ProductGallery product={product} />
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-slate-900 text-white">{product.category.name}</Badge>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isOutOfStock
                ? 'bg-rose-100 text-rose-600'
                : product.stock <= 5
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {stockLabel}
          </span>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">{t('details')}</p>
          <h1 className="mt-2 text-4xl font-black text-slate-900">{product.title}</h1>
        </div>
        <p className="text-lg text-slate-600">{product.description}</p>
        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-slate-400">
            {t('specs.title')}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
            <div>
              <dt className="text-xs uppercase text-slate-400">{t('specs.currency')}</dt>
              <dd className="font-semibold">{product.currency}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">{t('specs.stock')}</dt>
              <dd className="font-semibold">{product.stock}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">{t('specs.slug')}</dt>
              <dd className="font-semibold">{product.slug}</dd>
            </div>
          </dl>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-3xl font-bold text-slate-900">
              {formatPrice(pricing.finalPriceCents, product.currency)}
            </p>
            {pricing.isPromoActive && (
              <p className="text-sm text-slate-400 line-through">
                {formatPrice(pricing.originalPriceCents, product.currency)}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm text-slate-500">
            {t('quantity')}
            <select
              className="ml-2 rounded-xl border border-slate-200 px-2 py-1 text-sm"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              disabled={isOutOfStock}
            >
              {Array.from({ length: Math.max(1, maxQty) }).map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </label>
          <AddToCartButton
            productId={product.id}
            quantity={quantity}
            className="px-6 py-3"
            disabled={isOutOfStock}
            disabledLabel={t('outOfStock')}
          />
          <WishlistButton productId={product.id} />
          <Button
            variant="ghost"
            onClick={() => {
              const url = window.location.href;
              if (navigator.share) {
                navigator.share({ title: product.title, url }).catch(() => {});
                return;
              }
              navigator.clipboard
                .writeText(url)
                .then(() =>
                  showToast({
                    title: t('shareSuccess', { default: 'Link copied to clipboard' }),
                    variant: 'success',
                  }),
                )
                .catch(() =>
                  showToast({
                    title: t('shareError', { default: 'Unable to copy link' }),
                    variant: 'error',
                  }),
                );
            }}
          >
            {t('share', { default: 'Share' })}
          </Button>
        </div>
      </div>
    </div>
  );
}
