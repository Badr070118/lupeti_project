'use client';

import { useTranslations } from 'next-intl';
import { CheckoutForm } from '@/features/checkout/checkout-form';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';

export function CheckoutContent() {
  const { accessToken } = useAuth();
  const { cart, loading, refresh } = useCart(accessToken);
  const t = useTranslations('checkout');

  const totals = cart
    ? cart.items.reduce((sum, item) => {
        const unit = item.product.pricing?.finalPriceCents ?? item.product.priceCents;
        return sum + unit * item.quantity;
      }, 0)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-400">
          {t('title')}
        </p>
        <h1 className="text-3xl font-bold text-slate-900">{t('headline')}</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <CheckoutForm
          cart={cart}
          accessToken={accessToken}
          onOrderCreated={refresh}
        />
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-lg font-semibold text-slate-900">{t('summary')}</p>
          {loading ? (
            <p className="mt-3 text-sm text-slate-500">{t('loading')}</p>
          ) : cart && cart.items.length > 0 ? (
            <>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-slate-600"
                  >
                    <span>
                      {item.product.title} × {item.quantity}
                    </span>
                    <span>
                      {formatPrice(
                        (item.product.pricing?.finalPriceCents ?? item.product.priceCents) *
                          item.quantity,
                        item.product.currency,
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-slate-100 pt-4">
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>{t('total')}</span>
                  <span>
                    {formatPrice(totals, cart.items[0].product.currency)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">{t('empty')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
