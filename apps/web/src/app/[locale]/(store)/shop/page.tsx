import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import { ProductFilters } from '@/features/products/components/product-filters';
import { ProductGrid } from '@/features/products/components/product-grid';
import { Pagination } from '@/features/products/components/pagination';
import type { ProductFilters as Filters } from '@/types';
import { buildMetadata, pickLocalizedCopy } from '@/lib/metadata';

type ShopPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const metaCopy = {
  en: {
    title: 'Shop mindful pet goods | Lupeti',
    description:
      'Browse croquettes, accessories, and treats curated for conscious pet rituals.',
  },
  fr: {
    title: 'Boutique d’accessoires et croquettes | Lupeti',
    description:
      'Découvrez nos croquettes et accessoires pensés pour des rituels animaliers conscients.',
  },
  tr: {
    title: 'Evcil dost marketi | Lupeti',
    description:
      'Bilinçli rutinler için seçilmiş mamalar ve aksesuarlar arasında gezinin.',
  },
};

export async function generateMetadata({
  params,
}: ShopPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = pickLocalizedCopy(locale, metaCopy);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${locale}/shop`,
  });
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = await searchParams;
  const readParam = (key: string) => {
    const value = resolvedSearchParams?.[key];
    return Array.isArray(value) ? value[0] : value ?? undefined;
  };

  const page = Number(readParam('page') ?? '1') || 1;
  const categoryParam = readParam('category');

  const filters: Filters = {
    category: categoryParam ?? 'all',
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

  const [products, categories, t] = await Promise.all([
    productService.list(filters, { revalidate: 120 }),
    categoryService.list(),
    getTranslations('shop'),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-400">{t('title')}</p>
        <h1 className="text-3xl font-bold text-slate-900">{t('headline')}</h1>
      </div>
      <ProductFilters categories={categories} />
      <ProductGrid products={products.data} />
      <Pagination page={products.meta.page} totalPages={products.meta.totalPages} />
    </div>
  );
}
