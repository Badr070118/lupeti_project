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
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('shop');

  const [filters, setFilters] = useState<Filters>(() => ({
    category: searchParams.get('category') ?? 'all',
    search: searchParams.get('search') ?? '',
    minPrice: searchParams.get('minPrice')
      ? Number(searchParams.get('minPrice')) / 100
      : undefined,
    maxPrice: searchParams.get('maxPrice')
      ? Number(searchParams.get('maxPrice')) / 100
      : undefined,
  }));

  const hasFilters = useMemo(() => {
    return Boolean(
      filters.search ||
        filters.minPrice ||
        filters.maxPrice ||
        (filters.category && filters.category !== 'all'),
    );
  }, [filters]);

  const updateFilters = (next: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (filters.category && filters.category !== 'all') {
      params.set('category', filters.category);
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
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({ category: 'all', search: '' });
    router.push(pathname);
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-xs font-semibold uppercase text-slate-400">{t('search')}</p>
          <Input
            placeholder={t('searchPlaceholder')}
            value={filters.search ?? ''}
            onChange={(event) => updateFilters({ search: event.target.value })}
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            {t('category')}
          </p>
          <Select
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">
              {t('minPrice')}
            </p>
            <Input
              type="number"
              value={filters.minPrice ?? ''}
              onChange={(event) =>
                updateFilters({
                  minPrice: event.target.value ? Number(event.target.value) : undefined,
                })
              }
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">
              {t('maxPrice')}
            </p>
            <Input
              type="number"
              value={filters.maxPrice ?? ''}
              onChange={(event) =>
                updateFilters({
                  maxPrice: event.target.value ? Number(event.target.value) : undefined,
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={applyFilters}>{t('ctaFilter')}</Button>
        <Button variant="ghost" onClick={clearFilters} disabled={!hasFilters}>
          {t('reset')}
        </Button>
      </div>
    </div>
  );
}
