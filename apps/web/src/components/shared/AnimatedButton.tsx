'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { hoverTransition } from '@/animations/transitions';

type AnimatedButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

const baseStyles =
  'inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

const variants: Record<NonNullable<AnimatedButtonProps['variant']>, string> = {
  primary:
    'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] focus-visible:ring-[var(--accent)]',
  secondary:
    'bg-white text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--primary)] focus-visible:ring-[var(--primary)]',
  ghost: 'bg-transparent text-white hover:text-[var(--accent)]',
};

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, variant = 'primary', ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.05, boxShadow: 'var(--shadow-hover)' }}
      whileTap={{ scale: 0.97 }}
      transition={hoverTransition}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  ),
);

AnimatedButton.displayName = 'AnimatedButton';
