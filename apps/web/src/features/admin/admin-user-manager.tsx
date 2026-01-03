'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { AdminUserDetail, AdminUserSummary } from '@/types';
import { adminService } from '@/services/admin.service';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const INITIAL_FORM = {
  email: '',
  password: '',
  name: '',
  role: 'USER',
} as const;

export function AdminUserManager() {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const t = useTranslations('admin.users');
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserDetail | null>(null);

  const fetchUsers = useCallback(() => {
    if (!accessToken) return;
    adminService
      .listUsers(accessToken)
      .then((res) => setUsers(res.data))
      .catch((error) =>
        showToast({
          title: t('loadError'),
          description: error instanceof Error ? error.message : t('genericError'),
          variant: 'error',
        }),
      );
  }, [accessToken, showToast, t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (!selectedId && users.length > 0) {
      setSelectedId(users[0].id);
    }
  }, [users, selectedId]);

  useEffect(() => {
    if (!accessToken || !selectedId) {
      setSelectedUser(null);
      return;
    }
    adminService
      .getUser(accessToken, selectedId)
      .then(setSelectedUser)
      .catch(() => setSelectedUser(null));
  }, [accessToken, selectedId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) return;
    setLoading(true);
    try {
      await adminService.createUser(accessToken, {
        email: form.email,
        password: form.password,
        role: form.role as 'USER' | 'ADMIN',
        name: form.name,
      });
      setForm({ ...INITIAL_FORM });
      fetchUsers();
      showToast({ title: t('created'), variant: 'success' });
    } catch (error) {
      showToast({
        title: t('createError'),
        description: error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (user: AdminUserSummary) => {
    if (!accessToken) return;
    setLoading(true);
    try {
      await adminService.updateUser(accessToken, user.id, {
        status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      });
      fetchUsers();
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

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="admin-list-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="p-3">{t('table.user')}</th>
              <th className="p-3">{t('table.role')}</th>
              <th className="p-3">{t('table.orders')}</th>
              <th className="p-3">{t('table.status')}</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={`border-t border-slate-100 ${
                  selectedId === user.id ? 'bg-slate-50' : ''
                }`}
                onClick={() => setSelectedId(user.id)}
              >
                <td className="p-3">
                  <p className="font-semibold text-slate-900">{user.email}</p>
                  <p className="text-xs text-slate-500">{user.name ?? t('noName')}</p>
                </td>
                <td className="p-3 text-xs uppercase text-slate-500">{user.role}</td>
                <td className="p-3 text-sm text-slate-600">
                  {user.ordersCount > 0
                    ? t('ordersCount', { count: user.ordersCount })
                    : t('noOrders')}
                </td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      user.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {user.status === 'ACTIVE' ? t('active') : t('inactive')}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleStatus(user);
                    }}
                    disabled={loading}
                  >
                    {user.status === 'ACTIVE' ? t('disable') : t('activate')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="admin-form space-y-4">
          <div className="admin-form__section space-y-4">
            <p className="admin-form__heading">{t('form.title')}</p>
            <div className="admin-form__group">
              <label htmlFor="admin-user-email" className="admin-form__label">
                {t('form.email')}
              </label>
              <Input
                id="admin-user-email"
                className="soft-input"
                placeholder={t('form.email')}
                value={form.email}
                required
                type="email"
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            <div className="admin-form__group">
              <label htmlFor="admin-user-name" className="admin-form__label">
                {t('form.name')}
              </label>
              <Input
                id="admin-user-name"
                className="soft-input"
                placeholder={t('form.name')}
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div className="admin-form__group">
              <label htmlFor="admin-user-password" className="admin-form__label">
                {t('form.password')}
              </label>
              <Input
                id="admin-user-password"
                className="soft-input"
                placeholder={t('form.password')}
                value={form.password}
                required
                type="password"
                minLength={8}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, password: event.target.value }))
                }
              />
            </div>
            <div className="admin-form__group">
              <label htmlFor="admin-user-role" className="admin-form__label">
                {t('table.role')}
              </label>
              <Select
                id="admin-user-role"
                className="soft-input"
                value={form.role}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    role: event.target.value,
                  }))
                }
              >
                <option value="USER">{t('roles.user')}</option>
                <option value="ADMIN">{t('roles.admin')}</option>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            {t('form.submit')}
          </Button>
        </form>

        <div className="admin-form">
          {selectedUser ? (
            <div className="space-y-4">
              <div>
                <p className="admin-form__heading">{t('details.title')}</p>
                <p className="text-sm text-slate-500">{selectedUser.email}</p>
              </div>
              <div className="admin-form__section space-y-2">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {t('details.summary')}
                </p>
                <div className="text-sm text-slate-600">
                  <p>{t('details.role', { value: selectedUser.role })}</p>
                  <p>{t('details.status', { value: selectedUser.status })}</p>
                  <p>{t('details.orders', { count: selectedUser.ordersCount })}</p>
                  <p>
                    {t('details.totalSpent', {
                      value: formatPrice(selectedUser.totalSpentCents),
                    })}
                  </p>
                  {selectedUser.lastOrderAt ? (
                    <p>
                      {t('details.lastOrder', {
                        value: new Intl.DateTimeFormat('en', {
                          dateStyle: 'medium',
                        }).format(new Date(selectedUser.lastOrderAt)),
                      })}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="admin-form__section space-y-2">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {t('details.ordersList')}
                </p>
                {selectedUser.orders.length ? (
                  <div className="space-y-2">
                    {selectedUser.orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600"
                      >
                        <div className="flex items-center justify-between">
                          <span>{order.id}</span>
                          <span className="font-semibold text-slate-900">
                            {formatPrice(order.totalCents, order.currency)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[0.7rem] text-slate-500">
                          <span>{order.status}</span>
                          <span>
                            {new Intl.DateTimeFormat('en', {
                              dateStyle: 'medium',
                            }).format(new Date(order.createdAt))}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">{t('details.noOrders')}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">{t('details.empty')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
