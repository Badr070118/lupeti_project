'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cartService } from '@/services/cart.service';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from '@/i18n/routing';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
}

export function AddToCartButton({
  productId,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { accessToken } = useAuth();
  const router = useRouter();
  const t = useTranslations('notifications');

  return (
    <Button
      className={className}
      loading={loading}
      onClick={async () => {
        if (!accessToken) {
          showToast({
            title: t('authRequired'),
            description: t('authHint'),
            variant: 'info',
          });
          router.push('/login');
          return;
        }
        setLoading(true);
        try {
          await cartService.addItem(accessToken, productId, quantity);
          showToast({
            title: t('addedToCart'),
            variant: 'success',
          });
          window.dispatchEvent(new Event('cart:updated'));
        } catch (error) {
          showToast({
            title: t('failedCart'),
            description:
              error instanceof Error ? error.message : t('genericError'),
            variant: 'error',
          });
        } finally {
          setLoading(false);
        }
      }}
    >
      {t('addToCartButton', { default: 'Add to cart' })}
    </Button>
  );
}
