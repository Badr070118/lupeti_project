'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { orderService } from '@/services/order.service';
import { paymentService } from '@/services/payment.service';
import type { Cart, CheckoutPayload } from '@/types';

interface CheckoutFormProps {
  cart: Cart | null;
  accessToken: string | null;
  onOrderCreated?: () => void;
}

const DEFAULT_ADDRESS = {
  line1: '',
  city: '',
  postalCode: '',
  country: 'TR',
};

export function CheckoutForm({
  cart,
  accessToken,
  onOrderCreated,
}: CheckoutFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState<Record<string, string>>(DEFAULT_ADDRESS);
  const { showToast } = useToast();
  const t = useTranslations('checkout');

  if (!accessToken) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
        <p className="font-semibold text-slate-900">{t('loginPrompt')}</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
        <p className="font-semibold text-slate-900">{t('empty')}</p>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload: CheckoutPayload = {
        shippingAddress: address,
        shippingMethod: 'STANDARD',
      };
      const order = await orderService.checkout(accessToken, payload);
      onOrderCreated?.();
      showToast({
        title: t('orderCreated'),
        variant: 'success',
      });
      const payment = await paymentService.initiatePaytr(accessToken, order.id);
      window.location.href = payment.iframeUrl;
    } catch (error) {
      showToast({
        title: t('failed'),
        description: error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="shipping-line1"
          name="line1"
          placeholder={t('address.line1')}
          required
          value={address.line1}
          onChange={(event) =>
            setAddress((prev) => ({ ...prev, line1: event.target.value }))
          }
          className="md:col-span-2"
        />
        <Input
          id="shipping-city"
          name="city"
          placeholder={t('address.city')}
          required
          value={address.city}
          onChange={(event) =>
            setAddress((prev) => ({ ...prev, city: event.target.value }))
          }
        />
        <Input
          id="shipping-postal"
          name="postalCode"
          placeholder={t('address.postalCode')}
          required
          value={address.postalCode}
          onChange={(event) =>
            setAddress((prev) => ({ ...prev, postalCode: event.target.value }))
          }
        />
        <Input
          id="shipping-country"
          name="country"
          placeholder={t('address.country')}
          required
          value={address.country}
          onChange={(event) =>
            setAddress((prev) => ({ ...prev, country: event.target.value }))
          }
        />
      </div>
      <Button type="submit" className="w-full" loading={submitting}>
        {t('submit')}
      </Button>
    </form>
  );
}
