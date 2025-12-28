export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  currency: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
  images: ProductImage[];
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  featured?: boolean;
}

export interface CartProductSummary {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  createdAt: string;
  product: CartProductSummary;
}

export interface Cart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED'
  | 'SHIPPED';

export interface OrderItem {
  id: string;
  productId: string;
  titleSnapshot: string;
  priceCentsSnapshot: number;
  quantity: number;
  lineTotalCents: number;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  currency: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  shippingMethod: string | null;
  shippingAddress: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CheckoutPayload {
  shippingAddress: Record<string, string>;
  shippingMethod?: string;
}

export interface PaytrInitiateResponse {
  token: string;
  iframeUrl: string;
  merchantOid: string;
  merchantId: string;
  amountCents: number;
  currency: string;
}
