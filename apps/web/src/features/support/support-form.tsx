'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { supportService } from '@/services/support.service';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { SupportTicketPayload } from '@/types';

const CATEGORIES: Array<{ value: SupportTicketPayload['category']; key: string }> = [
  { value: 'ORDER', key: 'order' },
  { value: 'DELIVERY', key: 'delivery' },
  { value: 'PAYMENT', key: 'payment' },
  { value: 'PRODUCT', key: 'product' },
  { value: 'OTHER', key: 'other' },
];

interface SupportFormProps {
  defaultCategory?: SupportTicketPayload['category'];
  hideCategory?: boolean;
}

export function SupportForm({ defaultCategory = 'OTHER', hideCategory = false }: SupportFormProps) {
  const { user, accessToken } = useAuth();
  const { showToast } = useToast();
  const t = useTranslations('support');
  const [form, setForm] = useState<SupportTicketPayload>({
    email: user?.email ?? '',
    subject: '',
    message: '',
    category: defaultCategory,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await supportService.submitTicket(form, accessToken);
      setForm({
        email: user?.email ?? '',
        subject: '',
        message: '',
        category: defaultCategory,
      });
      showToast({ title: t('success'), variant: 'success' });
    } catch (error) {
      showToast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="support-card space-y-6">
      <div className="support-grid">
        <div className="space-y-2">
          <label htmlFor="support-email" className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            {t('form.email')}
          </label>
          <Input
            id="support-email"
            type="email"
            className="soft-input"
            placeholder={t('form.email')}
            value={form.email}
            required
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="support-subject" className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            {t('form.subject')}
          </label>
          <Input
            id="support-subject"
            className="soft-input"
            placeholder={t('form.subject')}
            value={form.subject}
            required
            onChange={(event) =>
              setForm((prev) => ({ ...prev, subject: event.target.value }))
            }
          />
        </div>
        {hideCategory ? null : (
          <div className="space-y-2">
            <label htmlFor="support-category" className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              {t('form.categoryLabel', { default: 'Category' })}
            </label>
            <Select
              id="support-category"
              className="soft-input"
              value={form.category}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  category: event.target.value as SupportTicketPayload['category'],
                }))
              }
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {t(`categories.${category.key}`)}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="support-message" className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
          {t('form.message')}
        </label>
        <Textarea
          id="support-message"
          rows={5}
          className="soft-input"
          placeholder={t('form.message')}
          value={form.message}
          required
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
        />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="send-btn" disabled={loading}>
          {loading ? t('form.sending', { default: 'Sending...' }) : t('form.submit')}
        </button>
      </div>
    </form>
  );
}
