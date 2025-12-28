'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
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
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  const changeLocale = (nextLocale: string) => {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale as (typeof locales)[number] });
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
