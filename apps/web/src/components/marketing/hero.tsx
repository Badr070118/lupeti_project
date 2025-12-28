import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { HeroVisual } from './hero-visual';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-100 bg-gradient-to-br from-rose-50 via-white to-sky-50 px-6 py-12 shadow-2xl lg:flex lg:items-center lg:gap-12">
      <div className="space-y-6 lg:w-1/2">
        <Badge>{t('badge')}</Badge>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          {t('title')}
        </h1>
        <p className="text-lg text-slate-600">{t('subtitle')}</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/shop">{t('ctaPrimary')}</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/account">{t('ctaSecondary')}</Link>
          </Button>
        </div>
      </div>
      <div className="mt-8 lg:mt-0 lg:w-1/2">
        <HeroVisual />
      </div>
    </section>
  );
}
