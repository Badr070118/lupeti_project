export type UserRole = 'USER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE';
export type DiscountType = 'PERCENT' | 'AMOUNT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
export type TicketCategory =
  | 'ORDER'
  | 'DELIVERY'
  | 'PAYMENT'
  | 'PRODUCT'
  | 'OTHER';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string | null;
  status: UserStatus;
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

export interface ProductPricing {
  originalPriceCents: number;
  finalPriceCents: number;
  discountType: DiscountType | null;
  discountValue: number | null;
  savingsCents: number;
  isPromoActive: boolean;
}

export interface Product {
  id: string;
  slug: string;
  sku: string | null;
  title: string;
  description: string;
  priceCents: number;
  originalPriceCents: number | null;
  discountType: DiscountType | null;
  discountValue: number | null;
  promoStartAt: string | null;
  promoEndAt: string | null;
  currency: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
  images: ProductImage[];
  pricing: ProductPricing;
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
  originalPriceCents: number | null;
  currency: string;
  stock: number;
  isActive: boolean;
  pricing: ProductPricing;
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
  | 'SHIPPED'
  | 'DELIVERED';

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

export interface SupportReply {
  id: string;
  body: string;
  authorRole: UserRole;
  createdAt: string;
  author?: {
    id: string;
    email: string;
    name?: string | null;
  } | null;
}

export interface SupportTicket {
  id: string;
  email: string;
  subject: string;
  message: string;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  replies: SupportReply[];
}

export interface SupportTicketPayload {
  email: string;
  subject: string;
  message: string;
  category: TicketCategory;
}

export interface AdminOverview {
  products: {
    total: number;
    stock: number;
  };
  users: {
    total: number;
    active: number;
  };
  orders: {
    total: number;
    revenueCents: number;
  };
  tickets: {
    total: number;
    open: number;
  };
}

export interface AdminProductInput {
  title: string;
  description: string;
  priceCents: number;
  stock: number;
  categoryId: string;
  currency?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  originalPriceCents?: number | null;
  discountType?: DiscountType | null;
  discountValue?: number | null;
  promoStartAt?: string | null;
  promoEndAt?: string | null;
  sku?: string | null;
  imageUrl?: string | null;
  images?: Array<{ url: string; altText?: string | null; sortOrder?: number }>;
}

export interface AdminUserInput {
  email: string;
  password: string;
  role: UserRole;
  name?: string;
  status?: UserStatus;
}
