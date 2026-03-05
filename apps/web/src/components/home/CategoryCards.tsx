'use client';

import type { ComponentProps } from 'react';
import { Link } from '@/i18n/routing';
import { CategoryCard } from './CategoryCard';

type CategoryCardsProps = {
  dogImageUrl?: string | null;
  catImageUrl?: string | null;
};

type CategoryLink = ComponentProps<typeof Link>['href'];
type CategoryConfig = {
  type: string;
  title: string;
  subtitle: string;
  image: string;
  link: CategoryLink;
};

export function CategoryCards({ dogImageUrl, catImageUrl }: CategoryCardsProps) {
  const categories: CategoryConfig[] = [
    {
      type: 'dog',
      title: 'DOG',
      subtitle: 'Pour Chiens',
      image: dogImageUrl ?? '/images/hero/dog.jpg',
      link: { pathname: '/category/[slug]' as const, params: { slug: 'dog' } },
    },
    {
      type: 'cat',
      title: 'CAT',
      subtitle: 'Pour Chats',
      image: catImageUrl ?? '/images/hero/cat.jpg',
      link: { pathname: '/category/[slug]' as const, params: { slug: 'cat' } },
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {categories.map((category) => (
        <CategoryCard
          key={category.type}
          title={category.title}
          subtitle={category.subtitle}
          image={category.image}
          link={category.link}
        />
      ))}
    </section>
  );
}
