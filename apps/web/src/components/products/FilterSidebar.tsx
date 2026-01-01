'use client';

import { motion } from 'framer-motion';

type Option = {
  label: string;
  value: string;
};

type FilterSidebarProps = {
  active: string;
  options: Option[];
  onChange: (value: string) => void;
};

export function FilterSidebar({ active, options, onChange }: FilterSidebarProps) {
  return (
    <div className="flex flex-wrap gap-3 md:flex-col">
      {options.map((option) => {
        const isActive = option.value === active;
        return (
          <motion.button
            key={option.value}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className={[
              'rounded-full border px-4 py-2 text-sm font-semibold transition',
              isActive
                ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                : 'border-transparent bg-white text-slate-500 hover:border-[var(--primary-light)]',
            ].join(' ')}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
}
