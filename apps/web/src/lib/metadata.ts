import type { Metadata } from 'next';
import { env } from './config';

type BuildMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  images?: string[];
};

const FALLBACK_LOCALE = env.defaultLocale;
const metadataBase = new URL(env.siteUrl);
const FALLBACK_IMAGE = '/hero-static.jpg';

export function buildMetadata({
  title,
  description,
  path = '/',
  images,
}: BuildMetadataOptions): Metadata {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const canonical = new URL(normalizedPath, metadataBase).toString();
  const resolvedImages = (images?.length ? images : [FALLBACK_IMAGE]).map(
    (src) => (src.startsWith('http') ? src : new URL(src, metadataBase).toString()),
  );
  return {
    metadataBase,
    title,
    description,
    alternates: {
      canonical: normalizedPath,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: env.appName,
      type: 'website',
      images: resolvedImages.map((url) => ({
        url,
        alt: title,
        width: 1200,
        height: 630,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: resolvedImages,
    },
  };
}

export function pickLocalizedCopy<T>(
  locale: string,
  copy: Record<string, T>,
): T {
  return (
    copy[locale] ??
    copy[FALLBACK_LOCALE] ??
    copy[Object.keys(copy)[0] as keyof typeof copy]
  );
}
