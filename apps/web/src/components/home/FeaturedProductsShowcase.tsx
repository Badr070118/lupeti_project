'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import type { Product } from '@/types';
import { FilterSidebar } from '@/components/products/FilterSidebar';
import { ProductGrid } from '@/components/products/ProductGrid';
import { AnimatedButton } from '@/components/shared/AnimatedButton';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type FeaturedProductsShowcaseProps = {
  products: Product[];
};

const FILTER_VALUES = ['all', 'dogs', 'cats'] as const;

function matchFilter(product: Product, filter: string) {
  if (filter === 'all') return true;
  if (filter === 'dogs') {
    return /dog|chien/i.test(product.category.slug) || /dog|chien/i.test(product.category.name);
  }
  if (filter === 'cats') {
    return /cat|chat/i.test(product.category.slug) || /cat|chat/i.test(product.category.name);
  }
  return true;
}

export function FeaturedProductsShowcase({ products }: FeaturedProductsShowcaseProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const router = useRouter();
  const t = useTranslations('home.featured');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const filterOptions = FILTER_VALUES.map((value) => ({
    value,
    label: t(`filters.${value}`),
  }));

  const filteredProducts = useMemo(
    () => products.filter((product) => matchFilter(product, activeFilter)),
    [products, activeFilter],
  );

  return (
    <div ref={ref} className="grid gap-8 lg:grid-cols-[180px,1fr]">
      <FilterSidebar
        active={activeFilter}
        options={filterOptions}
        onChange={setActiveFilter}
      />
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <ProductGrid products={filteredProducts} />
        </motion.div>
        <AnimatedButton
          variant="secondary"
          className="w-full md:w-auto"
          onClick={() => router.push('/shop')}
        >
          {t('viewAll')}
        </AnimatedButton>
      </div>
    </div>
  );
}
