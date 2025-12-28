import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types';

interface OrderListProps {
  orders: Order[];
}

export function OrderList({ orders }: OrderListProps) {
  const t = useTranslations('account');

  if (!orders.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
        {t('empty')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">{t('orderId')}</p>
              <p className="font-semibold text-slate-900">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('status')}</p>
              <p className="font-semibold capitalize text-rose-500">
                {order.status.replace('_', ' ').toLowerCase()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('placedOn')}</p>
              <p className="font-semibold text-slate-900">
                {new Intl.DateTimeFormat('en', {
                  dateStyle: 'medium',
                }).format(new Date(order.createdAt))}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('total')}</p>
              <p className="text-lg font-bold text-slate-900">
                {formatPrice(order.totalCents, order.currency)}
              </p>
            </div>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
            {t('itemsCount', { count: order.items.length })}
          </div>
        </div>
      ))}
    </div>
  );
}
