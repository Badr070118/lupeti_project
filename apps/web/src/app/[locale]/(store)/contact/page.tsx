import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildMetadata, pickLocalizedCopy } from '@/lib/metadata';
import { SupportForm } from '@/features/support/support-form';

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

const metaCopy = {
  en: {
    title: 'Contact Lupeti',
    description: 'Reach Lupeti support for orders, deliveries, payments, or product advice.',
  },
  fr: {
    title: 'Contacter Lupeti',
    description: 'Contactez Lupeti pour les commandes, livraisons et conseils.',
  },
  tr: {
    title: 'Lupeti iletisim',
    description: 'Siparis, teslimat ve urun sorulari icin Lupeti ile iletisim kurun.',
  },
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = pickLocalizedCopy(locale, metaCopy);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${locale}/contact`,
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm uppercase tracking-wide text-slate-400">{t('eyebrow')}</p>
        <h1 className="text-3xl font-semibold text-slate-900">{t('title')}</h1>
        <p className="text-sm text-slate-500">{t('subtitle')}</p>
      </div>
      <SupportForm defaultCategory="OTHER" hideCategory />
    </div>
  );
}
