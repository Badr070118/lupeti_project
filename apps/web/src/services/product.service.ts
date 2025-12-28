import { ApiError, fetchApi } from '@/lib/api';
import type { PaginatedResult, Product, ProductFilters } from '@/types';

type ProductFetchOptions = {
  revalidate?: number;
};

function buildQuery(filters: ProductFilters = {}) {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'all') {
    params.set('category', filters.category);
  }
  if (filters.search) params.set('search', filters.search);
  if (typeof filters.minPrice === 'number') {
    params.set('minPrice', String(Math.round(filters.minPrice * 100)));
  }
  if (typeof filters.maxPrice === 'number') {
    params.set('maxPrice', String(Math.round(filters.maxPrice * 100)));
  }
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.sort) params.set('sort', filters.sort);
  if (typeof filters.featured === 'boolean') {
    params.set('featured', String(filters.featured));
  }
  return params.toString();
}

function buildFetchOptions(options?: ProductFetchOptions) {
  if (options?.revalidate) {
    return {
      cache: 'force-cache' as const,
      next: { revalidate: options.revalidate },
    };
  }
  return { cache: 'no-store' as const };
}

async function listProducts(
  filters: ProductFilters = {},
  options?: ProductFetchOptions,
): Promise<PaginatedResult<Product>> {
  const query = buildQuery(filters);
  const path = query ? `/products?${query}` : '/products';
  return fetchApi<PaginatedResult<Product>>(path, buildFetchOptions(options));
}

async function getProduct(
  slug: string,
  options?: ProductFetchOptions,
): Promise<Product | null> {
  try {
    return await fetchApi<Product>(
      `/products/${slug}`,
      buildFetchOptions(options),
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export const productService = {
  list: listProducts,
  get: getProduct,
};
