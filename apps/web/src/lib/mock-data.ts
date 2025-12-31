import type { ProductFilters } from '@/types';
import { formatCurrency } from './utils';

const SAMPLE_IMAGES: Record<string, string> = {
  anatolian: '/products/anatolian-lamb-herbs-kibble.jpg',
  turkey: '/products/tender-turkey-puppy-bites.jpg',
  sardine: '/products/coastal-sardine-crunch.jpg',
  charcoal: '/products/charcoal-digestive-biscuits.jpg',
  salmon: '/products/highland-salmon-casserole.jpg',
  quail: '/products/slow-roasted-quail-feast.jpg',
};

export const mockProducts = [
  {
    id: 'prod_anatolian_lamb',
    name: 'Anatolian Lamb & Herbs Kibble',
    description:
      'Slow-dried lamb croquettes infused with thyme and sage for active dogs.',
    price: 189.0,
    currency: 'TRY',
    imageUrl: SAMPLE_IMAGES.anatolian,
    category: 'dog',
    rating: 4.8,
    stock: 120,
    tags: ['single-protein', 'herbs'],
    highlights: ['Veterinary approved', 'Mediterranean herbs', 'Slow baked'],
    isFeatured: true,
  },
  {
    id: 'prod_tender_turkey',
    name: 'Tender Turkey Puppy Bites',
    description:
      'Mini bites with DHA and probiotics crafted for growing puppies.',
    price: 159.0,
    currency: 'TRY',
    imageUrl: SAMPLE_IMAGES.turkey,
    category: 'dog',
    rating: 4.7,
    stock: 95,
    tags: ['puppy', 'probiotic'],
  },
  {
    id: 'prod_sardine_crunch',
    name: 'Coastal Sardine Crunch',
    description:
      'Airy sardine snacks rich in omega oils for shiny coats.',
    price: 99.0,
    currency: 'TRY',
    imageUrl: SAMPLE_IMAGES.sardine,
    category: 'cat',
    rating: 4.6,
    stock: 140,
    tags: ['omega', 'snack'],
    isFeatured: true,
  },
  {
    id: 'prod_charcoal_digestive',
    name: 'Charcoal Digestive Biscuits',
    description:
      'Crunchy biscuits with charcoal and fennel to soothe tummies.',
    price: 69.0,
    currency: 'TRY',
    imageUrl: SAMPLE_IMAGES.charcoal,
    category: 'dog',
    rating: 4.5,
    stock: 80,
  },
  {
    id: 'prod_salmon_casserole',
    name: 'Highland Salmon Casserole',
    description:
      'Human-grade salmon and pumpkin casserole for picky cats.',
    price: 215.0,
    currency: 'TRY',
    imageUrl: SAMPLE_IMAGES.salmon,
    category: 'cat',
    rating: 4.9,
    stock: 60,
    isFeatured: true,
  },
  {
    id: 'prod_quail_feast',
    name: 'Slow Roasted Quail Feast',
    description:
      'Premium quail kibble with cranberries tailored for indoor cats.',
    price: 205.0,
    currency: 'TRY',
    imageUrl: SAMPLE_IMAGES.quail,
    category: 'cat',
    rating: 4.7,
    stock: 90,
  },
];

export const mockCart = {
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

export const mockOrders = [
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
  const { category, search, minPrice, maxPrice, page = 1, limit = 12 } = filters;

  let data = [...mockProducts];

  if (category && category !== 'all') {
    data = data.filter((product) => product.category === category);
  }

  if (search) {
    data = data.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
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

type SummaryCart = {
  items: unknown[];
  total: number;
  currency: string;
};

export function cartSummary(cart: SummaryCart) {
  return {
    title: `Subtotal (${cart.items.length} items)`,
    total: formatCurrency(cart.total, cart.currency),
  };
}
