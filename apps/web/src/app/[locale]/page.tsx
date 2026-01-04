import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { TrustBadges } from '@/components/home/TrustBadges';
import { buildMetadata } from '@/lib/metadata';
import heroStaticOg from '@/../public/hero-static.jpg';
import storyImage from '@/../public/images/hero/golden.jpg';
import BrandCarousel from '@/components/BrandCarousel';
import { CategoryCards } from '@/components/home/CategoryCards';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { HeroShowcaseClient } from '@/components/hero/HeroShowcase.client';
import { Hero3D } from '@/components/home/Hero3D';
import { settingsService } from '@/services/settings.service';
import { SearchBar } from '@/components/common/search-bar';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.meta' });
  let heroImage = heroStaticOg.src;
  try {
    const settings = await settingsService.getPublic();
    heroImage = settings.homepage.heroImageUrl ?? heroStaticOg.src;
  } catch {
    heroImage = heroStaticOg.src;
  }
  const title = t('title');
  const description = t('description');
  return buildMetadata({
    title,
    description,
    path: `/${locale}`,
    images: [heroImage],
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const fallbackHomepage = {
    heroImageUrl: null,
    storyImageUrl: null,
    categoryDogImageUrl: null,
    categoryCatImageUrl: null,
    showHeroShowcase: true,
    showHero3d: true,
    showBrandMarquee: true,
    showFeatured: true,
    showCategoryCards: true,
    showStorySection: true,
    showTrustBadges: true,
  };
  let homepage = fallbackHomepage;
  try {
    const settings = await settingsService.getPublic();
    homepage = settings.homepage;
  } catch {
    homepage = fallbackHomepage;
  }
  const storySrc = homepage.storyImageUrl ?? storyImage;

  return (
    <div className="space-y-20 pb-16">
      {homepage.showHeroShowcase ? <HeroShowcaseClient /> : null}
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-wide text-slate-400">
          {t('search.eyebrow')}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          {t('search.title')}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{t('search.subtitle')}</p>
        <div className="mt-4 max-w-xl">
          <SearchBar />
        </div>
      </section>
      {homepage.showBrandMarquee ? <BrandCarousel /> : null}
      {homepage.showTrustBadges ? <TrustBadges /> : null}
      {homepage.showHero3d ? <Hero3D locale={locale} /> : null}
      {homepage.showCategoryCards ? (
        <CategoryCards
          dogImageUrl={homepage.categoryDogImageUrl}
          catImageUrl={homepage.categoryCatImageUrl}
        />
      ) : null}
      {homepage.showFeatured ? <FeaturedProducts /> : null}
      {homepage.showStorySection ? (
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
              src={storySrc}
              alt={t('story.title')}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover"
              priority={false}
              unoptimized
            />
          </div>
        </section>
      ) : null}

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

