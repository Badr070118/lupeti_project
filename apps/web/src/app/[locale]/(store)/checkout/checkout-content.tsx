'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { CheckoutFlow } from '@/features/checkout/checkout-flow';

export function CheckoutContent() {
  const { accessToken } = useAuth();
  const { cart, loading, refresh } = useCart(accessToken);
  const t = useTranslations('checkout');

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-400">
          {t('title')}
        </p>
        <h1 className="text-3xl font-bold text-slate-900">{t('headline')}</h1>
      </div>
      {loading ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-slate-500">{t('loading')}</p>
        </div>
      ) : (
        <CheckoutFlow cart={cart} accessToken={accessToken} onOrderCreated={refresh} />
      )}
    </div>
  );
}
