'use client';

import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Cart, CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { cartService } from '@/services/cart.service';
import { useToast } from '@/hooks/use-toast';
import { Link } from '@/i18n/routing';
import { resolveProductImage } from '@/lib/product-images';

interface CartItemRowProps {
  item: CartItem;
  accessToken: string;
  onCartUpdated: (cart: Cart) => void;
}

export function CartItemRow({ item, accessToken, onCartUpdated }: CartItemRowProps) {
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const t = useTranslations('cart');

  const updateQty = async (quantity: number) => {
    setSaving(true);
    try {
      const cart = await cartService.updateItem(accessToken, item.id, quantity);
      onCartUpdated(cart);
    } catch (error) {
      showToast({
        title: t('updateErrorTitle'),
        description:
          error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async () => {
    setSaving(true);
    try {
      const cart = await cartService.removeItem(accessToken, item.id);
      onCartUpdated(cart);
    } catch (error) {
      showToast({
        title: t('removeErrorTitle'),
        description:
          error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const cover = resolveProductImage(item.product.slug, item.product.imageUrl);

  const unitPrice = item.product.pricing?.finalPriceCents ?? item.product.priceCents;
  const originalUnit = item.product.pricing?.originalPriceCents ?? item.product.priceCents;

  return (
    <div className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4">
      <Link
        href={{ pathname: '/product/[slug]', params: { slug: item.product.slug } }}
        className="relative h-24 w-24 overflow-hidden rounded-2xl"
      >
        {cover ? (
          <Image
            src={cover}
            alt={item.product.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100 text-xs text-slate-500">
            {item.product.title}
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 text-sm">
        <Link
          href={{ pathname: '/product/[slug]', params: { slug: item.product.slug } }}
          className="font-semibold text-slate-900 hover:text-rose-500"
        >
          {item.product.title}
        </Link>
        <p className="text-slate-500">{t('stockLabel', { count: item.product.stock })}</p>
        <div className="flex items-center gap-3">
          <label className="text-slate-500">
            {t('quantity')}
            <select
              className="ml-2 rounded-xl border border-slate-200 px-2 py-1 text-sm"
              value={item.quantity}
              disabled={saving}
              onChange={(event) => updateQty(Number(event.target.value))}
            >
              {Array.from({ length: 20 }).map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={removeItem}
            className="text-rose-500 hover:text-rose-600 disabled:opacity-50"
            disabled={saving}
            aria-label={t('removeItem')}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="text-base font-semibold text-slate-900">
          {formatPrice(unitPrice * item.quantity, item.product.currency)}
        </p>
        {unitPrice !== originalUnit && (
          <p className="text-xs text-slate-400 line-through">
            {formatPrice(originalUnit * item.quantity, item.product.currency)}
          </p>
        )}
      </div>
    </div>
  );
}
