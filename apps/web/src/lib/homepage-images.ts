export const DEFAULT_HERO_IMAGE = '/images/hero/lupeti_homepage2.jpeg';
export const DEFAULT_DOG_IMAGE = '/images/hero/category-dog-v2.png';
export const DEFAULT_CAT_IMAGE = '/images/hero/category-cat-v2.png';

export function homepageHeroImage(value?: string | null) {
  return !value || value === '/hero-static.jpg' ? DEFAULT_HERO_IMAGE : value;
}

export function categoryImage(value: string | null | undefined, type: 'dog' | 'cat') {
  const previousDefault = `/images/hero/${type}.jpg`;
  if (!value || value === previousDefault) {
    return type === 'dog' ? DEFAULT_DOG_IMAGE : DEFAULT_CAT_IMAGE;
  }
  return value;
}
