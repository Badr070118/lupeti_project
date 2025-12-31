import type { Metadata } from 'next';
import { AdminGate } from '@/features/admin/admin-gate';
import { buildMetadata, pickLocalizedCopy } from '@/lib/metadata';

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

const metaCopy = {
  en: {
    title: 'Lupeti admin cockpit',
    description: 'Monitor orders, payments, and catalog insights.',
  },
  fr: {
    title: 'Cockpit admin Lupeti',
    description: 'Surveillez commandes, paiements et catalogue.',
  },
  tr: {
    title: 'Lupeti yönetim paneli',
    description: 'Siparişleri, ödemeleri ve kataloğu takip edin.',
  },
};

export async function generateMetadata({
  params,
}: AdminPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = pickLocalizedCopy(locale, metaCopy);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${locale}/admin`,
  });
}

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <AdminGate />
    </div>
  );
}
