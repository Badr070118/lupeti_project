'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/use-auth';
import { useWishlist } from '@/hooks/use-wishlist';
import { formatPrice } from '@/lib/utils';
import { resolveProductImage } from '@/lib/product-images';
import { Button } from '@/components/ui/button';
import { AddToCartButton } from '@/features/cart/components/add-to-cart-button';

export function WishlistContent() {
  const { accessToken } = useAuth();
  const { items, loading, removeItem } = useWishlist(accessToken);
  const t = useTranslations('wishlist');

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        {t('loading')}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
        {t('empty')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const product = item.product;
        const cover = resolveProductImage(product.slug, product.images?.[0]?.url);
        const price =
          product.pricing?.finalPriceCents ?? product.priceCents;
        return (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm md:flex-row md:items-center"
          >
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-slate-100">
              {cover ? (
                <Image
                  src={cover}
                  alt={product.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {product.category.name}
              </p>
              <p className="text-lg font-semibold text-slate-900">{product.title}</p>
              <p className="text-sm text-slate-500">{product.description}</p>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <p className="text-lg font-semibold text-slate-900">
                {formatPrice(price, product.currency)}
              </p>
              <div className="flex flex-wrap gap-2">
                <AddToCartButton productId={product.id} disabled={product.stock <= 0} />
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (!window.confirm(t('confirmRemove'))) return;
                    void removeItem(product.id);
                  }}
                >
                  {t('remove')}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
