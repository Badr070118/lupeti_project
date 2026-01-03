import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildMetadata, pickLocalizedCopy } from '@/lib/metadata';
import { WishlistContent } from '@/features/wishlist/wishlist-content';

type WishlistPageProps = {
  params: Promise<{ locale: string }>;
};

const metaCopy = {
  en: {
    title: 'Wishlist | Lupeti',
    description: 'Save your favorite Lupeti essentials.',
  },
  fr: {
    title: 'Liste de souhaits | Lupeti',
    description: 'Sauvegardez vos essentiels Lupeti.',
  },
  tr: {
    title: 'Favoriler | Lupeti',
    description: 'Lupeti favorilerinizi saklayin.',
  },
};

export async function generateMetadata({
  params,
}: WishlistPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = pickLocalizedCopy(locale, metaCopy);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${locale}/wishlist`,
  });
}

export default async function WishlistPage({ params }: WishlistPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'wishlist' });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-400">{t('title')}</p>
        <h1 className="text-3xl font-bold text-slate-900">{t('headline')}</h1>
      </div>
      <WishlistContent />
    </div>
  );
}
