import { getTranslations } from 'next-intl/server';
import { SupportForm } from '@/features/support/support-form';

type SupportPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SupportPage({ params }: SupportPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'support' });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm uppercase tracking-wide text-slate-400">{t('eyebrow')}</p>
        <h1 className="text-3xl font-semibold text-slate-900">{t('title')}</h1>
        <p className="text-sm text-slate-500">{t('subtitle')}</p>
      </div>
      <SupportForm />
    </div>
  );
}
