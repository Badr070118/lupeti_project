'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useQuickView } from '@/hooks/use-quick-view';
import { formatPrice } from '@/lib/utils';
import { resolveProductImage } from '@/lib/product-images';

export function QuickView() {
  const product = useQuickView((state) => state.product);
  const close = useQuickView((state) => state.close);

  return (
    <AnimatePresence>
      {product ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative grid w-full max-w-3xl gap-8 rounded-3xl bg-white p-6 shadow-2xl md:grid-cols-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-slate-600 shadow-md transition hover:text-slate-900"
              onClick={close}
              aria-label="Close quick view"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50">
              {resolveProductImage(product.slug, product.images?.[0]?.url) ? (
                <Image
                  src={resolveProductImage(product.slug, product.images?.[0]?.url)}
                  alt={product.images?.[0]?.altText ?? product.title}
                  fill
                  className="object-contain p-6"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  No preview
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-[var(--accent)]">
                  {product.category.name}
                </p>
                <h3 className="text-2xl font-semibold text-slate-900">{product.title}</h3>
              </div>
              <p className="text-sm text-slate-600 line-clamp-5">{product.description}</p>
              <div className="flex items-end gap-3">
                {product.pricing.isPromoActive && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(product.pricing.originalPriceCents, product.currency)}
                  </span>
                )}
                <span className="text-3xl font-bold text-[var(--primary)]">
                  {formatPrice(product.pricing.finalPriceCents, product.currency)}
                </span>
              </div>
              <button
                type="button"
                onClick={close}
                className="w-full rounded-full bg-[var(--primary)] py-3 text-white shadow-lg transition hover:bg-[var(--primary-dark)]"
              >
                Ajouter au panier
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
