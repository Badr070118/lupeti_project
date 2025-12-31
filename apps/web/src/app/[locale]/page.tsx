import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { HeroStatic } from '@/components/hero/HeroStatic';
import { TrustBadges } from '@/components/home/TrustBadges';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoryHighlights } from '@/components/home/CategoryHighlights';
import { buildMetadata } from '@/lib/metadata';
import heroStaticOg from '@/../public/hero-static.jpg';
import storyImage from '@/../public/products/slow-roasted-quail-feast.jpg';

const HeroScene = dynamic(
  () => import('@/components/hero/Hero3D').then((mod) => mod.Hero3D),
  { loading: () => <HeroStatic /> },
);

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
    <div className="space-y-24 pb-16">
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-700">
            {t('hero.badge')}
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 lg:text-5xl">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-slate-600">{t('hero.subtitle')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {t('hero.ctaPrimary')}
            </Link>
            <a
              href="#featured"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
            >
              {t('hero.ctaSecondary')}
            </a>
          </div>
        </div>
        <HeroScene />
      </section>

      <TrustBadges />

      <FeaturedProducts />

      <CategoryHighlights />

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
