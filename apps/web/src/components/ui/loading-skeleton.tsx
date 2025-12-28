'use client';

import { cn } from '@/lib/utils';

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-700/60',
        className,
      )}
    />
  );
}
