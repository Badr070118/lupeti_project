import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';

type CheckoutSuccessProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: CheckoutSuccessProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Order placed | Lupeti',
    description: 'Your order was created successfully.',
    path: `/${locale}/checkout/success`,
  });
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessProps) {
  const t = await getTranslations('checkout');
  const resolved = await searchParams;
  const raw = resolved?.orderId;
  const orderId = Array.isArray(raw) ? raw[0] : raw;

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
      <h1 className="text-3xl font-bold text-emerald-600">{t('successTitle')}</h1>
      <p className="text-sm text-slate-600">{t('successBody')}</p>
      {orderId ? (
        <p className="text-sm font-semibold text-slate-900">
          {t('successOrder', { orderId })}
        </p>
      ) : null}
    </div>
  );
}
