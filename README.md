# lupeti_project

## Admin features

- **Create an admin**: run `npm run prisma:seed` inside `api/` or set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` before seeding. You can also create additional admins from the `/admin/users` page once logged in.
- **Admin panels**: `/admin/orders`, `/admin/categories`, `/admin/content`, and `/admin/settings` round out the management console alongside products, users, and support.
- **Image storage**: product uploads are persisted under `apps/web/public/uploads/products`. The API writes into this folder using the `UPLOADS_ROOT` (`../apps/web/public/uploads`) and serves them via `/uploads/...`.
- **Homepage + store settings**: global settings and homepage visuals are stored in `StoreSettings` and `HomepageSettings` (see `api/prisma/schema.prisma`).
- **Key environment variables**:
  - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`: bootstrap admin credentials.
  - `SUPPORT_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SENDER`: configure ticket notifications.
  - `UPLOADS_ROOT`, `UPLOADS_PUBLIC_BASE`: control local asset storage paths.

## Customer features

- **Customer routes**: `/shop`, `/search`, `/category/[slug]`, `/wishlist`, `/cart`, `/checkout`, `/checkout/success`, `/account`, `/orders`, `/orders/[id]`, `/contact`, `/shipping-returns`, `/privacy`, `/terms`.
- **Cart persistence**: guest carts are stored in `localStorage` plus a `lupeti_cart_id` cookie; items merge into the authenticated cart on login.
- **Payments**: COD is supported by default; PayTR is available when the API env vars are set.
