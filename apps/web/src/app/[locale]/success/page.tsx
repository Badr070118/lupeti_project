import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildMetadata, pickLocalizedCopy } from '@/lib/metadata';

type SuccessPageProps = {
  params: Promise<{ locale: string }>;
};

const metaCopy = {
  en: {
    title: 'Payment successful | Lupeti',
    description: 'Your PayTR payment cleared successfully.',
  },
  fr: {
    title: 'Paiement réussi | Lupeti',
    description: 'Votre paiement PayTR a été validé.',
  },
  tr: {
    title: 'Ödeme başarılı | Lupeti',
    description: 'PayTR üzerinden ödemeniz onaylandı.',
  },
};

export async function generateMetadata({
  params,
}: SuccessPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = pickLocalizedCopy(locale, metaCopy);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${locale}/success`,
  });
}

export default async function SuccessPage() {
  const t = await getTranslations('status');

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
      <h1 className="text-3xl font-bold text-emerald-600">{t('success')}</h1>
      <p className="text-sm text-slate-600">
        PayTR ödeme sonucunu bildirir. Siparişinizin güncel durumunu hesabınızdan takip edebilirsiniz.
      </p>
    </div>
  );
}
