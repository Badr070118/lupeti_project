'use client';

import { useTranslations } from 'next-intl';
import { CartSummary } from '@/features/cart/components/cart-summary';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';

export function CartContent() {
  const { accessToken } = useAuth();
  const { cart, loading, refresh, updateItem, removeItem, clearCart } = useCart(accessToken);
  const t = useTranslations('cart');

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-400">
          {t('title')}
        </p>
        <h1 className="text-3xl font-bold text-slate-900">{t('headline')}</h1>
      </div>
      <CartSummary
        cart={cart}
        accessToken={accessToken}
        onRefresh={refresh}
        onUpdateItem={updateItem}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
        loading={loading}
        showCheckoutCta
      />
    </div>
  );
}
