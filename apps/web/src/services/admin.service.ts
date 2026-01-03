import { fetchApi } from '@/lib/api';
import type {
  AdminOverview,
  AdminProductInput,
  AdminOrder,
  AdminUserDetail,
  AdminUserSummary,
  AdminUserInput,
  HomepageSettings,
  PaginatedResult,
  Product,
  ProductImage,
  SupportTicket,
  StoreSettings,
  User,
} from '@/types';

type ProductQuery = {
  page?: number;
  limit?: number;
  search?: string;
  includeInactive?: boolean;
};

type OrderQuery = {
  page?: number;
  limit?: number;
  status?: string;
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

  addProductImage(
    accessToken: string,
    productId: string,
    payload: { url: string; altText?: string | null; sortOrder?: number },
  ) {
    return fetchApi<ProductImage>(`/products/${productId}/images`, {
      method: 'POST',
      accessToken,
      body: payload,
    });
  },

  removeProductImage(accessToken: string, imageId: string) {
    return fetchApi(`/products/images/${imageId}`, {
      method: 'DELETE',
      accessToken,
    });
  },

  listUsers(accessToken: string) {
    return fetchApi<PaginatedResult<AdminUserSummary>>('/admin/users', {
      accessToken,
    });
  },

  getUser(accessToken: string, id: string) {
    return fetchApi<AdminUserDetail>(`/admin/users/${id}`, {
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

  listOrders(accessToken: string, query: OrderQuery = {}) {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.status) params.set('status', query.status);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<PaginatedResult<AdminOrder>>(`/orders${suffix}`, {
      accessToken,
    });
  },

  getOrder(accessToken: string, id: string) {
    return fetchApi<AdminOrder>(`/orders/${id}`, {
      accessToken,
    });
  },

  updateOrderStatus(accessToken: string, id: string, status: string) {
    return fetchApi<AdminOrder>(`/orders/${id}/status`, {
      method: 'PATCH',
      accessToken,
      body: { status },
    });
  },

  getSettings(accessToken: string) {
    return fetchApi<{ store: StoreSettings; homepage: HomepageSettings }>(
      '/admin/settings',
      { accessToken },
    );
  },

  updateStoreSettings(accessToken: string, payload: Partial<StoreSettings>) {
    return fetchApi<StoreSettings>('/admin/settings/store', {
      method: 'PATCH',
      accessToken,
      body: payload,
    });
  },

  updateHomepageSettings(
    accessToken: string,
    payload: Partial<HomepageSettings>,
  ) {
    return fetchApi<HomepageSettings>('/admin/settings/homepage', {
      method: 'PATCH',
      accessToken,
      body: payload,
    });
  },

  uploadContentImage(accessToken: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return fetchApi<{ url: string }>('/admin/settings/upload', {
      method: 'POST',
      accessToken,
      body: formData,
    });
  },
};
