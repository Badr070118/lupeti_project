# Lupeti Web (Next.js)

Modern, multilingual e-commerce frontend for the Lupeti pet store. The app consumes the NestJS API, renders localized routes, and relies on typed services plus shared hooks to keep data logic isolated from UI.

## Stack

- Next.js 16 (App Router + React Server Components)
- TypeScript + Tailwind CSS v4
- `next-intl` for localized routes (`/en`, `/fr`, `/tr`)
- Framer Motion + React Three Fiber hero visual
- Custom typed API client that attaches credentials and bearer tokens on demand

## Project Structure

```
apps/web
├── src/app            # App Router segments ([locale], route groups, success/fail pages)
├── src/components     # Layout, marketing, UI primitives, provider shells
├── src/features       # Domain UI: products, cart, checkout, account, admin
├── src/services       # API integrations (auth, categories, products, cart, orders, payments)
├── src/hooks          # Auth/cart/order stores, toast utilities
├── src/lib            # API client, helpers, configuration
└── src/messages       # Locale dictionaries for next-intl (en/fr/tr)
```

## Getting Started

1. **Install dependencies**
   ```bash
   cd apps/web
   npm install
   ```
2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # update NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_URL, supported locales, default locale
   ```
3. **Run locally**
   ```bash
   npm run dev
   ```
   The app serves at http://localhost:3000 by default.
4. **Lint / type-check**
   ```bash
   npm run lint
   ```
5. **Production build**
   ```bash
   npm run build
   npm start
   ```

## API & Security Notes

- `fetchApi` always uses `credentials: "include"` and accepts an optional access token string; refresh tokens stay in HttpOnly cookies managed entirely by the backend.
- `AuthProvider` refreshes the session via `/auth/refresh` on mount and keeps the short-lived access token only in memory.
- Every request is guarded by a strict CSP (`next.config.ts`) plus credentialed fetches so PayTR cookies flow safely.
- Product descriptions remain plain text. Sanitize any rich HTML before rendering dangerously.

## Highlights

- Localized navigation and content via `next-intl`, including localized routes (`/[locale]/shop`, `/[locale]/cart`, etc.).
- 3D hero (React Three Fiber + prefers-reduced-motion fallback) and Framer Motion touches.
- Real API integration for categories, products, cart, checkout, orders, and PayTR initiation.
- Role-aware UI (USER vs ADMIN) with protected pages implemented as client components that rely on shared hooks.
- Toast notifications, cart indicator that reacts to `cart:updated` events, skeleton states, and accessible focusable controls.

## SEO & Performance

- Page-level metadata + OpenGraph tags are generated per locale, with dynamic product metadata derived from catalog content.
- `/sitemap.xml` and `robots.txt` are generated automatically from live routes and product slugs using the API.
- `next/image` is used across product cards, PDPs, and cart lines for responsive, lazy-loaded media.
- Product listing and detail fetches opt into `revalidate` caching (120s / 300s) for a balance between freshness and speed.
- Checkout/cart remain client-driven (no caching) to ensure authenticated accuracy, while static journeys leverage server components for best Lighthouse scores.

## Production Hardening

- Deploy behind a CDN/WAF (Cloudflare, Fastly, etc.) and terminate TLS before Next.js.
- Mirror the backend's rate limits on the frontend (e.g., throttle checkout button) if you expect heavy traffic.
- Consider persisting cart/order data in SWR/React Query if you later introduce optimistic updates or offline flows.
