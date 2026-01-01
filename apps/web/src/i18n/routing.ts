import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr', 'tr'],
  defaultLocale: 'en',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/shop': '/shop',
    '/product/[slug]': '/product/[slug]',
    '/cart': '/cart',
    '/checkout': '/checkout',
    '/login': '/login',
    '/register': '/register',
    '/account': '/account',
    '/admin': '/admin',
    '/admin/products': '/admin/products',
    '/admin/users': '/admin/users',
    '/admin/support': '/admin/support',
    '/support': '/support',
    '/success': '/success',
    '/fail': '/fail',
  },
});

export const {locales, defaultLocale, localePrefix, pathnames} = routing;

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
