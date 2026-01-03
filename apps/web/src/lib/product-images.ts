import type { StaticImageData } from 'next/image';
import anatolian from '@/../public/products/anatolian-lamb-herbs-kibble.png';
import turkey from '@/../public/products/tender-turkey-puppy-bites.png';
import sardine from '@/../public/products/coastal-sardine-crunch.png';
import charcoal from '@/../public/products/charcoal-digestive-biscuits.png';
import salmon from '@/../public/products/highland-salmon-casserole.png';
import kefir from '@/../public/products/fermented-kefir-nibbles.png';
import herring from '@/../public/products/midnight-herring-supper.png';
import goatMilk from '@/../public/products/sun-baked-goat-milk-bites.png';
import quail from '@/../public/products/slow-roasted-quail-feast.png';
import olive from '@/../public/products/olive-oil-shine-coat-treats.png';
import fallbackHero from '@/../public/hero-static.jpg';

const PRODUCT_IMAGE_MAP: Record<string, StaticImageData> = {
  'anatolian-lamb-herbs-kibble': anatolian,
  'tender-turkey-puppy-bites': turkey,
  'coastal-sardine-crunch': sardine,
  'charcoal-digestive-biscuits': charcoal,
  'highland-salmon-casserole': salmon,
  'fermented-kefir-nibbles': kefir,
  'midnight-herring-supper': herring,
  'sun-baked-goat-milk-bites': goatMilk,
  'slow-roasted-quail-feast': quail,
  'olive-oil-shine-coat-treats': olive,
};

export function resolveProductImage(
  slug: string,
  fallback?: string | null,
): StaticImageData | string {
  if (fallback && !fallback.startsWith('http')) {
    if (fallback.startsWith('/uploads/')) {
      return fallback;
    }
  }
  const local = PRODUCT_IMAGE_MAP[slug];
  if (local) {
    return local;
  }
  if (fallback && !fallback.startsWith('http')) {
    return fallback;
  }
  return fallbackHero;
}
