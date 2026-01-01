'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { SupportTicket } from '@/types';
import { adminService } from '@/services/admin.service';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function AdminSupportManager() {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const t = useTranslations('admin.support');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTickets = useCallback(() => {
    if (!accessToken) return;
    adminService
      .listSupportTickets(accessToken)
      .then((res) => setTickets(res.data))
      .catch((error) =>
        showToast({
          title: t('loadError'),
          description: error instanceof Error ? error.message : t('genericError'),
          variant: 'error',
        }),
      );
  }, [accessToken, showToast, t]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    if (tickets.length > 0 && !selected) {
      setSelected(tickets[0]);
    }
  }, [tickets, selected]);

  const sendReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected || !accessToken) return;
    setLoading(true);
    try {
      const updated = await adminService.replyToTicket(accessToken, selected.id, reply);
      setSelected(updated);
      setReply('');
      fetchTickets();
      showToast({ title: t('replySent'), variant: 'success' });
    } catch (error) {
      showToast({
        title: t('replyError'),
        description: error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    if (!selected || !accessToken) return;
    setLoading(true);
    try {
      const updated = await adminService.updateTicketStatus(accessToken, selected.id, status);
      setSelected(updated);
      fetchTickets();
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

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="admin-list-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="p-3">{t('table.subject')}</th>
              <th className="p-3">{t('table.email')}</th>
              <th className="p-3">{t('table.status')}</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className={`cursor-pointer border-t border-slate-100 ${
                  selected?.id === ticket.id ? 'bg-slate-50' : ''
                }`}
                onClick={() => setSelected(ticket)}
              >
                <td className="p-3">
                  <p className="font-semibold text-slate-900">{ticket.subject}</p>
                  <p className="text-xs text-slate-500">{ticket.category}</p>
                </td>
                <td className="p-3 text-slate-600">{ticket.email}</td>
                <td className="p-3 text-xs uppercase text-slate-500">{ticket.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="admin-form">
        {selected ? (
          <form className="space-y-4" onSubmit={sendReply}>
            <div className="admin-form__section space-y-2">
              <p className="admin-form__heading">{selected.subject}</p>
              <p className="text-xs text-slate-500">{selected.email}</p>
              <div className="admin-form__group">
                <label htmlFor="ticket-status" className="admin-form__label">
                  {t('table.status')}
                </label>
                <Select
                  id="ticket-status"
                  value={selected.status}
                  onChange={(event) => updateStatus(event.target.value)}
                  disabled={loading}
                >
                  <option value="OPEN">{t('status.open')}</option>
                  <option value="IN_PROGRESS">{t('status.inProgress')}</option>
                  <option value="CLOSED">{t('status.closed')}</option>
                </Select>
              </div>
            </div>

            <div className="admin-form__section space-y-3">
              <div className="admin-form__group">
                <label htmlFor="ticket-reply" className="admin-form__label">
                  {t('form.placeholder')}
                </label>
                <Textarea
                  id="ticket-reply"
                  rows={4}
                  placeholder={t('form.placeholder')}
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" loading={loading} disabled={!reply}>
                {t('form.submit')}
              </Button>
            </div>

            <div className="admin-form__section space-y-2">
              <p className="text-xs font-semibold uppercase text-slate-500">{t('history')}</p>
              <div className="support-history text-xs text-[color:var(--text)]">
                <div className="support-message mb-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    {t('original', { default: 'Original message' })}
                  </p>
                  <p className="mt-1">{selected.message}</p>
                </div>
                {selected.replies?.map((reply) => (
                  <div
                    key={reply.id}
                    className={`support-message mb-3 ${
                      reply.authorRole === 'ADMIN' ? 'admin' : ''
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                      {reply.authorRole}
                    </p>
                    <p className="mt-1">{reply.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </form>
        ) : (
          <p className="text-sm text-slate-500">{t('empty')}</p>
        )}
      </div>
    </div>
  );
}
