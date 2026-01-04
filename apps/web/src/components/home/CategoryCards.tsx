'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

type CategoryCardsProps = {
  dogImageUrl?: string | null;
  catImageUrl?: string | null;
};

export function CategoryCards({ dogImageUrl, catImageUrl }: CategoryCardsProps) {
  const router = useRouter();
  const categories = [
    {
      type: 'dog',
      title: 'Pour Chiens',
      image: dogImageUrl ?? '/images/hero/dog.jpg',
      color: 'from-[var(--dog-color)]/80',
      icon: 'DOG',
      href: '/category/dog',
    },
    {
      type: 'cat',
      title: 'Pour Chats',
      image: catImageUrl ?? '/images/hero/cat.jpg',
      color: 'from-[var(--cat-color)]/80',
      icon: 'CAT',
      href: '/category/cat',
    },
  ];

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
            alt={category.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${category.color} to-transparent`} />
          <div className="absolute bottom-8 left-8 space-y-3 text-white">
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl"
            >
              {category.icon}
            </motion.span>
            <h3 className="text-3xl font-bold">{category.title}</h3>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 120 }}
              viewport={{ once: true }}
              className="h-1 bg-white"
            />
            <p className="text-sm uppercase tracking-wide text-white/80">
              Voir la selection
            </p>
          </div>
        </motion.button>
      ))}
    </section>
  );
}
