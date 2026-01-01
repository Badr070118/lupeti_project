'use client';

import { motion, Variants } from 'framer-motion';
import { useMemo } from 'react';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { containerVariants } from '@/animations/variants';

type ProductGridProps = {
  products: Product[];
  variant?: 'default' | 'staggered';
};

const gridVariants: Record<NonNullable<ProductGridProps['variant']>, Variants> = {
  default: {},
  staggered: containerVariants,
};

export function ProductGrid({ products, variant = 'staggered' }: ProductGridProps) {
  const content = useMemo(
    () =>
      products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      )),
    [products],
  );

  const variants = gridVariants[variant];
  const isAnimated = variant === 'staggered';

  return (
    <motion.div
      variants={variants}
      initial={isAnimated ? 'hidden' : undefined}
      animate={isAnimated ? 'visible' : undefined}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {content}
    </motion.div>
  );
}
