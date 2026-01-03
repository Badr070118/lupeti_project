import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';

type ShippingReturnsProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ShippingReturnsProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Shipping & Returns | Lupeti',
    description: 'Shipping options, delivery timelines, and return guidance.',
    path: `/${locale}/shipping-returns`,
  });
}

export default async function ShippingReturnsPage({ params }: ShippingReturnsProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'policies.shipping' });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-400">{t('eyebrow')}</p>
        <h1 className="text-3xl font-semibold text-slate-900">{t('title')}</h1>
      </div>
      <div className="space-y-4 text-sm text-slate-600">
        <p>{t('intro')}</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>{t('points.standard')}</li>
          <li>{t('points.express')}</li>
          <li>{t('points.returns')}</li>
        </ul>
        <p>{t('footer')}</p>
      </div>
    </div>
  );
}
