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
    title: 'Payment failed | Lupeti',
    description: 'Something went wrong with your PayTR payment attempt.',
    path: `/${locale}/checkout/fail`,
  });
}

export default async function CheckoutFailPage() {
  const t = await getTranslations('status');

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
      <h1 className="text-3xl font-bold text-rose-600">{t('fail')}</h1>
      <p className="text-sm text-slate-600">
        The payment could not be completed. Please return to the checkout page
        and try again with a different card or method.
      </p>
    </div>
  );
}
