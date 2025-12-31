import type { Metadata } from 'next';
import { buildMetadata, pickLocalizedCopy } from '@/lib/metadata';
import { CartContent } from './cart-content';

type CartPageProps = {
  params: Promise<{ locale: string }>;
};

const metaCopy = {
  en: {
    title: 'Your basket | Lupeti',
    description: 'Review mindful selections before checking out with Lupeti.',
  },
  fr: {
    title: 'Votre panier | Lupeti',
    description:
      'Vérifiez vos sélections avant de confirmer votre commande Lupeti.',
  },
  tr: {
    title: 'Sepetiniz | Lupeti',
    description: 'Lupeti siparişinizi tamamlamadan önce ürünleri gözden geçirin.',
  },
};

export async function generateMetadata({
  params,
}: CartPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = pickLocalizedCopy(locale, metaCopy);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${locale}/cart`,
  });
}

export default function CartPage() {
  return <CartContent />;
}
