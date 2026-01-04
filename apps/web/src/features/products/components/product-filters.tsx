'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Category, ProductFilters as Filters } from '@/types';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';

interface ProductFiltersProps {
  categories: Category[];
  forcedCategory?: string;
  hideCategory?: boolean;
}

export function ProductFilters({
  categories,
  forcedCategory,
  hideCategory = false,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('shop');

  const [filters, setFilters] = useState<Filters>(() => ({
    category: forcedCategory ?? searchParams.get('category') ?? 'all',
    search: searchParams.get('search') ?? '',
    minPrice: searchParams.get('minPrice')
      ? Number(searchParams.get('minPrice')) / 100
      : undefined,
    maxPrice: searchParams.get('maxPrice')
      ? Number(searchParams.get('maxPrice')) / 100
      : undefined,
    sort: (searchParams.get('sort') as Filters['sort']) ?? 'newest',
    inStock: searchParams.get('inStock') === 'true',
    onSale: searchParams.get('onSale') === 'true',
  }));

  const hasFilters = useMemo(() => {
    return Boolean(
      filters.search ||
        typeof filters.minPrice === 'number' ||
        typeof filters.maxPrice === 'number' ||
        (filters.category && filters.category !== 'all') ||
        filters.inStock ||
        filters.onSale ||
        (filters.sort && filters.sort !== 'newest'),
    );
  }, [filters]);

  const updateFilters = (next: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    const categoryValue = forcedCategory ?? filters.category;
    if (categoryValue && categoryValue !== 'all') {
      params.set('category', categoryValue);
    } else {
      params.delete('category');
    }
    if (filters.search) params.set('search', filters.search);
    else params.delete('search');
    if (typeof filters.minPrice === 'number') {
      params.set('minPrice', String(Math.round(filters.minPrice * 100)));
    } else {
      params.delete('minPrice');
    }
    if (typeof filters.maxPrice === 'number') {
      params.set('maxPrice', String(Math.round(filters.maxPrice * 100)));
    } else {
      params.delete('maxPrice');
    }
    if (filters.sort && filters.sort !== 'newest') {
      params.set('sort', filters.sort);
    } else {
      params.delete('sort');
    }
    if (typeof filters.inStock === 'boolean') {
      params.set('inStock', String(filters.inStock));
    } else {
      params.delete('inStock');
    }
    if (typeof filters.onSale === 'boolean') {
      params.set('onSale', String(filters.onSale));
    } else {
      params.delete('onSale');
    }
    params.delete('page');
    const query = Object.fromEntries(params.entries());
    type RouterTarget = Parameters<typeof router.push>[0];
    router.push({ pathname, query } as RouterTarget);
  };

  const clearFilters = () => {
    setFilters({
      category: forcedCategory ?? 'all',
      search: '',
      sort: 'newest',
      inStock: false,
      onSale: false,
    });
    router.push(pathname as Parameters<typeof router.push>[0]);
  };

  return (
    <div className="filters-panel">
      <div className="filters-grid">
        <div className="md:col-span-2">
          <label htmlFor="search">{t('search')}</label>
          <Input
            id="search"
            className="soft-input"
            placeholder={t('searchPlaceholder')}
            value={filters.search ?? ''}
            onChange={(event) => updateFilters({ search: event.target.value })}
          />
        </div>
        {hideCategory || forcedCategory ? null : (
          <div>
            <label htmlFor="category">{t('category')}</label>
            <Select
              id="category"
              className="soft-input"
              value={filters.category ?? 'all'}
              onChange={(event) =>
                updateFilters({
                  category: event.target.value,
                })
              }
            >
              <option value="all">{t('allCategories')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>
        )}
        <div>
          <label htmlFor="min-price">{t('minPrice')}</label>
          <Input
            id="min-price"
            type="number"
            className="soft-input"
            value={filters.minPrice ?? ''}
            onChange={(event) =>
              updateFilters({
                minPrice: event.target.value ? Number(event.target.value) : undefined,
              })
            }
          />
        </div>
        <div>
          <label htmlFor="max-price">{t('maxPrice')}</label>
          <Input
            id="max-price"
            type="number"
            className="soft-input"
            value={filters.maxPrice ?? ''}
            onChange={(event) =>
              updateFilters({
                maxPrice: event.target.value ? Number(event.target.value) : undefined,
              })
            }
          />
        </div>
        <div>
          <label htmlFor="sort">{t('sortLabel')}</label>
          <Select
            id="sort"
            className="soft-input"
            value={filters.sort ?? 'newest'}
            onChange={(event) =>
              updateFilters({ sort: event.target.value as Filters['sort'] })
            }
          >
            <option value="newest">{t('sortNewest')}</option>
            <option value="price_asc">{t('sortPriceAsc')}</option>
            <option value="price_desc">{t('sortPriceDesc')}</option>
            <option value="best_sellers">{t('sortBest')}</option>
          </Select>
        </div>
        <div className="filters-toggle-group pt-6 md:pt-0 md:col-span-2">
          <label className="filters-toggle">
            <input
              type="checkbox"
              checked={filters.inStock ?? false}
              onChange={(event) => updateFilters({ inStock: event.target.checked })}
              className="filters-toggle__input"
            />
            <span className="filters-toggle__text">{t('inStock')}</span>
          </label>
          <label className="filters-toggle">
            <input
              type="checkbox"
              checked={filters.onSale ?? false}
              onChange={(event) => updateFilters({ onSale: event.target.checked })}
              className="filters-toggle__input"
            />
            <span className="filters-toggle__text">{t('onSale')}</span>
          </label>
        </div>
      </div>

      <div className="filters-actions">
        <Button onClick={applyFilters} className="flex-1 sm:flex-none">
          {t('ctaFilter')}
        </Button>
        <Button
          variant="ghost"
          onClick={clearFilters}
          disabled={!hasFilters}
          className="flex-1 sm:flex-none"
        >
          {t('reset')}
        </Button>
      </div>
    </div>
  );
}
