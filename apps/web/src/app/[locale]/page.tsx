import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { TrustBadges } from '@/components/home/TrustBadges';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { buildMetadata } from '@/lib/metadata';
import heroStaticOg from '@/../public/hero-static.jpg';
import storyImage from '@/../public/products/slow-roasted-quail-feast.jpg';
import { BrandMarquee } from '@/components/home/BrandMarquee';
import { CategoryCards } from '@/components/home/CategoryCards';
import { HeroShowcaseClient } from '@/components/hero/HeroShowcase.client';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.meta' });
  const title = t('title');
  const description = t('description');
  return buildMetadata({
    title,
    description,
    path: `/${locale}`,
    images: [heroStaticOg.src],
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <div className="space-y-20 pb-16">
      <HeroShowcaseClient />
      <BrandMarquee />
      <TrustBadges />
      <FeaturedProducts />
      <CategoryCards />
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="order-last lg:order-first space-y-4">
          <p className="text-sm uppercase tracking-wide text-amber-500">
            {t('story.eyebrow')}
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">{t('story.title')}</h2>
          <p className="text-base text-slate-600">{t('story.body')}</p>
          <div className="rounded-3xl bg-amber-50 p-5 text-sm font-semibold text-amber-900">
            {t('story.highlight')}
          </div>
        </div>
        <div className="relative h-80 w-full overflow-hidden rounded-3xl bg-slate-100">
          <Image
            src={storyImage}
            alt={t('story.title')}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover"
            priority={false}
          />
        </div>
      </section>

      <section className="rounded-3xl bg-slate-900 px-8 py-12 text-white lg:px-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-amber-300">
              {t('final.eyebrow')}
            </p>
            <h2 className="text-3xl font-semibold">{t('final.title')}</h2>
            <p className="mt-2 text-slate-300">{t('final.subtitle')}</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            {t('final.cta')}
          </Link>
        </div>
      </section>
    </div>
  );
}
