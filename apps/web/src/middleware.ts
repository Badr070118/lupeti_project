import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale, localePrefix} from './i18n/routing';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export const config = {
  matcher: [
    '/',
    '/(fr|en|tr)/:path*',
    '/((?!_next|_vercel|api|.*\\..*).*)',
  ],
};
