import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildMetadata, pickLocalizedCopy } from '@/lib/metadata';

type FailPageProps = {
  params: { locale: string };
};

const metaCopy = {
  en: {
    title: 'Payment failed | Lupeti',
    description: 'Something went wrong with your PayTR payment attempt.',
  },
  fr: {
    title: 'Paiement échoué | Lupeti',
    description: 'Un incident est survenu lors de votre paiement PayTR.',
  },
  tr: {
    title: 'Ödeme başarısız | Lupeti',
    description: 'PayTR üzerinden ödeme sırasında bir sorun oluştu.',
  },
};

export async function generateMetadata({
  params,
}: FailPageProps): Promise<Metadata> {
  const copy = pickLocalizedCopy(params.locale, metaCopy);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${params.locale}/fail`,
  });
}

export default async function FailPage() {
  const t = await getTranslations('status');

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
      <h1 className="text-3xl font-bold text-rose-600">{t('fail')}</h1>
      <p className="text-sm text-slate-600">
        The payment could not be completed. Please return to the checkout page and
        try again with a different card or method.
      </p>
    </div>
  );
}
