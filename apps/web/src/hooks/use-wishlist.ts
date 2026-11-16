'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Product, WishlistItem } from '@/types';
import { wishlistService } from '@/services/wishlist.service';
import { productService } from '@/services/product.service';
import {
  addGuestWishlist,
  getGuestWishlist,
  removeGuestWishlist,
} from '@/lib/guest-wishlist';

function buildGuestItems(products: Product[]): WishlistItem[] {
  return products.map((product) => ({
    id: product.id,
    productId: product.id,
    userId: 'guest',
    createdAt: new Date().toISOString(),
    product,
  }));
}

export function useWishlist(accessToken: string | null) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedToken, setResolvedToken] = useState<string | null | undefined>(undefined);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (!accessToken) {
        const guest = getGuestWishlist();
        const products = await productService.lookup(guest.productIds);
        setItems(buildGuestItems(products));
        return;
      }
      const data = await wishlistService.list(accessToken);
      setItems(data);
    } finally {
      setResolvedToken(accessToken);
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    let active = true;
    const request = accessToken
      ? wishlistService.list(accessToken)
      : productService.lookup(getGuestWishlist().productIds).then(buildGuestItems);
    request.then((data) => { if (active) setItems(data); })
      .catch(() => { if (active) setItems([]); })
      .finally(() => { if (active) { setResolvedToken(accessToken); setLoading(false); } });
    return () => { active = false; };
  }, [accessToken]);

  const addItem = useCallback(
    async (productId: string) => {
      if (!accessToken) {
        addGuestWishlist(productId);
        await refresh();
        return;
      }
      await wishlistService.add(accessToken, productId);
      await refresh();
    },
    [accessToken, refresh],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!accessToken) {
        removeGuestWishlist(productId);
        await refresh();
        return;
      }
      await wishlistService.remove(accessToken, productId);
      await refresh();
    },
    [accessToken, refresh],
  );

  return { items: resolvedToken === accessToken ? items : [], loading: loading || resolvedToken !== accessToken, refresh, addItem, removeItem };
}
