'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Badge({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-500',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
