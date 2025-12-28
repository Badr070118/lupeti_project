'use client';

import { useCallback, useEffect, useState } from 'react';
import { cartService } from '@/services/cart.service';
import type { Cart } from '@/types';

export function useCart(accessToken: string | null) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!accessToken) {
      setCart(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.getCart(accessToken);
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { cart, setCart, loading, refresh };
}
