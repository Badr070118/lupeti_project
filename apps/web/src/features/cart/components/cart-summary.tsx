'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Cart } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { CartItemRow } from './cart-item-row';
import { settingsService } from '@/services/settings.service';

interface CartSummaryProps {
  cart: Cart | null;
  accessToken: string | null;
  onRefresh: () => void;
  onUpdateItem: (productId: string, quantity: number) => Promise<void>;
  onRemoveItem: (productId: string) => Promise<void>;
  onClearCart?: () => Promise<void>;
  showCheckoutCta?: boolean;
  loading?: boolean;
}

export function CartSummary({
  cart,
  accessToken,
  onRefresh,
  onUpdateItem,
  onRemoveItem,
  onClearCart,
  loading = false,
  showCheckoutCta = false,
}: CartSummaryProps) {
  const t = useTranslations('cart');
  const [shippingCents, setShippingCents] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    settingsService
      .getPublic()
      .then((settings) => {
        if (!active) return;
        setShippingCents(settings.store.shippingStandardCents);
      })
      .catch(() => {
        if (active) setShippingCents(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const totals = useMemo(() => {
    if (!cart) {
      return { subtotal: 0, total: 0 };
    }
    const subtotal = cart.items.reduce((sum, item) => {
      const unit = item.product.pricing?.finalPriceCents ?? item.product.priceCents;
      return sum + unit * item.quantity;
    }, 0);
    return {
      subtotal,
      total: subtotal + (shippingCents ?? 0),
    };
  }, [cart, shippingCents]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">{t('loading')}</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">{t('empty')}</p>
        <Button className="mt-4" onClick={onRefresh}>
          {t('refresh')}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-4">
        {cart.items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            onUpdateQuantity={(quantity) => onUpdateItem(item.productId, quantity)}
            onRemove={() => onRemoveItem(item.productId)}
          />
        ))}
      </div>
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-lg font-semibold text-slate-900">{t('summary')}</p>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>{t('subtotal')}</span>
            <span>{formatPrice(totals.subtotal, cart.items[0].product.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('shipping')}</span>
            <span>
              {shippingCents === null
                ? t('shippingNote')
                : shippingCents === 0
                  ? t('freeShipping')
                  : formatPrice(shippingCents, cart.items[0].product.currency)}
            </span>
          </div>
          <div className="flex justify-between font-semibold text-slate-900">
            <span>{t('total')}</span>
            <span>{formatPrice(totals.total, cart.items[0].product.currency)}</span>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {showCheckoutCta ? (
            <Button className="w-full" asChild>
              <Link href="/checkout">{t('checkout')}</Link>
            </Button>
          ) : (
            <Button className="w-full" onClick={onRefresh}>
              {t('refresh')}
            </Button>
          )}
          {onClearCart ? (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                if (
                  !window.confirm(
                    t('confirmClear', { default: 'Clear all items from your cart?' }),
                  )
                ) {
                  return;
                }
                void onClearCart();
              }}
            >
              {t('clearCart', { default: 'Clear cart' })}
            </Button>
          ) : null}
          <p className="text-xs text-slate-400">{t('note')}</p>
          {!accessToken ? (
            <p className="text-xs text-slate-400">{t('guestNote')}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
