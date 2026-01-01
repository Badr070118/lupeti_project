'use client';

import { motion } from 'framer-motion';
import { Eye, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useQuickView } from '@/hooks/use-quick-view';
import { cardVariants } from '@/animations/variants';

type ProductCardProps = {
  product: Product;
  index?: number;
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const openQuickView = useQuickView((state) => state.open);

  const handleAdd = () => {
    toast.success(`${product.title} ajouté au panier`);
  };

  const hasPromo = product.pricing.isPromoActive;

  return (
    <motion.div
      variants={cardVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
    >
      {hasPromo && (
        <div className="promo-badge absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          Promo
        </div>
      )}
      <div className="relative aspect-square overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0].url}
            alt={product.images[0].altText ?? product.title}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={index < 2}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-50 text-slate-400">
            No image
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="rounded-full bg-white p-3 text-slate-900 shadow-lg transition hover:scale-105"
            aria-label="Quick view"
          >
            <Eye className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-full bg-[var(--primary)] p-3 text-white shadow-lg transition hover:scale-105"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
            {product.category.name}
          </p>
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">{product.title}</h3>
        </div>
        <div className="mt-auto flex items-baseline gap-2">
          {hasPromo && product.pricing.originalPriceCents && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(product.pricing.originalPriceCents, product.currency)}
            </span>
          )}
          <span className="text-2xl font-bold text-[var(--primary)]">
            {formatPrice(product.pricing.finalPriceCents, product.currency)}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={handleAdd}
          className="rounded-2xl bg-[var(--primary)] py-3 text-sm font-semibold text-white shadow hover:bg-[var(--primary-dark)]"
        >
          Ajouter au panier
        </motion.button>
      </div>
    </motion.div>
  );
}
