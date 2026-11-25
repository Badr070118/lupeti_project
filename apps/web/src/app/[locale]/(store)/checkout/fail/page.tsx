import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';

type CheckoutFailProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: CheckoutFailProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Ödeme başarısız | Lupeti',
    description: 'PayTR ile ödeme sırasında bir sorun oluştu.',
    path: `/${locale}/checkout/fail`,
  });
}

export default async function CheckoutFailPage() {
  const t = await getTranslations('status');

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
      <h1 className="text-3xl font-bold text-rose-600">{t('fail')}</h1>
      <p className="text-sm text-slate-600">
        Ödeme tamamlanamadı. Ödeme sayfasına dönüp farklı bir kartla veya başka bir yöntemle tekrar deneyin.
      </p>
    </div>
  );
}
