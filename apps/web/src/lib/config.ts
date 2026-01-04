const APP_NAME = 'Lupeti Pet Shop';

const trimSlash = (value?: string) => value?.replace(/\/$/, '');
const clientApiUrl = trimSlash(process.env.NEXT_PUBLIC_API_URL);
const serverApiUrl =
  trimSlash(process.env.API_INTERNAL_URL) ??
  clientApiUrl ??
  'http://localhost:3000';
const apiUrl =
  typeof window === 'undefined'
    ? serverApiUrl
    : clientApiUrl ?? serverApiUrl;

export const env = {
  apiUrl,
  supportedLocales:
    process.env.NEXT_PUBLIC_SUPPORTED_LOCALES?.split(',').map((locale) =>
      locale.trim(),
    ) ?? ['en'],
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? 'en',
  siteUrl:
    trimSlash(process.env.NEXT_PUBLIC_APP_URL) ??
    'http://localhost:3001',
  appName: APP_NAME,
};
