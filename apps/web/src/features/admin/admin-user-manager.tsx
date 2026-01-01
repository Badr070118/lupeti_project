'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { User } from '@/types';
import { adminService } from '@/services/admin.service';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
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
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [loading, setLoading] = useState(false);

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

  const toggleStatus = async (user: User) => {
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
              <th className="p-3">{t('table.status')}</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="p-3">
                  <p className="font-semibold text-slate-900">{user.email}</p>
                  <p className="text-xs text-slate-500">{user.name ?? '—'}</p>
                </td>
                <td className="p-3 text-xs uppercase text-slate-500">{user.role}</td>
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
                    onClick={() => toggleStatus(user)}
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
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
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
    </div>
  );
}
