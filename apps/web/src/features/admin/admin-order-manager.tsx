'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { AdminOrder } from '@/types';
import { adminService } from '@/services/admin.service';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

const ORDER_STATUSES = [
  'PENDING_PAYMENT',
  'PAID',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'FAILED',
] as const;

type OrderStatusValue = (typeof ORDER_STATUSES)[number];

export function AdminOrderManager() {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const t = useTranslations('admin.orders');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(() => {
    if (!accessToken) return;
    adminService
      .listOrders(accessToken)
      .then((res) => setOrders(res.data))
      .catch((error) =>
        showToast({
          title: t('loadError'),
          description: error instanceof Error ? error.message : t('genericError'),
          variant: 'error',
        }),
      );
  }, [accessToken, showToast, t]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!selected && orders.length > 0) {
      setSelected(orders[0]);
    }
  }, [orders, selected]);

  const updateStatus = async (status: OrderStatusValue) => {
    if (!selected || !accessToken) return;
    setLoading(true);
    try {
      const updated = await adminService.updateOrderStatus(accessToken, selected.id, status);
      const refreshed = await adminService.getOrder(accessToken, updated.id);
      setSelected(refreshed);
      fetchOrders();
      showToast({ title: t('statusUpdated'), variant: 'success' });
    } catch (error) {
      showToast({
        title: t('statusError'),
        description: error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderAddress = (address?: Record<string, unknown>) => {
    if (!address) return null;
    return Object.entries(address).map(([key, value]) => (
      <p key={key} className="text-xs text-slate-600">
        {key}: {String(value)}
      </p>
    ));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="admin-list-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="p-3">{t('table.order')}</th>
              <th className="p-3">{t('table.customer')}</th>
              <th className="p-3">{t('table.total')}</th>
              <th className="p-3">{t('table.status')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={`cursor-pointer border-t border-slate-100 ${
                  selected?.id === order.id ? 'bg-slate-50' : ''
                }`}
                onClick={() => setSelected(order)}
              >
                <td className="p-3">
                  <p className="font-semibold text-slate-900">{order.id}</p>
                  <p className="text-xs text-slate-500">
                    {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
                      new Date(order.createdAt),
                    )}
                  </p>
                </td>
                <td className="p-3 text-sm text-slate-600">
                  {order.user?.email ?? t('details.noCustomer', { default: 'Unknown' })}
                </td>
                <td className="p-3 font-semibold text-slate-900">
                  {formatPrice(order.totalCents, order.currency)}
                </td>
                <td className="p-3 text-xs uppercase text-slate-500">
                  {t(`status.${order.status}`)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-form">
        {selected ? (
          <div className="space-y-4">
            <div className="admin-form__section space-y-2">
              <p className="admin-form__heading">{t('details.title')}</p>
              <p className="text-xs text-slate-500">{selected.id}</p>
              <div className="admin-form__group">
                <label htmlFor="order-status" className="admin-form__label">
                  {t('details.status')}
                </label>
                <Select
                  id="order-status"
                  value={selected.status}
                  onChange={(event) => updateStatus(event.target.value as OrderStatusValue)}
                  disabled={loading}
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {t(`status.${status}`)}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="admin-form__section space-y-2">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {t('details.customer')}
              </p>
              <p className="text-sm text-slate-600">
                {selected.user?.email ?? t('details.noCustomer', { default: 'Unknown' })}
              </p>
            </div>

            <div className="admin-form__section space-y-2">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {t('details.shipping')}
              </p>
              {renderAddress(selected.shippingAddress as Record<string, unknown>) ?? (
                <p className="text-sm text-slate-500">{t('details.noAddress')}</p>
              )}
            </div>

            <div className="admin-form__section space-y-2">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {t('details.items')}
              </p>
              <div className="space-y-2">
                {selected.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{item.titleSnapshot}</span>
                      <span>{item.quantity} x</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[0.7rem] text-slate-500">
                      <span>{formatPrice(item.priceCentsSnapshot, selected.currency)}</span>
                      <span>{formatPrice(item.lineTotalCents, selected.currency)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-form__section space-y-2">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {t('details.totals')}
              </p>
              <div className="text-sm text-slate-600">
                <p>
                  {t('details.subtotal', {
                    value: formatPrice(selected.subtotalCents, selected.currency),
                  })}
                </p>
                <p>
                  {t('details.shippingFee', {
                    value: formatPrice(selected.shippingCents, selected.currency),
                  })}
                </p>
                <p className="font-semibold text-slate-900">
                  {t('details.total', {
                    value: formatPrice(selected.totalCents, selected.currency),
                  })}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setSelected(null)}
              className="w-full"
            >
              {t('details.clear')}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-slate-500">{t('details.empty')}</p>
        )}
      </div>
    </div>
  );
}
