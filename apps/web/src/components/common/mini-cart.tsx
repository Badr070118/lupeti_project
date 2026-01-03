'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { Link, usePathname } from '@/i18n/routing';
import { resolveProductImage } from '@/lib/product-images';

export function MiniCart() {
  const [open, setOpen] = useState(false);
  const { accessToken } = useAuth();
  const { cart, loading } = useCart(accessToken);
  const t = useTranslations('cart');
  const nav = useTranslations('nav');
  const pathname = usePathname();

  const quantity = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [pathname, open]);

  return (
    <div className="relative">
      <button
        type="button"
        className="relative inline-flex rounded-full bg-slate-900 p-2 text-white transition hover:bg-slate-800"
        aria-label={nav('cart')}
        onClick={() => setOpen((prev) => !prev)}
      >
        <ShoppingBag className="h-5 w-5" />
        {quantity > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] justify-center rounded-full bg-rose-500 px-1 text-xs font-semibold">
            {quantity}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">{t('summary')}</p>
            <button
              type="button"
              className="text-xs uppercase tracking-[0.2em] text-slate-400"
              onClick={() => setOpen(false)}
            >
              {t('close', { default: 'Close' })}
            </button>
          </div>
          {loading ? (
            <p className="mt-4 text-sm text-slate-500">{t('loading')}</p>
          ) : cart && cart.items.length > 0 ? (
            <>
              <div className="mt-4 space-y-3">
                {cart.items.slice(0, 3).map((item) => {
                  const cover = resolveProductImage(
                    item.product.slug,
                    item.product.imageUrl,
                  );
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-slate-100">
                        {cover ? (
                          <Image
                            src={cover}
                            alt={item.product.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-semibold text-slate-900 line-clamp-1">
                          {item.product.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {t('quantity')}: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatPrice(
                          (item.product.pricing?.finalPriceCents ?? item.product.priceCents) *
                            item.quantity,
                          item.product.currency,
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  href="/cart"
                  className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-center text-xs font-semibold text-slate-600"
                  onClick={() => setOpen(false)}
                >
                  {t('viewCart', { default: 'View cart' })}
                </Link>
                <Link
                  href="/checkout"
                  className="flex-1 rounded-full bg-slate-900 px-4 py-2 text-center text-xs font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  {t('checkout')}
                </Link>
              </div>
              {!accessToken && (
                <p className="mt-3 text-xs text-slate-400">
                  {t('guestNote', { default: 'Sign in to complete checkout.' })}
                </p>
              )}
            </>
          ) : (
            <p className="mt-4 text-sm text-slate-500">{t('empty')}</p>
          )}
        </div>
      )}
    </div>
  );
}
