export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .trim();
}

export function ensureSlug(value: string, fallback: string) {
  const slugFromValue = slugify(value);
  const slugFromFallback = slugify(fallback);
  return slugFromValue || slugFromFallback || `item-${Date.now()}`;
}
