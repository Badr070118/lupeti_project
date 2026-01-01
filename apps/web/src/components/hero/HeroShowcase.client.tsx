'use client';

import dynamic from 'next/dynamic';

const HeroShowcase = dynamic(
  () => import('./HeroShowcase').then((mod) => mod.HeroShowcase),
  {
    ssr: false,
    loading: () => (
      <div className="hero-gradient-dark flex min-h-[620px] w-full items-center justify-center rounded-[40px]">
        <div className="space-y-4 text-center text-white/60">
          <div className="mx-auto h-4 w-48 rounded-full bg-white/10" />
          <div className="mx-auto h-8 w-72 rounded-full bg-white/10" />
          <div className="mx-auto h-8 w-64 rounded-full bg-white/10" />
        </div>
      </div>
    ),
  },
);

export function HeroShowcaseClient() {
  return <HeroShowcase />;
}
