'use client';

import { useTranslations } from 'next-intl';
import type { OrderStatus } from '@/types';

const STATUS_MAP: Record<OrderStatus, { key: string; tone: string }> = {
  PENDING_PAYMENT: { key: 'pending', tone: 'bg-amber-100 text-amber-700' },
  PAID: { key: 'paid', tone: 'bg-emerald-100 text-emerald-700' },
  SHIPPED: { key: 'processing', tone: 'bg-slate-100 text-slate-700' },
  DELIVERED: { key: 'delivered', tone: 'bg-emerald-100 text-emerald-700' },
  CANCELLED: { key: 'cancelled', tone: 'bg-rose-100 text-rose-600' },
  FAILED: { key: 'failed', tone: 'bg-rose-100 text-rose-600' },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const t = useTranslations('orders');
  const mapped = STATUS_MAP[status];
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${mapped.tone}`}>
      {t(`status.${mapped.key}`)}
    </span>
  );
}
