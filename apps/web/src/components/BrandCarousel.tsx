'use client';

import Image from 'next/image';
import { brands } from '@/lib/brands';

export default function BrandCarousel() {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white py-10 shadow-sm">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-xl font-semibold text-slate-900">
          Nos marques partenaires
        </h2>
      </div>
      <div className="mt-8 overflow-hidden">
        <div className="flex gap-16 animate-scroll">
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex min-w-[140px] items-center justify-center opacity-70 transition hover:opacity-100"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={140}
                height={80}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
