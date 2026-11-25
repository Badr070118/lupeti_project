import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale} from './routing';

export default getRequestConfig(async ({requestLocale, locale}) => {
  const requested = locale ?? (await requestLocale);
  const activeLocale = locales.includes(requested as (typeof locales)[number])
    ? (requested as (typeof locales)[number])
    : defaultLocale;

  return {
    locale: activeLocale,
    messages: (await import(`../messages/${activeLocale}.json`)).default,
  };
});
