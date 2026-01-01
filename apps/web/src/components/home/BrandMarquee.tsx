'use client';

import { motion } from 'framer-motion';
import { marqueeVariants } from '@/animations/variants';
import { useTranslations } from 'next-intl';

const brands = [
  'Acana',
  'Orijen',
  'Brit Care',
  'Farmina',
  'Royal Canin',
  'Purina Pro Plan',
  'Hill’s Science Plan',
];

const duplicated = [...brands, ...brands];

export function BrandMarquee() {
  const t = useTranslations('home.marquee');

  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-50 to-white py-12">
      <h2 className="mb-8 text-center text-2xl font-semibold text-slate-800">
        {t('title')}
      </h2>
      <div className="relative">
        <motion.div
          className="flex items-center gap-12"
          variants={marqueeVariants}
          initial={false}
          animate="animate"
        >
          {duplicated.map((brand, index) => (
            <motion.div
              key={`${brand}-${index}`}
              whileHover={{ scale: 1.1 }}
              className="flex h-16 min-w-[140px] items-center justify-center rounded-2xl bg-white px-6 text-lg font-semibold text-slate-500 shadow-sm"
            >
              {brand}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
