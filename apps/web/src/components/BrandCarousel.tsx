'use client';

import Image from 'next/image';
import { brands } from '@/lib/brands';

export default function BrandCarousel() {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white py-10 shadow-sm">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-xl font-semibold text-slate-900">
          İş ortağı markalarımız
        </h2>
      </div>
      <div className="mt-8 overflow-hidden">
        <div className="flex gap-16 animate-scroll">
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="group flex min-w-[140px] items-center justify-center rounded-2xl px-2 py-1 transition-transform duration-300 hover:-translate-y-1"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={140}
                height={80}
                quality={100}
                sizes="140px"
                className="object-contain transition-all duration-300 group-hover:scale-[1.06] group-hover:drop-shadow-[0_10px_20px_rgba(15,23,42,0.22)]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
