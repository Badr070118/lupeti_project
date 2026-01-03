import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import { ProductFilters } from '@/features/products/components/product-filters';
import { ProductGrid } from '@/features/products/components/product-grid';
import { Pagination } from '@/features/products/components/pagination';
import type { ProductFilters as Filters } from '@/types';
import { buildMetadata } from '@/lib/metadata';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { env } from '@/lib/config';

type CategoryPageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  return buildMetadata({
    title: `Category: ${slug} | ${env.appName}`,
    description: `Browse ${slug} essentials from Lupeti.`,
    path: `/${locale}/category/${slug}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const readParam = (key: string) => {
    const value = resolvedSearchParams?.[key];
    return Array.isArray(value) ? value[0] : value ?? undefined;
  };

  const categories = await categoryService.list();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const page = Number(readParam('page') ?? '1') || 1;
  const filters: Filters = {
    category: slug,
    search: readParam('search') ?? '',
    minPrice: readParam('minPrice')
      ? Number(readParam('minPrice')) / 100
      : undefined,
    maxPrice: readParam('maxPrice')
      ? Number(readParam('maxPrice')) / 100
      : undefined,
    page,
    sort: (readParam('sort') as Filters['sort']) ?? 'newest',
    inStock: readParam('inStock') === 'true',
    onSale: readParam('onSale') === 'true',
  };

  const [products, t] = await Promise.all([
    productService.list(filters),
    getTranslations('category'),
  ]);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: t('breadcrumbs.home', { default: 'Home' }), href: '/' },
          { label: t('breadcrumbs.shop', { default: 'Shop' }), href: '/shop' },
          { label: category.name, href: `/category/${category.slug}` },
        ]}
      />
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-400">{t('eyebrow')}</p>
        <h1 className="text-3xl font-bold text-slate-900">{category.name}</h1>
        <p className="text-sm text-slate-500">{t('subtitle')}</p>
      </div>
      <ProductFilters
        categories={categories}
        forcedCategory={category.slug}
        hideCategory
      />
      <ProductGrid products={products.data} />
      <Pagination page={products.meta.page} totalPages={products.meta.totalPages} />
    </div>
  );
}
