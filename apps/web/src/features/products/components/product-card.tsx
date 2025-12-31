import Image from 'next/image';
import { Star } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { AddToCartButton } from '@/features/cart/components/add-to-cart-button';
import { Link } from '@/i18n/routing';
import { resolveProductImage } from '@/lib/product-images';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const cover = resolveProductImage(
    product.slug,
    product.images?.[0]?.url,
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={{ pathname: '/product/[slug]', params: { slug: product.slug } }}
        className="relative block h-56"
      >
        {cover ? (
          <Image
            src={cover}
            alt={product.title}
            fill
            sizes="(max-width:768px) 100vw, 30vw"
            className="object-cover"
            priority={product.isActive}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-500">
            {product.title}
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <div className="flex items-center justify-between text-sm text-amber-500">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current" />
            5.0
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
            {product.category.name}
          </span>
        </div>
        <Link
          href={{ pathname: '/product/[slug]', params: { slug: product.slug } }}
          className="text-lg font-semibold text-slate-900"
        >
          {product.title}
        </Link>
        <p className="line-clamp-2 text-sm text-slate-500">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">
            {formatPrice(product.priceCents, product.currency)}
          </div>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
