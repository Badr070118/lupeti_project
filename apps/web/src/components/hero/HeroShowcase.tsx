'use client';

import Image from 'next/image';

export function HeroShowcase() {
  return (
    <section className="relative w-full aspect-[43/24] overflow-hidden rounded-[32px] shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
      <Image
        src="/images/hero/lupeti_homepage2.jpeg"
        alt="Lupeti homepage hero"
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover object-center"
      />
    </section>
  );
}

export function HeroShowcaseSkeleton() {
  return (
    <div className="flex w-full aspect-[43/24] items-center justify-center rounded-[32px] bg-slate-200">
      <div className="space-y-3 text-center text-slate-500">
        <div className="mx-auto h-4 w-36 rounded-full bg-slate-300" />
        <div className="mx-auto h-7 w-64 rounded-full bg-slate-300" />
        <div className="mx-auto h-5 w-52 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}
