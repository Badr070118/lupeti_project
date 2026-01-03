import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { productService } from '@/services/product.service';
import { ProductGridSkeleton } from '@/features/products/components/product-grid.skeleton';
import { FeaturedProductsShowcase } from './FeaturedProductsShowcase';

async function FeaturedProductsContent() {
  const t = await getTranslations('home.featured');
  const featured = await productService.list({ limit: 8, featured: true });

  return (
    <section id="featured" className="space-y-8 rounded-3xl bg-white/70 p-6 shadow-lg lg:p-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">{t('eyebrow')}</p>
          <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">{t('title')}</h2>
          <p className="text-sm text-slate-500">{t('subtitle')}</p>
        </div>
        <div className="flex gap-3 text-sm text-slate-500">
          <span>Livraison 48h</span>
          <span>•</span>
          <span>Retours offerts</span>
        </div>
      </div>
      <FeaturedProductsShowcase products={featured.data} />
    </section>
  );
}

export function FeaturedProducts() {
  return (
    <Suspense
      fallback={
        <section className="space-y-6 rounded-3xl bg-white/70 p-6 shadow-lg">
          <div className="space-y-1">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-8 w-64 rounded bg-slate-200" />
            <div className="h-4 w-72 rounded bg-slate-100" />
          </div>
          <ProductGridSkeleton />
        </section>
      }
    >
      <FeaturedProductsContent />
    </Suspense>
  );
}
