const APP_NAME = 'Lupeti Pet Shop';

export const env = {
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ??
    'http://localhost:3000',
  supportedLocales:
    process.env.NEXT_PUBLIC_SUPPORTED_LOCALES?.split(',').map((locale) =>
      locale.trim(),
    ) ?? ['en'],
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? 'en',
  siteUrl:
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
    'http://localhost:3001',
  appName: APP_NAME,
};
