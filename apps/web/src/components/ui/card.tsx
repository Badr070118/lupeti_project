'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
