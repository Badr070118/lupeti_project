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
          <p className="category-showcase__eyebrow"><span /> La sélection Lupeti</p>
          <h2 id="category-showcase-title">Pour eux,<br /><em>on choisit le meilleur.</em></h2>
        </div>
        <div className="category-showcase__intro">
          <p>Tout ce qu’il faut pour leurs petits et grands moments de bonheur.</p>
          <Link href="/shop">Découvrir la boutique <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </div>
      <div className="category-showcase__grid">
        <CategoryCard title="Chiens" subtitle="Pour leur joie de vivre" number="01" image={categoryImage(dogImageUrl, 'dog')} link={{ pathname: '/category/[slug]', params: { slug: 'dog' } }} />
        <CategoryCard title="Chats" subtitle="Pour leurs petits rituels" number="02" image={categoryImage(catImageUrl, 'cat')} link={{ pathname: '/category/[slug]', params: { slug: 'cat' } }} />
      </div>
      <p className="category-showcase__mobile-hint" aria-hidden="true">Glisser pour découvrir <ArrowRight size={15} /></p>
    </motion.section>
  );
}
