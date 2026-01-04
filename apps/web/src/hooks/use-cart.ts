'use client';

import { useCallback, useEffect, useState } from 'react';
import { cartService } from '@/services/cart.service';
import { productService } from '@/services/product.service';
import type { Cart, CartItem, CartProductSummary, Product } from '@/types';
import {
  addGuestItem,
  clearGuestCart,
  getGuestCart,
  removeGuestItem,
  saveGuestCart,
  updateGuestItem,
} from '@/lib/guest-cart';

function mapProductSummary(product: Product): CartProductSummary {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    priceCents: product.priceCents,
    originalPriceCents: product.originalPriceCents,
    currency: product.currency,
    stock: product.stock,
    isActive: product.isActive,
    pricing: product.pricing,
    imageUrl: product.images?.[0]?.url,
  };
}

async function hydrateGuestCart(): Promise<Cart | null> {
  const raw = getGuestCart();
  if (!raw.items.length) {
    return {
      id: raw.id,
      userId: 'guest',
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      items: [],
    };
  }

  const products = await productService.lookup(
    raw.items.map((item) => item.productId),
  );
  const safeProducts = Array.isArray(products) ? products : [];
  const productMap = new Map(
    safeProducts.map((product) => [product.id, product]),
  );

  const items: CartItem[] = [];
  const validIds = new Set<string>();

  for (const item of raw.items) {
    const product = productMap.get(item.productId);
    if (!product) continue;
    validIds.add(item.productId);
    items.push({
      id: item.productId,
      productId: item.productId,
      quantity: item.quantity,
      createdAt: item.addedAt,
      product: mapProductSummary(product),
    });
  }

  if (validIds.size !== raw.items.length) {
    saveGuestCart({
      ...raw,
      items: raw.items.filter((item) => validIds.has(item.productId)),
    });
  }

  return {
    id: raw.id,
    userId: 'guest',
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    items,
  };
}

export function useCart(accessToken: string | null) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (!accessToken) {
        const guestCart = await hydrateGuestCart();
        setCart(guestCart);
        return;
      }
      const data = await cartService.getCart(accessToken);
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = () => {
      void refresh();
    };
    window.addEventListener('cart:updated', handler);
    return () => {
      window.removeEventListener('cart:updated', handler);
    };
  }, [refresh]);

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      if (!accessToken) {
        addGuestItem(productId, quantity);
        await refresh();
        return;
      }
      const updated = await cartService.addItem(accessToken, productId, quantity);
      setCart(updated);
    },
    [accessToken, refresh],
  );

  const updateItem = useCallback(
    async (productId: string, quantity: number) => {
      if (!accessToken) {
        updateGuestItem(productId, quantity);
        await refresh();
        return;
      }
      if (!cart?.items) return;
      const target = cart.items.find((item) => item.id === productId || item.productId === productId);
      if (!target) return;
      const updated = await cartService.updateItem(accessToken, target.id, quantity);
      setCart(updated);
    },
    [accessToken, cart, refresh],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!accessToken) {
        removeGuestItem(productId);
        await refresh();
        return;
      }
      if (!cart?.items) return;
      const target = cart.items.find((item) => item.id === productId || item.productId === productId);
      if (!target) return;
      const updated = await cartService.removeItem(accessToken, target.id);
      setCart(updated);
    },
    [accessToken, cart, refresh],
  );

  const clearCart = useCallback(async () => {
    if (!accessToken) {
      clearGuestCart();
      await refresh();
      return;
    }
    const updated = await cartService.clearCart(accessToken);
    setCart(updated);
  }, [accessToken, refresh]);

  return { cart, setCart, loading, refresh, addItem, updateItem, removeItem, clearCart };
}
