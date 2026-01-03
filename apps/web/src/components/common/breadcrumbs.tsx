'use client';

import { Link } from '@/i18n/routing';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
      {items.map((item, index) => (
        <span key={item.href} className="flex items-center gap-2">
          <Link href={item.href} className="hover:text-rose-500">
            {item.label}
          </Link>
          {index < items.length - 1 ? <span>/</span> : null}
        </span>
      ))}
    </nav>
  );
}
