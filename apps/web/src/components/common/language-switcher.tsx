'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { Select } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { usePathname, useRouter } from '@/i18n/routing';
import { locales } from '@/i18n/routing';

const LABELS: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  tr: 'Türkçe',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

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
      showToast({
        title: 'Language updated',
        description: LABELS[nextLocale] ?? nextLocale.toUpperCase(),
        variant: 'info',
      });
    });
  };

  return (
    <div className="w-32">
      <Select
        aria-label="Select language"
        disabled={pending}
        value={locale}
        onChange={(event) => changeLocale(event.target.value)}
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {LABELS[code] ?? code.toUpperCase()}
          </option>
        ))}
      </Select>
    </div>
  );
}
