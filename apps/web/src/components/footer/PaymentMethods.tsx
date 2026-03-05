import Image from 'next/image';

const PAYMENT_ITEMS = [
  { key: 'paytr', label: 'PayTR', src: '/payments/paytr.png' },
  { key: 'visa', label: 'Visa', src: '/payments/visa.svg' },
  { key: 'mastercard', label: 'Mastercard', src: '/payments/mastercard.svg' },
  { key: 'amex', label: 'American Express', src: '/payments/amex.svg' },
  { key: 'paypal', label: 'PayPal', src: '/payments/paypal.svg' },
  { key: 'cash-on-delivery', label: 'Cash on delivery', src: '/payments/cashondelivery.jpg' },
] as const;

export function PaymentMethods() {
  return (
    <section className="mt-10 border-t border-slate-200 pt-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Moyens de paiement
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {PAYMENT_ITEMS.map((item) => (
          <div
            key={item.key}
            className="inline-flex h-12 w-[124px] items-center justify-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <Image
              src={item.src}
              alt={item.label}
              width={100}
              height={32}
              className="h-auto max-h-8 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
