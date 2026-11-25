'use client';

import Image from 'next/image';
import type { ComponentProps } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

type CategoryCardProps = {
  title: string;
  subtitle: string;
  image: string;
  link: ComponentProps<typeof Link>['href'];
  number: string;
};

export function CategoryCard({ title, subtitle, image, link, number }: CategoryCardProps) {
  return (
    <Link href={link} className="category-showcase__card">
      <Image src={image} alt="" fill sizes="(max-width: 700px) 88vw, 50vw" className="category-showcase__image" unoptimized={image.startsWith('/uploads/')} />
      <span className="category-showcase__shade" />
      <span className="category-showcase__number">{number} / 02</span>
      <span className="category-showcase__copy">
        <span className="category-showcase__label">{subtitle}</span>
        <span className="category-showcase__title">{title}</span>
        <span className="category-showcase__link">Seçkiyi keşfet <ArrowUpRight size={17} aria-hidden="true" /></span>
      </span>
    </Link>
  );
}
