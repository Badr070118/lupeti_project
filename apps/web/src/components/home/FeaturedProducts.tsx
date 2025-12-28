import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { productService } from '@/services/product.service';
import { ProductGrid } from '@/features/products/components/product-grid';
import { ProductGridSkeleton } from '@/features/products/components/product-grid.skeleton';

async function FeaturedProductsContent() {
  const t = await getTranslations('home.featured');
  const featured = await productService.list(
    { limit: 8, featured: true },
    { revalidate: 180 },
  );

  return (
    <section id="featured" className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-amber-500">
            {t('eyebrow')}
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            {t('title')}
          </h2>
          <p className="text-sm text-slate-500">{t('subtitle')}</p>
        </div>
      </div>
      <ProductGrid products={featured.data} />
    </section>
  );
}

export function FeaturedProducts() {
  return (
    <Suspense
      fallback={
        <section className="space-y-6">
          <div className="space-y-1">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-8 w-64 rounded bg-slate-200" />
            <div className="h-4 w-72 rounded bg-slate-100" />
          </div>
          <ProductGridSkeleton />
        </section>
      }
    >
      {/* @ts-expect-error Async Server Component */}
      <FeaturedProductsContent />
    </Suspense>
  );
}

