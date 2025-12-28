'use client';

import { ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  asChild?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  loading,
  children,
  disabled,
  asChild,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        variant === 'primary' &&
          'bg-rose-500 text-white hover:bg-rose-600 focus-visible:outline-rose-500',
        variant === 'secondary' &&
          'bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900',
        variant === 'ghost' &&
          'bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:outline-slate-300',
        (disabled || loading) && 'cursor-not-allowed opacity-60',
        className,
      )}
      {...props}
      {...(asChild ? {} : { disabled: disabled || loading })}
    >
      {loading ? 'Please wait…' : children}
    </Component>
  );
}
