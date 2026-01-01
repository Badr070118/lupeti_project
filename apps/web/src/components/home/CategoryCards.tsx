'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const categories = [
  {
    type: 'dog',
    image: '/images/hero/dog.jpg',
    color: 'from-[var(--dog-color)]/80',
    icon: '🐕',
    href: '/shop?category=dogs',
  },
  {
    type: 'cat',
    image: '/images/hero/cat.jpg',
    color: 'from-[var(--cat-color)]/80',
    icon: '🐈',
    href: '/shop?category=cats',
  },
];

export function CategoryCards() {
  const router = useRouter();
  const t = useTranslations('home.categoryCards');

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {categories.map((category) => (
        <motion.button
          key={category.type}
          type="button"
          onClick={() => router.push(category.href)}
          whileHover={{ scale: 1.02 }}
          className="group relative h-[380px] overflow-hidden rounded-3xl text-left"
        >
          <Image
            src={category.image}
            alt={t(`cards.${category.type}.title`)}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />
          <div
            className={`category-card-overlay absolute inset-0 bg-gradient-to-t ${category.color} to-transparent`}
          />
          <div className="absolute bottom-8 left-8 space-y-3 text-white">
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl"
            >
              {category.icon}
            </motion.span>
            <h3 className="text-3xl font-bold">{t(`cards.${category.type}.title`)}</h3>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 120 }}
              viewport={{ once: true }}
              className="h-1 bg-white"
            />
            <p className="text-sm uppercase tracking-wide text-white/80">
              {t(`cards.${category.type}.cta`)}
            </p>
          </div>
        </motion.button>
      ))}
    </section>
  );
}
