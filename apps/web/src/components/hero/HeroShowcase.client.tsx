'use client';

import dynamic from 'next/dynamic';

const HeroShowcase = dynamic(
  () => import('./HeroShowcase').then((mod) => mod.HeroShowcase),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] w-full items-center justify-center rounded-[32px] bg-slate-100 sm:h-[360px] lg:h-[420px]">
        <div className="space-y-3 text-center text-slate-500">
          <div className="mx-auto h-4 w-36 rounded-full bg-slate-300" />
          <div className="mx-auto h-7 w-64 rounded-full bg-slate-300" />
          <div className="mx-auto h-5 w-52 rounded-full bg-slate-300" />
        </div>
      </div>
    ),
  },
);

export function HeroShowcaseClient() {
  return <HeroShowcase />;
}
