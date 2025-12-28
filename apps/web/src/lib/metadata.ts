import type { Metadata } from 'next';
import { env } from './config';

type BuildMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  images?: string[];
};

const FALLBACK_LOCALE = env.defaultLocale;

export function buildMetadata({
  title,
  description,
  path = '/',
  images,
}: BuildMetadataOptions): Metadata {
  const canonical = new URL(
    path.startsWith('/') ? path : `/${path}`,
    env.siteUrl,
  ).toString();
  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: env.appName,
      type: 'website',
      images: images?.map((src) => ({
        url: src,
        alt: title,
        width: 1200,
        height: 630,
      })),
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
