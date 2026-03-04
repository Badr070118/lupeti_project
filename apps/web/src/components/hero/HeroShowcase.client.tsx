'use client';

import dynamic from 'next/dynamic';

const HeroShowcase = dynamic(
  () => import('./HeroShowcase').then((mod) => mod.HeroShowcase),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] w-full items-center justify-center rounded-[32px] bg-slate-900 sm:h-[360px] lg:h-[420px]">
        <div className="space-y-3 text-center text-white/60">
          <div className="mx-auto h-4 w-36 rounded-full bg-white/15" />
          <div className="mx-auto h-7 w-64 rounded-full bg-white/15" />
          <div className="mx-auto h-5 w-52 rounded-full bg-white/15" />
        </div>
      </div>
    ),
  },
);

export function HeroShowcaseClient() {
  return <HeroShowcase />;
}
