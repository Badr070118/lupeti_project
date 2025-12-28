import type { Metadata } from 'next';
import { buildMetadata, pickLocalizedCopy } from '@/lib/metadata';
import { CheckoutContent } from './checkout-content';

type CheckoutPageProps = {
  params: { locale: string };
};

const metaCopy = {
  en: {
    title: 'Secure checkout | Lupeti',
    description: 'Finalize your mindful order with PayTR-secured checkout.',
  },
  fr: {
    title: 'Paiement sécurisé | Lupeti',
    description:
      'Validez votre commande Lupeti via un paiement sécurisé PayTR.',
  },
  tr: {
    title: 'Güvenli ödeme | Lupeti',
    description:
      'PayTR güvenceli ödeme alanında Lupeti siparişinizi tamamlayın.',
  },
};

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const copy = pickLocalizedCopy(params.locale, metaCopy);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${params.locale}/checkout`,
  });
}

export default function CheckoutPage() {
  return <CheckoutContent />;
}
