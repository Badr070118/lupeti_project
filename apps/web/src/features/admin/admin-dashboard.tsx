'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/admin.service';
import { formatPrice } from '@/lib/utils';
import type { AdminOverview } from '@/types';
import { Card } from '@/components/ui/card';

export function AdminDashboard() {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const t = useTranslations('admin.dashboard');
  const [data, setData] = useState<AdminOverview | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    adminService
      .getOverview(accessToken)
      .then(setData)
      .catch((error) =>
        showToast({
          title: t('error'),
          description: error instanceof Error ? error.message : t('genericError'),
          variant: 'error',
        }),
      );
  }, [accessToken, showToast, t]);

  if (!data) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-500">
        {t('loading')}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label={t('products')}
        value={data.products.total.toLocaleString()}
        subtitle={t('stock', { value: data.products.stock.toLocaleString() })}
      />
      <StatCard
        label={t('users')}
        value={data.users.total.toLocaleString()}
        subtitle={t('active', { value: data.users.active.toLocaleString() })}
      />
      <StatCard
        label={t('orders')}
        value={data.orders.total.toLocaleString()}
        subtitle={formatPrice(data.orders.revenueCents)}
      />
      <StatCard
        label={t('tickets')}
        value={data.tickets.total.toLocaleString()}
        subtitle={t('open', { value: data.tickets.open.toLocaleString() })}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle: string;
}) {
  return (
    <Card className="border-slate-100 bg-slate-50">
      <div className="space-y-1 p-5">
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </Card>
  );
}
