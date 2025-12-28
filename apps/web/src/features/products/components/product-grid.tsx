import { useTranslations } from 'next-intl';
import type { Product } from '@/types';
import { ProductCard } from './product-card';
import { ProductGridSkeleton } from './product-grid.skeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  const t = useTranslations('shop');

  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (!products.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
        {t('empty')}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
