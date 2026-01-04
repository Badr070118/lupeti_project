'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { useRouter } from '@/i18n/routing';
import { productService } from '@/services/product.service';
import type { Product } from '@/types';
import Image from 'next/image';
import { resolveProductImage } from '@/lib/product-images';

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
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('shop');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push({
      pathname: '/search',
      query: { search: query.trim() },
    });
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const term = query.trim();
    if (!open || term.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      productService
        .list({ search: term, limit: 6 })
        .then((res) => {
          if (!active) return;
          setSuggestions(res.data);
        })
        .catch(() => {
          if (!active) return;
          setSuggestions([]);
        })
        .finally(() => {
          if (!active) return;
          setLoading(false);
        });
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [open, query]);

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative" ref={wrapperRef}>
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false);
            }
          }}
          placeholder={t(placeholderKey)}
          className="soft-input pl-10"
          autoComplete="off"
        />
        {open && (loading || suggestions.length > 0) ? (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
            {loading ? (
              <div className="px-4 py-3 text-xs text-slate-500">
                Loading...
              </div>
            ) : (
              <ul className="py-2">
                {suggestions.map((product) => {
                  const cover = resolveProductImage(
                    product.slug,
                    product.images?.[0]?.url,
                  );
                  return (
                    <li key={product.id}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => {
                          setOpen(false);
                          router.push(`/product/${product.slug}`);
                        }}
                      >
                        <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-slate-100">
                          {cover ? (
                            <Image
                              src={cover}
                              alt={product.title}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 line-clamp-1">
                            {product.title}
                          </p>
                          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">
                            {product.category?.name}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : null}
      </div>
    </form>
  );
}
