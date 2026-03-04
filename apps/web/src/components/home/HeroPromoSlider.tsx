'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';
import { promoSlides } from '@/data/homeSliders';
import { CarouselControls } from '@/components/home/CarouselControls';

function ProductPanel({
  brand,
  brandLogo,
  productName,
  productImg,
  note,
}: {
  brand: string;
  brandLogo?: string;
  productName: string;
  productImg: string;
  note: string;
}) {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div>
        {brandLogo ? (
          <img
            src={brandLogo}
            alt={brand}
            className="h-7 w-auto object-contain"
            loading="lazy"
          />
        ) : (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{brand}</p>
        )}
        <h3 className="mt-2 text-lg font-semibold text-slate-900">{productName}</h3>
        <p className="mt-1 text-sm text-slate-500">{note}</p>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl bg-slate-100 p-2">
        <img
          src={productImg}
          alt={productName}
          className="h-44 w-full rounded-lg object-cover"
          loading="lazy"
        />
      </div>
    </article>
  );
}

export function HeroPromoSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % promoSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const prev = () => setIndex((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);
  const next = () => setIndex((prev) => (prev + 1) % promoSlides.length);

  const active = promoSlides[index];

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Home Promo</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">Hero Promo Slider</h2>
        </div>
        <CarouselControls
          current={index}
          total={promoSlides.length}
          onPrev={prev}
          onNext={next}
          onSelect={setIndex}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.35fr_0.95fr] lg:items-stretch">
          <div className="order-2 lg:order-1">
            <ProductPanel {...active.left} />
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative h-[260px] overflow-hidden rounded-2xl sm:h-[340px] lg:h-full lg:min-h-[360px]">
              <img
                src={active.centerImg}
                alt="Animal promo"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="order-3 lg:order-3">
            <ProductPanel {...active.right} />
          </div>
        </div>
      </div>
    </section>
  );
}
