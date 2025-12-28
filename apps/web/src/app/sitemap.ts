import type { MetadataRoute } from 'next';
import { env } from '@/lib/config';
import { locales } from '@/i18n/routing';
import { productService } from '@/services/product.service';

const BASE_PATHS = [
  '',
  '/shop',
  '/cart',
  '/checkout',
  '/login',
  '/register',
  '/account',
  '/admin',
  '/success',
  '/fail',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.siteUrl;
  const now = new Date();

  const staticEntries = locales.flatMap((locale) =>
    BASE_PATHS.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: now,
    })),
  );

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const catalog = await productService.list(
      { limit: 50 },
      { revalidate: 300 },
    );
    productEntries = locales.flatMap((locale) =>
      catalog.data.map((product) => ({
        url: `${baseUrl}/${locale}/product/${product.slug}`,
        lastModified: product.updatedAt
          ? new Date(product.updatedAt)
          : now,
      })),
    );
  } catch (error) {
    console.warn('Unable to build product sitemap', error);
  }

  return [...staticEntries, ...productEntries];
}
