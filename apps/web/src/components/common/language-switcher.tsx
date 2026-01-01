'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Select } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { usePathname, useRouter } from '@/i18n/routing';
import { locales } from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();
  const t = useTranslations('nav.languages');

  const changeLocale = (nextLocale: string) => {
    if (nextLocale === locale) return;
    startTransition(() => {
      const slug =
        typeof params?.slug === 'string' ? params.slug : undefined;
      const target =
        slug && pathname === '/product/[slug]'
          ? ({ pathname: '/product/[slug]', params: { slug } } as const)
          : pathname;
      type RouterTarget = Parameters<typeof router.replace>[0];
      router.replace(target as RouterTarget, {
        locale: nextLocale as (typeof locales)[number],
      });
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
      showToast({
        title: t('updatedTitle'),
        description: t(nextLocale as (typeof locales)[number]),
        variant: 'info',
      });
    });
  };

  return (
    <div className="w-32">
      <Select
        aria-label={t('label')}
        disabled={pending}
        value={locale}
        onChange={(event) => changeLocale(event.target.value)}
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {t(code)}
          </option>
        ))}
      </Select>
    </div>
  );
}
