import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Terms of service | Lupeti',
    description: 'Review Lupeti terms for purchases and site usage.',
    path: `/${locale}/terms`,
  });
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'policies.terms' });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-400">{t('eyebrow')}</p>
        <h1 className="text-3xl font-semibold text-slate-900">{t('title')}</h1>
      </div>
      <div className="space-y-4 text-sm text-slate-600">
        <p>{t('intro')}</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>{t('points.orders')}</li>
          <li>{t('points.shipping')}</li>
          <li>{t('points.usage')}</li>
        </ul>
        <p>{t('footer')}</p>
      </div>
    </div>
  );
}
