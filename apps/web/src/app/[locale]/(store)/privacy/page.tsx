import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Privacy policy | Lupeti',
    description: 'Learn how Lupeti protects your data and privacy.',
    path: `/${locale}/privacy`,
  });
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'policies.privacy' });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-400">{t('eyebrow')}</p>
        <h1 className="text-3xl font-semibold text-slate-900">{t('title')}</h1>
      </div>
      <div className="space-y-4 text-sm text-slate-600">
        <p>{t('intro')}</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>{t('points.data')}</li>
          <li>{t('points.security')}</li>
          <li>{t('points.rights')}</li>
        </ul>
        <p>{t('footer')}</p>
      </div>
    </div>
  );
}
