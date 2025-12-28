export function cn(
  ...classes: Array<string | undefined | null | false>
): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(value: number, currency = 'EUR') {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(value);
}

export function formatPrice(cents: number, currency = 'TRY') {
  return formatCurrency(cents / 100, currency);
}

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
