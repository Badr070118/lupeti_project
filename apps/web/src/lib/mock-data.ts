import type {
  Cart,
  Order,
  Product,
  ProductCategory,
  ProductFilters,
} from '@/types';
import { formatCurrency } from './utils';

const SAMPLE_IMAGES: Record<ProductCategory, string> = {
  croquettes:
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=60',
  accessories:
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=60',
  toys: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=900&q=60',
  wellness:
    'https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=900&q=60',
  bundles:
    'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&w=900&q=60',
};

export const mockProducts: Product[] = [
  {
    id: 'prod_croquettes_1',
    name: 'Salmon & Pumpkin Croquettes',
    description:
      'Grain-free croquettes with functional superfoods for sensitive tummies.',
    price: 38.9,
    currency: 'EUR',
    imageUrl: SAMPLE_IMAGES.croquettes,
    category: 'croquettes',
    rating: 4.8,
    stock: 120,
    tags: ['grain-free', 'omega3'],
    highlights: ['Veterinary approved', 'Prebiotics blend', 'French origin'],
    isFeatured: true,
  },
  {
    id: 'prod_croquettes_2',
    name: 'Puppy Starter Croquettes',
    description:
      'High-protein chicken croquettes tailored for healthy puppy development.',
    price: 32.5,
    currency: 'EUR',
    imageUrl: SAMPLE_IMAGES.croquettes,
    category: 'croquettes',
    rating: 4.7,
    stock: 80,
    tags: ['puppy', 'high-protein'],
  },
  {
    id: 'prod_accessory_1',
    name: 'Urban Explorer Harness',
    description:
      'Ergonomic harness with reflective seams and breathable mesh interior.',
    price: 44.0,
    currency: 'EUR',
    imageUrl: SAMPLE_IMAGES.accessories,
    category: 'accessories',
    rating: 4.9,
    stock: 56,
    tags: ['adjustable', 'reflective'],
    isFeatured: true,
  },
  {
    id: 'prod_accessory_2',
    name: 'Nordic Ceramic Bowl',
    description:
      'Non-slip ceramic bowl with matte finish. Dishwasher safe, 1L capacity.',
    price: 24.0,
    currency: 'EUR',
    imageUrl: SAMPLE_IMAGES.accessories,
    category: 'accessories',
    rating: 4.6,
    stock: 200,
  },
  {
    id: 'prod_toy_1',
    name: 'Mind Puzzle Feeder',
    description:
      'Interactive feeder that encourages slow eating and cognitive engagement.',
    price: 29.5,
    currency: 'EUR',
    imageUrl: SAMPLE_IMAGES.toys,
    category: 'toys',
    rating: 4.5,
    stock: 140,
    isFeatured: true,
  },
  {
    id: 'prod_wellness_1',
    name: 'Biotin & Omega Supplement',
    description:
      'Daily supplement supporting healthy skin, shiny coat, and strong claws.',
    price: 19.9,
    currency: 'EUR',
    imageUrl: SAMPLE_IMAGES.wellness,
    category: 'wellness',
    rating: 4.4,
    stock: 210,
  },
];

export const mockCart: Cart = {
  id: 'cart_demo',
  items: [
    {
      id: 'cart_item_1',
      product: mockProducts[0],
      quantity: 1,
    },
    {
      id: 'cart_item_2',
      product: mockProducts[2],
      quantity: 2,
    },
  ],
  subtotal: mockProducts[0].price + mockProducts[2].price * 2,
  shipping: 6.5,
  total: mockProducts[0].price + mockProducts[2].price * 2 + 6.5,
  currency: 'EUR',
  updatedAt: new Date().toISOString(),
};

export const mockOrders: Order[] = [
  {
    id: 'order_1051',
    status: 'fulfilled',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    total: mockCart.total,
    currency: 'EUR',
    items: mockCart.items,
  },
  {
    id: 'order_1050',
    status: 'processing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    total: 58.6,
    currency: 'EUR',
    items: [mockCart.items[0]],
  },
];

export function filterMockProducts(filters: ProductFilters) {
  const { category, query, minPrice, maxPrice, page = 1, limit = 12 } = filters;

  let data = [...mockProducts];

  if (category && category !== 'all') {
    data = data.filter((product) => product.category === category);
  }

  if (query) {
    data = data.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    );
  }

  if (typeof minPrice === 'number') {
    data = data.filter((product) => product.price >= minPrice);
  }

  if (typeof maxPrice === 'number') {
    data = data.filter((product) => product.price <= maxPrice);
  }

  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: data.slice(start, end),
    meta: {
      total,
      page,
      pageSize: limit,
      totalPages,
      isFallback: true,
    },
  };
}

export function cartSummary(cart: Cart) {
  return {
    title: `Subtotal (${cart.items.length} items)`,
    total: formatCurrency(cart.total, cart.currency),
  };
}
