'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { StoreSettings } from '@/types';
import { adminService } from '@/services/admin.service';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StoreFormState {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  supportAddress: string;
  shippingStandard: string;
  shippingExpress: string;
  currency: string;
  enableCheckout: boolean;
  enableSupport: boolean;
  paytrEnabled: boolean;
}

const toPrice = (value: number) => (value / 100).toFixed(2).replace(/\.00$/, '');
const toCents = (value: string) => Math.round(Number(value || 0) * 100);

export function AdminSettingsManager() {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const t = useTranslations('admin.settings');
  const [store, setStore] = useState<StoreSettings | null>(null);
  const [form, setForm] = useState<StoreFormState | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSettings = useCallback(() => {
    if (!accessToken) return;
    adminService
      .getSettings(accessToken)
      .then((res) => {
        setStore(res.store);
        setForm({
          storeName: res.store.storeName,
          supportEmail: res.store.supportEmail ?? '',
          supportPhone: res.store.supportPhone ?? '',
          supportAddress: res.store.supportAddress ?? '',
          shippingStandard: toPrice(res.store.shippingStandardCents),
          shippingExpress: toPrice(res.store.shippingExpressCents),
          currency: res.store.currency,
          enableCheckout: res.store.enableCheckout,
          enableSupport: res.store.enableSupport,
          paytrEnabled: res.store.paytrEnabled,
        });
      })
      .catch((error) =>
        showToast({
          title: t('loadError'),
          description: error instanceof Error ? error.message : t('genericError'),
          variant: 'error',
        }),
      );
  }, [accessToken, showToast, t]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken || !form) return;
    setLoading(true);
    try {
      const payload: Partial<StoreSettings> = {
        storeName: form.storeName,
        supportEmail: form.supportEmail || undefined,
        supportPhone: form.supportPhone || undefined,
        supportAddress: form.supportAddress || undefined,
        shippingStandardCents: toCents(form.shippingStandard),
        shippingExpressCents: toCents(form.shippingExpress),
        currency: form.currency,
        enableCheckout: form.enableCheckout,
        enableSupport: form.enableSupport,
        paytrEnabled: form.paytrEnabled,
      };
      const updated = await adminService.updateStoreSettings(accessToken, payload);
      setStore(updated);
      showToast({ title: t('updated'), variant: 'success' });
    } catch (error) {
      showToast({
        title: t('updateError'),
        description: error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!form || !store) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-500">
        {t('loading')}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form space-y-4">
      <div className="admin-form__section space-y-4">
        <p className="admin-form__heading">{t('store.title')}</p>
        <div className="admin-form__group">
          <label htmlFor="store-name" className="admin-form__label">
            {t('store.name')}
          </label>
          <Input
            id="store-name"
            className="soft-input"
            value={form.storeName}
            onChange={(event) =>
              setForm((prev) => (prev ? { ...prev, storeName: event.target.value } : prev))
            }
          />
        </div>
        <div className="admin-form__group">
          <label htmlFor="support-email" className="admin-form__label">
            {t('store.email')}
          </label>
          <Input
            id="support-email"
            className="soft-input"
            value={form.supportEmail}
            onChange={(event) =>
              setForm((prev) => (prev ? { ...prev, supportEmail: event.target.value } : prev))
            }
          />
        </div>
        <div className="admin-form__group">
          <label htmlFor="support-phone" className="admin-form__label">
            {t('store.phone')}
          </label>
          <Input
            id="support-phone"
            className="soft-input"
            value={form.supportPhone}
            onChange={(event) =>
              setForm((prev) => (prev ? { ...prev, supportPhone: event.target.value } : prev))
            }
          />
        </div>
        <div className="admin-form__group">
          <label htmlFor="support-address" className="admin-form__label">
            {t('store.address')}
          </label>
          <Input
            id="support-address"
            className="soft-input"
            value={form.supportAddress}
            onChange={(event) =>
              setForm((prev) => (prev ? { ...prev, supportAddress: event.target.value } : prev))
            }
          />
        </div>
      </div>

      <div className="admin-form__section space-y-4">
        <p className="admin-form__heading">{t('shipping.title')}</p>
        <div className="admin-form__grid">
          <div className="admin-form__group">
            <label htmlFor="shipping-standard" className="admin-form__label">
              {t('shipping.standard')}
            </label>
            <Input
              id="shipping-standard"
              className="soft-input"
              type="number"
              min="0"
              step="0.5"
              value={form.shippingStandard}
              onChange={(event) =>
                setForm((prev) =>
                  prev ? { ...prev, shippingStandard: event.target.value } : prev,
                )
              }
            />
          </div>
          <div className="admin-form__group">
            <label htmlFor="shipping-express" className="admin-form__label">
              {t('shipping.express')}
            </label>
            <Input
              id="shipping-express"
              className="soft-input"
              type="number"
              min="0"
              step="0.5"
              value={form.shippingExpress}
              onChange={(event) =>
                setForm((prev) =>
                  prev ? { ...prev, shippingExpress: event.target.value } : prev,
                )
              }
            />
          </div>
          <div className="admin-form__group">
            <label htmlFor="store-currency" className="admin-form__label">
              {t('shipping.currency')}
            </label>
            <Input
              id="store-currency"
              className="soft-input"
              value={form.currency}
              onChange={(event) =>
                setForm((prev) => (prev ? { ...prev, currency: event.target.value } : prev))
              }
            />
          </div>
        </div>
      </div>

      <div className="admin-form__section space-y-4">
        <p className="admin-form__heading">{t('features.title')}</p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.enableCheckout}
              onChange={(event) =>
                setForm((prev) => (prev ? { ...prev, enableCheckout: event.target.checked } : prev))
              }
            />
            {t('features.checkout')}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.enableSupport}
              onChange={(event) =>
                setForm((prev) => (prev ? { ...prev, enableSupport: event.target.checked } : prev))
              }
            />
            {t('features.support')}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.paytrEnabled}
              onChange={(event) =>
                setForm((prev) => (prev ? { ...prev, paytrEnabled: event.target.checked } : prev))
              }
            />
            {t('features.paytr')}
          </label>
        </div>
      </div>

      <Button type="submit" className="w-full" loading={loading}>
        {t('save')}
      </Button>
    </form>
  );
}
