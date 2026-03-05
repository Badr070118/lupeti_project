'use client';

import { ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  asChild?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
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
        'inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        variant === 'primary' &&
          'bg-rose-500 text-white hover:bg-rose-600 focus-visible:outline-rose-500',
        variant === 'secondary' &&
          'bg-rose-100 text-rose-700 hover:bg-rose-200 focus-visible:outline-rose-300',
        variant === 'ghost' &&
          'bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:outline-slate-300',
        (disabled || loading) && 'cursor-not-allowed opacity-60',
        className,
      )}
      {...props}
      {...(asChild ? {} : { disabled: disabled || loading })}
    >
      {loading ? 'Please wait...' : children}
    </Component>
  );
}
