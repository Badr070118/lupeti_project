'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { wishlistService } from '@/services/wishlist.service';
import { addGuestWishlist } from '@/lib/guest-wishlist';

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const t = useTranslations('wishlist');
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!accessToken) {
      addGuestWishlist(productId);
      showToast({ title: t('added'), variant: 'success' });
      window.dispatchEvent(new Event('wishlist:updated'));
      return;
    }
    setLoading(true);
    try {
      await wishlistService.add(accessToken, productId);
      showToast({ title: t('added'), variant: 'success' });
      window.dispatchEvent(new Event('wishlist:updated'));
    } catch (error) {
      showToast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:text-rose-500 ${className ?? ''}`}
      onClick={handleClick}
      disabled={loading}
    >
      <Heart className="h-4 w-4" />
      {t('add')}
    </button>
  );
}
