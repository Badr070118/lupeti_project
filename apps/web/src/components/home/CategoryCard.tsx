'use client';

import Image from 'next/image';
import type { ComponentProps } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

type CategoryCardProps = {
  title: string;
  subtitle: string;
  image: string;
  link: ComponentProps<typeof Link>['href'];
};

export function CategoryCard({ title, subtitle, image, link }: CategoryCardProps) {
  return (
    <Link
      href={link}
      className="group relative block h-[320px] overflow-hidden rounded-3xl border border-slate-200/40 bg-slate-900 shadow-[0_14px_38px_rgba(2,6,23,0.26)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(2,6,23,0.42)] sm:h-[360px] lg:h-[400px]"
    >
      <Image
        src={image}
        alt={`${title} - ${subtitle}`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 transition-opacity duration-500 group-hover:opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.24),transparent_42%)] opacity-50 transition-opacity duration-500 group-hover:opacity-70" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 transition duration-500 group-hover:ring-white/30" />

      <div className="absolute bottom-0 left-0 z-10 w-full p-7 text-white sm:p-9">
        <span className="inline-flex rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur">
          Collection
        </span>
        <h3 className="mt-4 text-4xl font-extrabold tracking-[0.06em] sm:text-5xl">{title}</h3>
        <p className="mt-2 text-lg text-white/90 sm:text-xl">{subtitle}</p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur transition-all duration-500 group-hover:bg-white group-hover:text-slate-900">
          Voir la selection
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
