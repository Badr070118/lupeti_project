'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cartService } from '@/services/cart.service';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { addGuestItem } from '@/lib/guest-cart';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
  disabled?: boolean;
  disabledLabel?: string;
}

export function AddToCartButton({
  productId,
  quantity = 1,
  className,
  disabled = false,
  disabledLabel,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { accessToken } = useAuth();
  const t = useTranslations('notifications');

  return (
    <Button
      className={className}
      loading={loading}
      disabled={disabled || loading}
      onClick={async () => {
        if (disabled) return;
        if (!accessToken) {
          addGuestItem(productId, quantity);
          showToast({
            title: t('addedToCart'),
            variant: 'success',
          });
          window.dispatchEvent(new Event('cart:updated'));
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
      {disabled
        ? disabledLabel ?? t('outOfStock', { default: 'Out of stock' })
        : t('addToCartButton', { default: 'Add to cart' })}
    </Button>
  );
}
