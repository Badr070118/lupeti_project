import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { AddToCartButton } from '@/features/cart/components/add-to-cart-button';
import { Badge } from '@/components/ui/badge';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const t = useTranslations('product');
  const cover = product.images?.[0];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="relative h-96 overflow-hidden rounded-3xl border border-slate-100">
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.altText ?? product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-500">
              {product.title}
            </div>
          )}
        </div>
        {product.images?.length > 1 ? (
          <div className="grid grid-cols-4 gap-3">
            {product.images.slice(1).map((image) => (
              <div
                key={image.id}
                className="relative h-20 overflow-hidden rounded-2xl border border-slate-100"
              >
                <Image
                  src={image.url}
                  alt={image.altText ?? product.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="space-y-6">
        <Badge className="bg-slate-900 text-white">{product.category.name}</Badge>
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">{t('details')}</p>
          <h1 className="mt-2 text-4xl font-black text-slate-900">{product.title}</h1>
        </div>
        <p className="text-lg text-slate-600">{product.description}</p>
        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-slate-400">
            {t('specs.title')}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
            <div>
              <dt className="text-xs uppercase text-slate-400">{t('specs.currency')}</dt>
              <dd className="font-semibold">{product.currency}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">{t('specs.stock')}</dt>
              <dd className="font-semibold">{product.stock}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">{t('specs.slug')}</dt>
              <dd className="font-semibold">{product.slug}</dd>
            </div>
          </dl>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-3xl font-bold text-slate-900">
            {formatPrice(product.priceCents, product.currency)}
          </p>
          <AddToCartButton productId={product.id} className="px-6 py-3" />
        </div>
      </div>
    </div>
  );
}
