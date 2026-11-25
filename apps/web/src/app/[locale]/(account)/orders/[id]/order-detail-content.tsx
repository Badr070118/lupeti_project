'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/use-auth';
import { orderService } from '@/services/order.service';
import { paymentService } from '@/services/payment.service';
import { formatPrice } from '@/lib/utils';
import { orderItemTitle } from '@/lib/product-copy';
import { OrderStatusBadge } from '@/features/orders/order-status-badge';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import type { Order } from '@/types';

interface OrderDetailContentProps {
  id: string;
}

export function OrderDetailContent({ id }: OrderDetailContentProps) {
  const locale = useLocale();
  const { user, accessToken, loading } = useAuth();
  const t = useTranslations('orders');
  const checkoutText = useTranslations('checkout');
  const [result, setResult] = useState<{ id: string; order: Order | null } | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const order = result?.id === id ? result.order : null;
  const loadingOrder = !!accessToken && result?.id !== id;

  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    orderService
      .getMine(accessToken, id)
      .then((data) => { if (active) setResult({ id, order: data }); })
      .catch(() => { if (active) setResult({ id, order: null }); });
    return () => { active = false; };
  }, [accessToken, id]);

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

  if (loadingOrder) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        {t('loadingOrders')}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        {t('notFound')}
      </div>
    );
  }

  const shipping = order.shippingAddress as Record<string, string | undefined>;

  return (
    <div className="space-y-6">
      {order.status === 'PENDING_PAYMENT' && order.payment?.provider === 'PAYTR' ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <Button disabled={paymentLoading || Boolean(paymentUrl)} onClick={async () => {
            if (!accessToken) return;
            setPaymentError(null);
            setPaymentLoading(true);
            try {
              const payment = await paymentService.initiatePaytr(accessToken, order.id);
              setPaymentUrl(payment.iframeUrl);
            } catch (error) {
              setPaymentError(error instanceof Error ? error.message : checkoutText('failed'));
            } finally {
              setPaymentLoading(false);
            }
          }}>{checkoutText('submitPaytr')}</Button>
          {paymentError ? <p role="alert" className="mt-3 text-sm text-rose-600">{paymentError}</p> : null}
          {paymentUrl ? <iframe title="PayTR ile güvenli ödeme" src={paymentUrl} className="mt-4 h-[680px] w-full border border-slate-200 bg-white" allow="payment" /> : null}
        </div>
      ) : null}
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{t('orderId')}</p>
            <p className="text-lg font-semibold text-slate-900">{order.id}</p>
          </div>
          <OrderStatusBadge status={order.status} />
          <div>
            <p className="text-sm text-slate-500">{t('placedOn')}</p>
            <p className="text-sm font-semibold text-slate-900">
              {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
                new Date(order.createdAt),
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-lg font-semibold text-slate-900">{t('items')}</p>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {orderItemTitle(item.titleSnapshot)} x {item.quantity}
              </span>
              <span>{formatPrice(item.lineTotalCents, order.currency, locale)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>{t('subtotal')}</span>
            <span>{formatPrice(order.subtotalCents, order.currency, locale)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('shipping')}</span>
            <span>{formatPrice(order.shippingCents, order.currency, locale)}</span>
          </div>
          <div className="flex justify-between font-semibold text-slate-900">
            <span>{t('total')}</span>
            <span>{formatPrice(order.totalCents, order.currency, locale)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-lg font-semibold text-slate-900">{t('shippingAddress')}</p>
        <div className="mt-3 space-y-1 text-sm text-slate-600">
          <p>{shipping.fullName}</p>
          {shipping.phone ? <p>{shipping.phone}</p> : null}
          <p>{shipping.line1}</p>
          {shipping.line2 ? <p>{shipping.line2}</p> : null}
          <p>
            {shipping.city}
            {shipping.state ? `, ${shipping.state}` : ''} {shipping.postalCode}
          </p>
          <p>{shipping.country}</p>
        </div>
      </div>
    </div>
  );
}
