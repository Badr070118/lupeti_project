'use client';

import { ReactNode, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin', key: 'dashboard' },
  { href: '/admin/products', key: 'products' },
  { href: '/admin/users', key: 'users' },
  { href: '/admin/support', key: 'support' },
] as const;

interface AdminShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

function ShellCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
      {children}
    </div>
  );
}

export function AdminShell({ title, description, children }: AdminShellProps) {
  const { user, accessToken, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('admin');

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (!user || loading) {
    return (
      <ShellCard>
        <p className="font-semibold text-slate-900">{t('loading')}</p>
      </ShellCard>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <ShellCard>
        <p className="font-semibold text-rose-600">{t('denied')}</p>
        <Button className="mt-4" asChild>
          <Link href="/">{t('backHome')}</Link>
        </Button>
      </ShellCard>
    );
  }

  if (!accessToken) {
    return (
      <ShellCard>
        <p className="font-semibold text-slate-900">{t('loginPrompt')}</p>
        <Button className="mt-4" asChild>
          <Link href="/login">{t('loginCta')}</Link>
        </Button>
      </ShellCard>
    );
  }

  return (
    <div className="admin-shell space-y-6">
      <div className="admin-shell__header space-y-2">
        <p>{t('title')}</p>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">{title}</h1>
        {description && <p className="text-sm text-[color:var(--muted)]">{description}</p>}
      </div>
      <nav className="admin-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn('admin-tab', pathname === item.href && 'active')}
          >
            {t(`nav.${item.key}`)}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
