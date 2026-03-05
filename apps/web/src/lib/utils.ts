export function cn(
  ...classes: Array<string | undefined | null | false>
): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(value: number, currency = 'EUR', locale?: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

export function formatPrice(cents: number, currency = 'TRY', locale?: string) {
  return formatCurrency(cents / 100, currency, locale);
}

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
