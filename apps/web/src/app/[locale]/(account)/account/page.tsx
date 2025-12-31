import type { Metadata } from 'next';
import { AccountDashboard } from '@/features/account/account-dashboard';
import { buildMetadata, pickLocalizedCopy } from '@/lib/metadata';

type AccountPageProps = {
  params: Promise<{ locale: string }>;
};

const metaCopy = {
  en: {
    title: 'My Lupeti account',
    description: 'Manage saved carts, addresses, and order history.',
  },
  fr: {
    title: 'Mon compte Lupeti',
    description:
      'Gérez votre panier, vos adresses et l’historique de commandes.',
  },
  tr: {
    title: 'Lupeti hesabım',
    description: 'Sepetleri, adresleri ve sipariş geçmişini yönetin.',
  },
};

export async function generateMetadata({
  params,
}: AccountPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = pickLocalizedCopy(locale, metaCopy);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${locale}/account`,
  });
}

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <AccountDashboard />
    </div>
  );
}
