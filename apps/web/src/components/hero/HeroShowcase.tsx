'use client';

import Image from 'next/image';

export function HeroShowcase() {
  return (
    <section className="relative h-[300px] overflow-hidden rounded-[32px] bg-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:h-[360px] lg:h-[420px]">
      <Image
        src="/images/hero/hero-animals.png"
        alt="Deux chats, un golden retriever et un bulldog francais"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 1200px"
        className="object-cover object-center"
      />
    </section>
  );
}

export function HeroShowcaseSkeleton() {
  return (
    <div className="flex h-[300px] w-full items-center justify-center rounded-[32px] bg-slate-200 sm:h-[360px] lg:h-[420px]">
      <div className="space-y-3 text-center text-slate-500">
        <div className="mx-auto h-4 w-36 rounded-full bg-slate-300" />
        <div className="mx-auto h-7 w-64 rounded-full bg-slate-300" />
        <div className="mx-auto h-5 w-52 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}
