import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { OrderDetailContent } from './order-detail-content';

type OrderDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  return buildMetadata({
    title: `Order ${id} | Lupeti`,
    description: 'Order details and delivery status.',
    path: `/${locale}/orders/${id}`,
  });
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  return <OrderDetailContent id={id} />;
}
