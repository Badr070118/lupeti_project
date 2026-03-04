'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselControlsProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect?: (index: number) => void;
  className?: string;
}

export function CarouselControls({
  current,
  total,
  onPrev,
  onNext,
  onSelect,
  className = '',
}: CarouselControlsProps) {
  if (total <= 0) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <button
        type="button"
        onClick={onPrev}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, index) => {
          const active = index === current;
          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect?.(index)}
              className={`h-2.5 rounded-full transition ${active ? 'w-6 bg-rose-500' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
