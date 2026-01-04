'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import type { Address, Cart, PaymentProvider, ShippingAddress } from '@/types';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { settingsService } from '@/services/settings.service';
import { orderService } from '@/services/order.service';
import { paymentService } from '@/services/payment.service';
import { accountService } from '@/services/account.service';
import { CheckoutSteps } from './components/checkout-steps';

interface CheckoutFlowProps {
  cart: Cart | null;
  accessToken: string | null;
  onOrderCreated?: () => void;
}

const EMPTY_ADDRESS: ShippingAddress = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'TR',
};

export function CheckoutFlow({ cart, accessToken, onOrderCreated }: CheckoutFlowProps) {
  const t = useTranslations('checkout');
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [shippingMethod, setShippingMethod] = useState<'STANDARD' | 'EXPRESS'>(
    'STANDARD',
  );
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>('COD');
  const [shippingStandardCents, setShippingStandardCents] = useState(0);
  const [shippingExpressCents, setShippingExpressCents] = useState(0);
  const [paytrEnabled, setPaytrEnabled] = useState(true);
  const [paytrIframeUrl, setPaytrIframeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canProceedFromAddress = Boolean(
    address.fullName &&
      address.line1 &&
      address.city &&
      address.postalCode &&
      address.country,
  );

  useEffect(() => {
    settingsService
      .getPublic()
      .then((settings) => {
        setShippingStandardCents(settings.store.shippingStandardCents);
        setShippingExpressCents(settings.store.shippingExpressCents);
        setPaytrEnabled(settings.store.paytrEnabled);
      })
      .catch(() => {
        setShippingStandardCents(0);
        setShippingExpressCents(0);
        setPaytrEnabled(true);
      });
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    accountService
      .listAddresses(accessToken)
      .then((items) => {
        setAddresses(items);
        const defaultAddress = items.find((item) => item.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setAddress({
            fullName: defaultAddress.fullName ?? '',
            phone: defaultAddress.phone ?? '',
            line1: defaultAddress.line1,
            line2: defaultAddress.line2 ?? '',
            city: defaultAddress.city,
            state: defaultAddress.state ?? '',
            postalCode: defaultAddress.postalCode,
            country: defaultAddress.country,
          });
        }
      })
      .catch(() => {});
  }, [accessToken]);

  useEffect(() => {
    if (selectedAddressId === 'new') {
      return;
    }
    const selected = addresses.find((item) => item.id === selectedAddressId);
    if (!selected) return;
    setAddress({
      fullName: selected.fullName ?? '',
      phone: selected.phone ?? '',
      line1: selected.line1,
      line2: selected.line2 ?? '',
      city: selected.city,
      state: selected.state ?? '',
      postalCode: selected.postalCode,
      country: selected.country,
    });
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (paymentProvider !== 'PAYTR' && paytrIframeUrl) {
      setPaytrIframeUrl(null);
    }
  }, [paymentProvider, paytrIframeUrl]);

  const unavailableItems = useMemo(() => {
    if (!cart) return [];
    return cart.items.filter(
      (item) =>
        !item.product.isActive || item.product.stock < item.quantity,
    );
  }, [cart]);

  const subtotal = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => {
      const unit = item.product.pricing?.finalPriceCents ?? item.product.priceCents;
      return sum + unit * item.quantity;
    }, 0);
  }, [cart]);

  const shippingCents =
    shippingMethod === 'EXPRESS' ? shippingExpressCents : shippingStandardCents;
  const total = subtotal + shippingCents;

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

  const handleSubmit = async () => {
    if (step !== 3) {
      return;
    }
    if (paytrIframeUrl) {
      return;
    }
    if (unavailableItems.length > 0) {
      showToast({
        title: t('stockError'),
        variant: 'error',
      });
      return;
    }
    if (paymentProvider === 'PAYTR' && !paytrEnabled) {
      showToast({
        title: t('paytrDisabled'),
        variant: 'error',
      });
      return;
    }
    setLoading(true);
    try {
      const order = await orderService.checkout(accessToken, {
        shippingAddress: address,
        shippingMethod,
        paymentProvider,
      });
      onOrderCreated?.();
      if (paymentProvider === 'PAYTR') {
        const payment = await paymentService.initiatePaytr(accessToken, order.id);
        setPaytrIframeUrl(payment.iframeUrl);
        return;
      }
      router.push({
        pathname: '/checkout/success',
        query: { orderId: order.id },
      });
    } catch (error) {
      showToast({
        title: t('failed'),
        description: error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        onSubmit={(event) => event.preventDefault()}
        className="space-y-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <CheckoutSteps
          current={step}
          steps={[t('steps.address'), t('steps.delivery'), t('steps.payment')]}
        />

        {step === 1 && (
          <div className="space-y-4">
            {addresses.length > 0 ? (
              <div className="space-y-2">
                <label
                  htmlFor="address-select"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]"
                >
                  {t('address.saved')}
                </label>
                <Select
                  id="address-select"
                  className="soft-input"
                  value={selectedAddressId}
                  onChange={(event) => setSelectedAddressId(event.target.value)}
                >
                  <option value="new">{t('address.new')}</option>
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.label ?? addr.line1}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="shipping-name"
                name="fullName"
                placeholder={t('address.fullName')}
                required
                value={address.fullName}
                onChange={(event) =>
                  setAddress((prev) => ({ ...prev, fullName: event.target.value }))
                }
                className="md:col-span-2"
              />
              <Input
                id="shipping-phone"
                name="phone"
                placeholder={t('address.phone')}
                value={address.phone ?? ''}
                onChange={(event) =>
                  setAddress((prev) => ({ ...prev, phone: event.target.value }))
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
                id="shipping-line2"
                name="line2"
                placeholder={t('address.line2')}
                value={address.line2 ?? ''}
                onChange={(event) =>
                  setAddress((prev) => ({ ...prev, line2: event.target.value }))
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
                id="shipping-state"
                name="state"
                placeholder={t('address.state')}
                value={address.state ?? ''}
                onChange={(event) =>
                  setAddress((prev) => ({ ...prev, state: event.target.value }))
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
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <label className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 text-sm">
              <span>
                <input
                  type="radio"
                  name="shipping"
                  className="mr-3"
                  checked={shippingMethod === 'STANDARD'}
                  onChange={() => setShippingMethod('STANDARD')}
                />
                {t('delivery.standard')}
              </span>
              <span className="font-semibold text-slate-900">
                {formatPrice(shippingStandardCents, cart.items[0].product.currency)}
              </span>
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 text-sm">
              <span>
                <input
                  type="radio"
                  name="shipping"
                  className="mr-3"
                  checked={shippingMethod === 'EXPRESS'}
                  onChange={() => setShippingMethod('EXPRESS')}
                />
                {t('delivery.express')}
              </span>
              <span className="font-semibold text-slate-900">
                {formatPrice(shippingExpressCents, cart.items[0].product.currency)}
              </span>
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <label className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 text-sm">
              <span>
                <input
                  type="radio"
                  name="payment"
                  className="mr-3"
                  checked={paymentProvider === 'COD'}
                  onChange={() => setPaymentProvider('COD')}
                />
                {t('payment.cod')}
              </span>
            </label>
            <label className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span>
                  <input
                    type="radio"
                    name="payment"
                    className="mr-3"
                    checked={paymentProvider === 'PAYTR'}
                    onChange={() => setPaymentProvider('PAYTR')}
                    disabled={!paytrEnabled}
                  />
                  {t('payment.paytr')}
                </span>
                {!paytrEnabled ? (
                  <span className="text-xs text-slate-400">
                    {t('payment.disabled')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Image
                      src="/payments/visa.svg"
                      alt="Visa"
                      width={44}
                      height={28}
                    />
                    <Image
                      src="/payments/mastercard.svg"
                      alt="MasterCard"
                      width={44}
                      height={28}
                    />
                  </span>
                )}
              </div>
              {paytrEnabled ? (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>{t('payment.secureBadge')}</span>
                </div>
              ) : null}
            </label>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {step > 1 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((prev) => prev - 1)}
              disabled={Boolean(paytrIframeUrl)}
            >
              {t('back')}
            </Button>
          ) : null}
          {step < 3 ? (
            <Button
              type="button"
              onClick={() => {
                if (step === 1 && !canProceedFromAddress) {
                  showToast({
                    title: t('addressMissing', { default: 'Please complete the address.' }),
                    variant: 'error',
                  });
                  return;
                }
                setStep((prev) => Math.min(3, prev + 1));
              }}
              disabled={Boolean(paytrIframeUrl)}
            >
              {t('next')}
            </Button>
          ) : (
            <Button
              type="button"
              className="flex-1"
              loading={loading}
              disabled={loading || unavailableItems.length > 0 || Boolean(paytrIframeUrl)}
              onClick={handleSubmit}
            >
              {paymentProvider === 'PAYTR' ? t('submitPaytr') : t('submit')}
            </Button>
          )}
        </div>

        {unavailableItems.length > 0 ? (
          <p className="text-sm text-rose-500">{t('stockError')}</p>
        ) : null}
      </form>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-lg font-semibold text-slate-900">{t('summary')}</p>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.product.title} x {item.quantity}
              </span>
              <span>
                {formatPrice(
                  (item.product.pricing?.finalPriceCents ?? item.product.priceCents) *
                    item.quantity,
                  item.product.currency,
                )}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>{t('subtotal')}</span>
            <span>{formatPrice(subtotal, cart.items[0].product.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('shipping')}</span>
            <span>{formatPrice(shippingCents, cart.items[0].product.currency)}</span>
          </div>
          <div className="flex justify-between font-semibold text-slate-900">
            <span>{t('total')}</span>
            <span>{formatPrice(total, cart.items[0].product.currency)}</span>
          </div>
        </div>
        {paytrIframeUrl ? (
          <div className="mt-6 space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {t('payment.iframeTitle')}
              </p>
              <p className="text-xs text-slate-500">
                {t('payment.iframeHint')}
              </p>
            </div>
            <iframe
              title="PayTR secure payment"
              src={paytrIframeUrl}
              className="h-[680px] w-full rounded-xl border border-slate-200 bg-white"
              allow="payment"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
