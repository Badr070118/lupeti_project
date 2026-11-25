'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react';
import { petProductCards } from '@/data/homeSliders';
import { CarouselControls } from '@/components/home/CarouselControls';

function resolveCardsPerView(width: number) {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 4;
}

export function PetProductCarousel() {
  const [cardsPerView, setCardsPerView] = useState(4);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const update = () => setCardsPerView(resolveCardsPerView(window.innerWidth));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(petProductCards.length / cardsPerView)),
    [cardsPerView],
  );
  const activePage = Math.min(page, totalPages - 1);

  useEffect(() => {
    const timer = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 4500);

    return () => clearInterval(timer);
  }, [totalPages]);

  const prev = () => setPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  const next = () => setPage((prevPage) => (prevPage + 1) % totalPages);

  const trackWidth = `${(petProductCards.length / cardsPerView) * 100}%`;
  const cardWidth = `${100 / petProductCards.length}%`;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Yeni seçkiler</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">Evcil hayvan ürünleri slaytları</h2>
        </div>
        <CarouselControls
          current={activePage}
          total={totalPages}
          onPrev={prev}
          onNext={next}
          onSelect={setPage}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              width: trackWidth,
              transform: `translateX(-${activePage * 100}%)`,
            }}
          >
            {petProductCards.map((card) => (
              <article
                key={card.id}
                className="snap-start p-2"
                style={{ width: cardWidth }}
              >
                <div className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="relative h-40 overflow-hidden bg-slate-100">
                    <img
                      src={card.petImg}
                      alt={card.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                      {card.tag}
                    </span>
                  </div>

                  <div className="p-3">
                    <div className="mb-3 overflow-hidden rounded-lg bg-slate-100 p-1.5">
                      <img
                        src={card.productImg}
                        alt={card.title}
                        className="h-28 w-full rounded-md object-cover"
                        loading="lazy"
                      />
                    </div>

                    <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">{card.title}</h3>
                    <p className="mt-1 text-lg font-bold text-rose-600">{card.price}</p>

                    <button
                      type="button"
                      className="mt-3 w-full rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
                    >
                      Ürünü gör
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
