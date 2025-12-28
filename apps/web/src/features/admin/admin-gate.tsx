'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Link } from '@/i18n/routing';

const METRICS = [
  { key: 'revenue', value: '₺84,500', change: '+12%' },
  { key: 'orders', value: '1,240', change: '+6%' },
  { key: 'customers', value: '980', change: '+4%' },
];

export function AdminGate() {
  const { user } = useAuth();
  const t = useTranslations('admin');

  if (!user) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">{t('loginPrompt')}</p>
        <Button asChild className="mt-4">
          <Link href="/login">{t('loginCta')}</Link>
        </Button>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-rose-500">{t('denied')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-400">{t('title')}</p>
        <h1 className="text-3xl font-bold text-slate-900">{t('headline')}</h1>
        <p className="text-sm text-slate-500">{t('description')}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {METRICS.map((card) => (
          <div
            key={card.key}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <p className="text-sm text-slate-500">{t(`metrics.${card.key}`)}</p>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="text-xs text-emerald-500">
              {card.change} · {t('vsLastWeek')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
