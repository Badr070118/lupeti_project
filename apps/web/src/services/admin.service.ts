import { fetchApi } from '@/lib/api';
import type {
  AdminOverview,
  AdminProductInput,
  AdminUserInput,
  PaginatedResult,
  Product,
  SupportTicket,
  User,
} from '@/types';

type ProductQuery = {
  page?: number;
  limit?: number;
  search?: string;
  includeInactive?: boolean;
};

export const adminService = {
  getOverview(accessToken: string) {
    return fetchApi<AdminOverview>('/admin/overview', {
      accessToken,
    });
  },

  listProducts(accessToken: string, query: ProductQuery = {}) {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.search) params.set('search', query.search);
    if (query.includeInactive) params.set('includeInactive', 'true');
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<PaginatedResult<Product>>(`/admin/products${suffix}`, {
      accessToken,
    });
  },

  createProduct(accessToken: string, payload: AdminProductInput) {
    return fetchApi<Product>('/products', {
      method: 'POST',
      accessToken,
      body: payload,
    });
  },

  updateProduct(accessToken: string, id: string, payload: Partial<AdminProductInput>) {
    return fetchApi<Product>(`/products/${id}`, {
      method: 'PATCH',
      accessToken,
      body: payload,
    });
  },

  deleteProduct(accessToken: string, id: string) {
    return fetchApi(`/products/${id}`, {
      method: 'DELETE',
      accessToken,
    });
  },

  uploadProductImage(accessToken: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return fetchApi<{ url: string }>('/admin/products/upload', {
      method: 'POST',
      accessToken,
      body: formData,
    });
  },

  listUsers(accessToken: string) {
    return fetchApi<PaginatedResult<User>>('/admin/users', {
      accessToken,
    });
  },

  createUser(accessToken: string, payload: AdminUserInput) {
    return fetchApi<User>('/admin/users', {
      method: 'POST',
      accessToken,
      body: payload,
    });
  },

  updateUser(accessToken: string, id: string, payload: Partial<AdminUserInput>) {
    return fetchApi<User>(`/admin/users/${id}`, {
      method: 'PATCH',
      accessToken,
      body: payload,
    });
  },

  resetUserPassword(accessToken: string, id: string, password: string) {
    return fetchApi(`/admin/users/${id}/reset-password`, {
      method: 'POST',
      accessToken,
      body: { password },
    });
  },

  deleteUser(accessToken: string, id: string) {
    return fetchApi(`/admin/users/${id}`, {
      method: 'DELETE',
      accessToken,
    });
  },

  listSupportTickets(accessToken: string) {
    return fetchApi<PaginatedResult<SupportTicket>>('/admin/support/tickets', {
      accessToken,
    });
  },

  getSupportTicket(accessToken: string, id: string) {
    return fetchApi<SupportTicket>(`/admin/support/tickets/${id}`, {
      accessToken,
    });
  },

  updateTicketStatus(accessToken: string, id: string, status: string) {
    return fetchApi<SupportTicket>(`/admin/support/tickets/${id}/status`, {
      method: 'PATCH',
      accessToken,
      body: { status },
    });
  },

  replyToTicket(accessToken: string, id: string, message: string) {
    return fetchApi<SupportTicket>(`/admin/support/tickets/${id}/replies`, {
      method: 'POST',
      accessToken,
      body: { message },
    });
  },
};
