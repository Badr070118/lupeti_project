const CART_STORAGE_KEY = 'lupeti:guest_cart';
const CART_COOKIE = 'lupeti_cart_id';

export type GuestCartItem = {
  productId: string;
  quantity: number;
  addedAt: string;
};

export type GuestCart = {
  id: string;
  items: GuestCartItem[];
  createdAt: string;
  updatedAt: string;
};

function isBrowser() {
  return typeof window !== 'undefined';
}

function readCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1] ?? '') : null;
}

function writeCookie(name: string, value: string) {
  if (!isBrowser()) return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax${secure}`;
}

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `cart_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export function getGuestCart(): GuestCart {
  if (!isBrowser()) {
    return {
      id: 'guest',
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const stored = window.localStorage.getItem(CART_STORAGE_KEY);
  const parsed = stored ? (JSON.parse(stored) as GuestCart | null) : null;
  const cartId = readCookie(CART_COOKIE) || parsed?.id || generateId();
  if (!readCookie(CART_COOKIE)) {
    writeCookie(CART_COOKIE, cartId);
  }

  if (!parsed) {
    const now = new Date().toISOString();
    const fresh: GuestCart = { id: cartId, items: [], createdAt: now, updatedAt: now };
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }

  if (parsed.id !== cartId) {
    parsed.id = cartId;
  }
  return parsed;
}

export function saveGuestCart(cart: GuestCart) {
  if (!isBrowser()) return;
  const updated = { ...cart, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
}

export function addGuestItem(productId: string, quantity = 1) {
  const cart = getGuestCart();
  const existing = cart.items.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      quantity,
      addedAt: new Date().toISOString(),
    });
  }
  saveGuestCart(cart);
  return cart;
}

export function updateGuestItem(productId: string, quantity: number) {
  const cart = getGuestCart();
  const item = cart.items.find((entry) => entry.productId === productId);
  if (item) {
    item.quantity = quantity;
  }
  saveGuestCart(cart);
  return cart;
}

export function removeGuestItem(productId: string) {
  const cart = getGuestCart();
  cart.items = cart.items.filter((entry) => entry.productId !== productId);
  saveGuestCart(cart);
  return cart;
}

export function clearGuestCart() {
  const cart = getGuestCart();
  cart.items = [];
  saveGuestCart(cart);
  return cart;
}

export function guestCartCount() {
  const cart = getGuestCart();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}
