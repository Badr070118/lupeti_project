'use client';

import { FormEvent, useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { useRouter } from '@/i18n/routing';

interface SearchBarProps {
  initialQuery?: string;
  className?: string;
  placeholderKey?: string;
}

export function SearchBar({
  initialQuery = '',
  className,
  placeholderKey = 'searchPlaceholder',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const t = useTranslations('shop');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push({
      pathname: '/search',
      query: { search: query.trim() },
    });
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t(placeholderKey)}
          className="soft-input pl-10"
        />
      </div>
    </form>
  );
}
