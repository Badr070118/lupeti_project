'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useOrders } from '@/hooks/use-orders';
import { OrderList } from '@/features/orders/order-list';
import { Link } from '@/i18n/routing';

export function AccountDashboard() {
  const { user, accessToken, loading } = useAuth();
  const { orders, loading: ordersLoading, refresh } = useOrders(accessToken);
  const t = useTranslations('account');

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        {t('loading')}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">{t('loginPrompt')}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button asChild>
            <Link href="/login">{t('login')}</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/register">{t('register')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-wide text-slate-400">{t('title')}</p>
        <h1 className="text-3xl font-bold text-slate-900">
          {t('greeting', { email: user.email })}
        </h1>
        <p className="text-sm text-slate-500">{t('subtitle')}</p>
        <Button variant="ghost" className="mt-4" onClick={refresh}>
          {t('refresh')}
        </Button>
      </div>
      {ordersLoading ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
          {t('loadingOrders')}
        </div>
      ) : (
        <OrderList orders={orders} />
      )}
    </div>
  );
}
