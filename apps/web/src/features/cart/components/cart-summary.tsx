'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { Cart } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { CartItemRow } from './cart-item-row';

interface CartSummaryProps {
  cart: Cart | null;
  accessToken: string | null;
  onCartUpdated: (cart: Cart) => void;
  onRefresh: () => void;
  showCheckoutCta?: boolean;
  loading?: boolean;
}

export function CartSummary({
  cart,
  accessToken,
  onCartUpdated,
  onRefresh,
  loading = false,
  showCheckoutCta = false,
}: CartSummaryProps) {
  const t = useTranslations('cart');

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
      total: subtotal,
    };
  }, [cart]);

  if (!accessToken) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">{t('loginPrompt')}</p>
      </div>
    );
  }

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
            accessToken={accessToken}
            onCartUpdated={onCartUpdated}
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
            <span>{t('shippingNote')}</span>
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
          <p className="text-xs text-slate-400">{t('note')}</p>
        </div>
      </div>
    </div>
  );
}
