import { fetchApi } from '@/lib/api';
import type {
  PaginatedResult,
  SupportTicket,
  SupportTicketPayload,
} from '@/types';

export const supportService = {
  submitTicket(payload: SupportTicketPayload, accessToken?: string | null) {
    return fetchApi<SupportTicket>('/support/tickets', {
      method: 'POST',
      body: payload,
      accessToken: accessToken ?? undefined,
    });
  },

  listTickets(accessToken: string) {
    return fetchApi<PaginatedResult<SupportTicket>>('/admin/support/tickets', {
      accessToken,
    });
  },
};
