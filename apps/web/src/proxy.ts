import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix } from './i18n/routing';
import { env } from './lib/config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

const ADMIN_PREFIX = '/admin';
const AUTH_PREFIXES = ['/account', '/orders'];

function resolveLocale(pathname: string) {
  return locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

function normalizePath(pathname: string, locale?: string) {
  if (!locale) return pathname;
  const prefix = `/${locale}`;
  return pathname.startsWith(prefix) ? pathname.slice(prefix.length) || '/' : pathname;
}

async function getSessionUser(req: NextRequest) {
  const cookie = req.headers.get('cookie');
  if (!cookie) return null;
  const response = await fetch(`${env.apiUrl}/auth/session`, {
    method: 'GET',
    headers: {
      cookie,
    },
    cache: 'no-store',
  });
  if (!response.ok) {
    return null;
  }
  const payload = (await response.json()) as { user?: { role?: string } };
  return payload.user ?? null;
}

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/en' || req.nextUrl.pathname === '/tr') {
    const url = req.nextUrl.clone();
    url.pathname = '/fr';
    return NextResponse.redirect(url);
  }

  const forcedFrenchPath = req.nextUrl.pathname.replace(/^\/(en|tr)(?=\/|$)/, '/fr');
  if (forcedFrenchPath !== req.nextUrl.pathname) {
    const url = req.nextUrl.clone();
    url.pathname = forcedFrenchPath;
    return NextResponse.redirect(url);
  }

  const locale = resolveLocale(req.nextUrl.pathname) ?? defaultLocale;
  const path = normalizePath(req.nextUrl.pathname, locale);

  if (path.startsWith(ADMIN_PREFIX)) {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
  }

  if (AUTH_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    '/',
    '/(fr)/:path*',
    '/((?!_next|_vercel|api|.*\\..*).*)',
  ],
};
