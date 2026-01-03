import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr', 'tr'],
  defaultLocale: 'en',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/shop': '/shop',
    '/search': '/search',
    '/product/[slug]': '/product/[slug]',
    '/category/[slug]': '/category/[slug]',
    '/cart': '/cart',
    '/checkout': '/checkout',
    '/checkout/success': '/checkout/success',
    '/login': '/login',
    '/register': '/register',
    '/account': '/account',
    '/orders': '/orders',
    '/orders/[id]': '/orders/[id]',
    '/wishlist': '/wishlist',
    '/contact': '/contact',
    '/shipping-returns': '/shipping-returns',
    '/privacy': '/privacy',
    '/terms': '/terms',
    '/admin': '/admin',
    '/admin/products': '/admin/products',
    '/admin/orders': '/admin/orders',
    '/admin/categories': '/admin/categories',
    '/admin/users': '/admin/users',
    '/admin/support': '/admin/support',
    '/admin/content': '/admin/content',
    '/admin/settings': '/admin/settings',
    '/support': '/support',
    '/success': '/success',
    '/fail': '/fail',
  },
});

export const {locales, defaultLocale, localePrefix, pathnames} = routing;

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
