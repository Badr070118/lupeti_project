const WISHLIST_STORAGE_KEY = 'lupeti:guest_wishlist';

type GuestWishlist = {
  productIds: string[];
  updatedAt: string;
};

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getGuestWishlist(): GuestWishlist {
  if (!isBrowser()) {
    return { productIds: [], updatedAt: new Date().toISOString() };
  }
  const stored = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
  if (!stored) {
    const fresh = { productIds: [], updatedAt: new Date().toISOString() };
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
  return JSON.parse(stored) as GuestWishlist;
}

export function saveGuestWishlist(wishlist: GuestWishlist) {
  if (!isBrowser()) return;
  window.localStorage.setItem(
    WISHLIST_STORAGE_KEY,
    JSON.stringify({ ...wishlist, updatedAt: new Date().toISOString() }),
  );
}

export function addGuestWishlist(productId: string) {
  const wishlist = getGuestWishlist();
  if (!wishlist.productIds.includes(productId)) {
    wishlist.productIds.push(productId);
    saveGuestWishlist(wishlist);
  }
  return wishlist;
}

export function removeGuestWishlist(productId: string) {
  const wishlist = getGuestWishlist();
  wishlist.productIds = wishlist.productIds.filter((id) => id !== productId);
  saveGuestWishlist(wishlist);
  return wishlist;
}

export function clearGuestWishlist() {
  const wishlist = { productIds: [], updatedAt: new Date().toISOString() };
  saveGuestWishlist(wishlist);
  return wishlist;
}
