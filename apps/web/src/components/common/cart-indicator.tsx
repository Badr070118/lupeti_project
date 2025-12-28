'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cartService } from '@/services/cart.service';
import { useAuth } from '@/hooks/use-auth';
import { Link } from '@/i18n/routing';

export function CartIndicator() {
  const [qty, setQty] = useState(0);
  const { accessToken } = useAuth();
  const t = useTranslations('nav');

  useEffect(() => {
    let active = true;
    const fetchCart = () => {
      if (!accessToken) {
        setQty(0);
        return;
      }
      cartService
        .getCart(accessToken)
        .then((cart) => {
          if (!active) return;
          const totalItems = cart.items.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          setQty(totalItems);
        })
        .catch(() => {
          if (active) setQty(0);
        });
    };

    fetchCart();
    const handler = () => fetchCart();
    window.addEventListener('cart:updated', handler);

    return () => {
      active = false;
      window.removeEventListener('cart:updated', handler);
    };
  }, [accessToken]);

  return (
    <Link
      href="/cart"
      className="relative inline-flex rounded-full bg-slate-900 p-2 text-white transition hover:bg-slate-800"
      aria-label={t('cart')}
    >
      <ShoppingBag className="h-5 w-5" />
      {qty > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] justify-center rounded-full bg-rose-500 px-1 text-xs font-semibold">
          {qty}
        </span>
      )}
    </Link>
  );
}
