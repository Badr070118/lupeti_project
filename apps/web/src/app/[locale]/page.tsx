import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import heroStaticOg from '@/../public/hero-static.jpg';
import storyImage from '@/../public/images/hero/golden.jpg';
import BrandCarousel from '@/components/BrandCarousel';
import { CategoryCards } from '@/components/home/CategoryCards';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { HeroSlider } from '@/components/home/HeroSlider';
import { Hero3D } from '@/components/home/Hero3D';
import { StoreBenefits } from '@/components/layout/StoreBenefits';
import { settingsService } from '@/services/settings.service';
import type { HomepageSettings } from '@/types';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-dynamic';

type HomepageViewSettings = Pick<
  HomepageSettings,
  | 'heroImageUrl'
  | 'storyImageUrl'
  | 'categoryDogImageUrl'
  | 'categoryCatImageUrl'
  | 'showHeroShowcase'
  | 'showHero3d'
  | 'showBrandMarquee'
  | 'showFeatured'
  | 'showCategoryCards'
  | 'showStorySection'
  | 'showTrustBadges'
>;

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
  const fallbackHomepage: HomepageViewSettings = {
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
  let homepage: HomepageViewSettings = fallbackHomepage;
  try {
    const settings = await settingsService.getPublic();
    homepage = settings.homepage;
  } catch {
    homepage = fallbackHomepage;
  }
  const storySrc = homepage.storyImageUrl ?? storyImage;

  return (
    <div className="space-y-20 pb-16">
      {homepage.showHeroShowcase ? (
        <HeroSlider />
      ) : null}
      {homepage.showBrandMarquee ? <BrandCarousel /> : null}
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
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <StoreBenefits />
      </div>
    </div>
  );
}

