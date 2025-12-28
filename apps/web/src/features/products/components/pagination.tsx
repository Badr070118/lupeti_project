'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('shop');

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm shadow-sm">
      <span className="text-slate-500">
        {t('pagination', { page, totalPages })}
      </span>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t('prev')}
        </Button>
        <Button
          variant="ghost"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          {t('next')}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
