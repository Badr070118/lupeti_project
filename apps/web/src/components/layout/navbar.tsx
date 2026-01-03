'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { LanguageSwitcher } from '@/components/common/language-switcher';
import { Button } from '@/components/ui/button';
import { Link, usePathname } from '@/i18n/routing';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { MiniCart } from '@/components/common/mini-cart';
import { SearchBar } from '@/components/common/search-bar';

const NAV_ITEMS = [
  { href: '/', key: 'home' },
  { href: '/shop', key: 'shop' },
  { href: '/wishlist', key: 'wishlist' },
  { href: '/support', key: 'support' },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, accessToken, logout, loading } = useAuth();
  const t = useTranslations('nav');

  const renderNavLinks = (onNavigate?: () => void) =>
    NAV_ITEMS.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'transition hover:text-rose-500',
          pathname === item.href ? 'text-rose-500' : 'text-slate-700',
        )}
        onClick={onNavigate}
      >
        {t(item.key)}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            Lupeti<span className="text-rose-500">.</span>
          </Link>
        </div>

        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          {renderNavLinks()}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden w-64 md:block">
            <SearchBar />
          </div>
          <ThemeToggle />
          <LanguageSwitcher />
          <MiniCart />
          {user && accessToken ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href={user.role === 'ADMIN' ? '/admin' : '/account'}
                className="text-sm font-semibold text-slate-700 hover:text-rose-500"
              >
                {user.role === 'ADMIN' ? 'Admin' : t('account')}
              </Link>
              <Button variant="ghost" onClick={() => void logout()} disabled={loading}>
                {t('logout', { default: 'Logout' })}
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" asChild>
                <Link href="/login">{t('login')}</Link>
              </Button>
              <Button asChild>
                <Link href="/register">{t('register')}</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 shadow-lg md:hidden">
          <div className="flex flex-col gap-3 text-sm font-semibold text-slate-700">
            {renderNavLinks(() => setOpen(false))}
            <Link
              href={user ? '/account' : '/login'}
              className="rounded-lg px-2 py-1 hover:bg-rose-50 hover:text-rose-500"
              onClick={() => setOpen(false)}
            >
              {user ? t('account') : t('login')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
