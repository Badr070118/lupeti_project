'use client';

import { Bone, Fish, PawPrint, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SiteEntrySplash() {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const visibleDuration = reducedMotion ? 600 : 2100;
    const fadeDuration = reducedMotion ? 300 : 700;

    const fadeTimer = window.setTimeout(() => {
      setFadingOut(true);
    }, visibleDuration);

    const hideTimer = window.setTimeout(() => {
      setVisible(false);
    }, visibleDuration + fadeDuration);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(52,211,153,0.24),transparent_45%),linear-gradient(135deg,#020617,#0f172a,#111827)] px-4 transition-opacity duration-700 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      aria-label="Chargement de Lupeti"
      role="status"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-8 text-white shadow-[0_35px_80px_rgba(2,6,23,0.55)] backdrop-blur-xl">
        <div className="absolute -left-3 top-6 rounded-full bg-white/10 p-2 text-cyan-100 animate-[splash-float_2.8s_ease-in-out_infinite]">
          <Fish className="h-4 w-4" />
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-amber-100 animate-[splash-float_2.4s_ease-in-out_infinite_0.2s]">
          <Bone className="h-4 w-4" />
        </div>
        <div className="absolute right-2 top-16 rounded-full bg-white/10 p-2 text-emerald-100 animate-[splash-float_3s_ease-in-out_infinite_0.35s]">
          <ShoppingBag className="h-4 w-4" />
        </div>

        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300/30 to-emerald-300/30 ring-1 ring-white/30">
          <PawPrint className="h-10 w-10 text-white animate-[splash-pulse_1.8s_ease-in-out_infinite]" />
        </div>

        <p className="text-center text-[11px] uppercase tracking-[0.32em] text-cyan-100/90">
          Lupeti Shop
        </p>
        <h2 className="mt-2 text-center text-3xl font-extrabold tracking-wide">
          Bienvenue
        </h2>
        <p className="mt-3 text-center text-sm text-slate-200">
          Preparation de votre univers animaux et e-commerce...
        </p>

        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full origin-left bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 animate-[splash-loader_2.2s_ease-out_forwards]" />
        </div>
      </div>
    </div>
  );
}
