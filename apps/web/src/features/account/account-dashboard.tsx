'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Address, AddressType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useOrders } from '@/hooks/use-orders';
import { OrderList } from '@/features/orders/order-list';
import { accountService } from '@/services/account.service';
import { useToast } from '@/hooks/use-toast';
import { Link } from '@/i18n/routing';

const EMPTY_ADDRESS: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  label: '',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'TR',
  type: 'SHIPPING',
  isDefault: false,
};

export function AccountDashboard() {
  const { user, accessToken, loading, refresh } = useAuth();
  const { orders, loading: ordersLoading, refresh: refreshOrders } = useOrders(accessToken);
  const { showToast } = useToast();
  const t = useTranslations('account');
  const [profileName, setProfileName] = useState(user?.name ?? '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const loadAddresses = useCallback(async () => {
    if (!accessToken) return;
    setLoadingAddresses(true);
    try {
      const data = await accountService.listAddresses(accessToken);
      setAddresses(data);
    } finally {
      setLoadingAddresses(false);
    }
  }, [accessToken]);

  useEffect(() => {
    setProfileName(user?.name ?? '');
  }, [user?.name]);

  useEffect(() => {
    void loadAddresses();
  }, [loadAddresses]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        {t('loading')}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">{t('loginPrompt')}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button asChild>
            <Link href="/login">{t('login')}</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/register">{t('register')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const submitProfile = async () => {
    if (!accessToken) return;
    setSavingProfile(true);
    try {
      await accountService.updateProfile(accessToken, { name: profileName });
      await refresh();
      showToast({ title: t('profileSaved'), variant: 'success' });
    } catch (error) {
      showToast({
        title: t('profileError'),
        description: error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const submitAddress = async () => {
    if (!accessToken) return;
    if (
      !addressForm.fullName ||
      !addressForm.line1 ||
      !addressForm.city ||
      !addressForm.postalCode ||
      !addressForm.country
    ) {
      showToast({
        title: t('addressMissing'),
        variant: 'error',
      });
      return;
    }
    try {
      if (editingId) {
        await accountService.updateAddress(accessToken, editingId, addressForm);
      } else {
        await accountService.createAddress(accessToken, addressForm);
      }
      setAddressForm(EMPTY_ADDRESS);
      setEditingId(null);
      await loadAddresses();
      showToast({ title: t('addressSaved'), variant: 'success' });
    } catch (error) {
      showToast({
        title: t('addressError'),
        description: error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    }
  };

  const editAddress = (address: Address) => {
    setEditingId(address.id);
    setAddressForm({
      label: address.label ?? '',
      fullName: address.fullName ?? '',
      phone: address.phone ?? '',
      line1: address.line1,
      line2: address.line2 ?? '',
      city: address.city,
      state: address.state ?? '',
      postalCode: address.postalCode,
      country: address.country,
      type: address.type,
      isDefault: address.isDefault,
    });
  };

  const removeAddress = async (id: string) => {
    if (!accessToken) return;
    if (!window.confirm(t('confirmRemoveAddress'))) return;
    try {
      await accountService.removeAddress(accessToken, id);
      await loadAddresses();
      showToast({ title: t('addressRemoved'), variant: 'success' });
    } catch (error) {
      showToast({
        title: t('addressError'),
        description: error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-wide text-slate-400">{t('title')}</p>
        <h1 className="text-3xl font-bold text-slate-900">
          {t('greeting', { email: user.email })}
        </h1>
        <p className="text-sm text-slate-500">{t('subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-lg font-semibold text-slate-900">{t('profileTitle')}</p>
          <div className="mt-4 space-y-3">
            <Input value={user.email} disabled className="soft-input" />
            <Input
              value={profileName}
              onChange={(event) => setProfileName(event.target.value)}
              placeholder={t('profileName')}
              className="soft-input"
            />
            <Button onClick={submitProfile} loading={savingProfile}>
              {t('profileSave')}
            </Button>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-lg font-semibold text-slate-900">{t('addressesTitle')}</p>
          {loadingAddresses ? (
            <p className="mt-3 text-sm text-slate-500">{t('loadingAddresses')}</p>
          ) : addresses.length ? (
            <div className="mt-4 space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-2xl border border-slate-100 p-4 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {address.label ?? t('addressLabelFallback')}
                      </p>
                      <p className="text-slate-500">
                        {address.line1}, {address.city}
                      </p>
                    </div>
                    {address.isDefault ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {t('default')}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="ghost" onClick={() => editAddress(address)}>
                      {t('edit')}
                    </Button>
                    <Button variant="ghost" onClick={() => removeAddress(address.id)}>
                      {t('remove')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">{t('noAddresses')}</p>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-lg font-semibold text-slate-900">{t('addressFormTitle')}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            value={addressForm.label ?? ''}
            onChange={(event) =>
              setAddressForm((prev) => ({ ...prev, label: event.target.value }))
            }
            placeholder={t('addressLabel')}
            className="soft-input"
          />
          <Input
            value={addressForm.fullName ?? ''}
            onChange={(event) =>
              setAddressForm((prev) => ({ ...prev, fullName: event.target.value }))
            }
            placeholder={t('addressFullName')}
            className="soft-input"
          />
          <Input
            value={addressForm.phone ?? ''}
            onChange={(event) =>
              setAddressForm((prev) => ({ ...prev, phone: event.target.value }))
            }
            placeholder={t('addressPhone')}
            className="soft-input"
          />
          <Select
            value={addressForm.type}
            onChange={(event) =>
              setAddressForm((prev) => ({
                ...prev,
                type: event.target.value as AddressType,
              }))
            }
            className="soft-input"
          >
            <option value="SHIPPING">{t('addressType.shipping')}</option>
            <option value="BILLING">{t('addressType.billing')}</option>
            <option value="BOTH">{t('addressType.both')}</option>
          </Select>
          <Input
            value={addressForm.line1}
            onChange={(event) =>
              setAddressForm((prev) => ({ ...prev, line1: event.target.value }))
            }
            placeholder={t('addressLine1')}
            className="soft-input md:col-span-2"
          />
          <Input
            value={addressForm.line2 ?? ''}
            onChange={(event) =>
              setAddressForm((prev) => ({ ...prev, line2: event.target.value }))
            }
            placeholder={t('addressLine2')}
            className="soft-input md:col-span-2"
          />
          <Input
            value={addressForm.city}
            onChange={(event) =>
              setAddressForm((prev) => ({ ...prev, city: event.target.value }))
            }
            placeholder={t('addressCity')}
            className="soft-input"
          />
          <Input
            value={addressForm.state ?? ''}
            onChange={(event) =>
              setAddressForm((prev) => ({ ...prev, state: event.target.value }))
            }
            placeholder={t('addressState')}
            className="soft-input"
          />
          <Input
            value={addressForm.postalCode}
            onChange={(event) =>
              setAddressForm((prev) => ({ ...prev, postalCode: event.target.value }))
            }
            placeholder={t('addressPostal')}
            className="soft-input"
          />
          <Input
            value={addressForm.country}
            onChange={(event) =>
              setAddressForm((prev) => ({ ...prev, country: event.target.value }))
            }
            placeholder={t('addressCountry')}
            className="soft-input"
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(event) =>
                setAddressForm((prev) => ({ ...prev, isDefault: event.target.checked }))
              }
            />
            {t('addressDefault')}
          </label>
          <Button onClick={submitAddress}>
            {editingId ? t('addressUpdate') : t('addressAdd')}
          </Button>
          {editingId ? (
            <Button
              variant="ghost"
              onClick={() => {
                setEditingId(null);
                setAddressForm(EMPTY_ADDRESS);
              }}
            >
              {t('cancel')}
            </Button>
          ) : null}
        </div>
      </div>

      {ordersLoading ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
          {t('loadingOrders')}
        </div>
      ) : (
        <OrderList orders={orders} />
      )}
      <Button variant="ghost" onClick={refreshOrders}>
        {t('refresh')}
      </Button>
    </div>
  );
}
