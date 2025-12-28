import Link from 'next/link';
import { cn } from '@/lib/utils';

const categories = [
  {
    title: 'Functional Croquettes',
    copy: 'Omega-rich meals developed with veterinary nutritionists.',
    href: '/shop?category=croquettes',
    color: 'from-rose-100 to-white',
  },
  {
    title: 'Accessories',
    copy: 'Harnesses, bowls, beds and leashes built to last.',
    href: '/shop?category=accessories',
    color: 'from-sky-100 to-white',
  },
  {
    title: 'Wellness',
    copy: 'Supplements and rituals that support healthy coats.',
    href: '/shop?category=wellness',
    color: 'from-emerald-100 to-white',
  },
];

export function CategoryTiles() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {categories.map((cat) => (
        <Link
          key={cat.title}
          href={cat.href}
          className={cn(
            'rounded-3xl border border-slate-100 bg-gradient-to-br p-6 transition hover:-translate-y-1 hover:shadow-lg',
            cat.color,
          )}
        >
          <p className="text-lg font-semibold text-slate-900">{cat.title}</p>
          <p className="mt-2 text-sm text-slate-600">{cat.copy}</p>
        </Link>
      ))}
    </div>
  );
}
