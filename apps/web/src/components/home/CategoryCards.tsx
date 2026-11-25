'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { categoryImage } from '@/lib/homepage-images';
import { CategoryCard } from './CategoryCard';
import '@/styles/category-showcase.css';

type CategoryCardsProps = {
  dogImageUrl?: string | null;
  catImageUrl?: string | null;
};

export function CategoryCards({ dogImageUrl, catImageUrl }: CategoryCardsProps) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.section
      className="category-showcase"
      aria-labelledby="category-showcase-title"
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65 }}
    >
      <div className="category-showcase__heading">
        <div>
          <p className="category-showcase__eyebrow"><span /> Lupeti seçkisi</p>
          <h2 id="category-showcase-title">Dostlarınız için<br /><em>en iyisini seçiyoruz.</em></h2>
        </div>
        <div className="category-showcase__intro">
          <p>Mutlu anları için ihtiyaç duydukları her şey.</p>
          <Link href="/shop">Mağazayı keşfet <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </div>
      <div className="category-showcase__grid">
        <CategoryCard title="Köpekler" subtitle="Neşeli anları için" number="01" image={categoryImage(dogImageUrl, 'dog')} link={{ pathname: '/category/[slug]', params: { slug: 'dog' } }} />
        <CategoryCard title="Kediler" subtitle="Günlük rutinleri için" number="02" image={categoryImage(catImageUrl, 'cat')} link={{ pathname: '/category/[slug]', params: { slug: 'cat' } }} />
      </div>
      <p className="category-showcase__mobile-hint" aria-hidden="true">Keşfetmek için kaydırın <ArrowRight size={15} /></p>
    </motion.section>
  );
}
