'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/types';
import { resolveProductImage } from '@/lib/product-images';

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.images ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];
  const activeSrc = active ? resolveProductImage(product.slug, active.url) : null;

  return (
    <div className="space-y-4">
      <div className="relative h-96 overflow-hidden rounded-3xl border border-slate-100 bg-white">
        {activeSrc ? (
          <Image
            src={activeSrc}
            alt={active?.altText ?? product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            {product.title}
          </div>
        )}
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => {
            const src = resolveProductImage(product.slug, image.url);
            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-20 overflow-hidden rounded-2xl border ${
                  index === activeIndex
                    ? 'border-rose-400 ring-2 ring-rose-200'
                    : 'border-slate-100'
                }`}
              >
                <Image
                  src={src}
                  alt={image.altText ?? product.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
