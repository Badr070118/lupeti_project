import type { Metadata } from 'next';
import { buildMetadata, pickLocalizedCopy } from '@/lib/metadata';
import { OrdersContent } from './orders-content';

type OrdersPageProps = {
  params: Promise<{ locale: string }>;
};

const metaCopy = {
  en: {
    title: 'My orders | Lupeti',
    description: 'Track your Lupeti orders and deliveries.',
  },
  fr: {
    title: 'Mes commandes | Lupeti',
    description: 'Suivez vos commandes Lupeti.',
  },
  tr: {
    title: 'Siparislerim | Lupeti',
    description: 'Lupeti siparislerinizi takip edin.',
  },
};

export async function generateMetadata({
  params,
}: OrdersPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = pickLocalizedCopy(locale, metaCopy);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${locale}/orders`,
  });
}

export default function OrdersPage() {
  return <OrdersContent />;
}
