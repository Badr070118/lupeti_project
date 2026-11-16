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

## Production deployment

The default Compose file is for local use and exposes the database and API. For deployment use `docker compose --env-file .env.production -f docker-compose.production.yml up -d --build` behind a TLS reverse proxy forwarding the public HTTPS domain to `127.0.0.1:3001`. Create `.env.production` from `.env.production.example`, choose the real HTTPS `PUBLIC_URL`, and generate a long random alphanumeric PostgreSQL password. These values are build-time settings: rebuild web after changing the URL. Never commit secrets.

Configure `api/.env` with independent long random `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`, SMTP settings, support email and sender, and (when enabled) real PayTR credentials and public HTTPS callback/return URLs. The production Compose file forces secure cookies and the correct frontend origin. Provision an administrator with a unique strong password; the seed creates demo data and resets seeded account passwords, so do not run it against production without reviewing it.

Before going live, verify SMTP delivery and PayTR in test mode, configure monitoring and encrypted off-host backups, and test restoration. A backup must include both PostgreSQL and `apps/web/public/uploads`. For example, run `docker compose --env-file .env.production -f docker-compose.production.yml exec -T db pg_dump -U lupeti -Fc lupeti > database.dump` and archive the uploads directory separately. Store both files securely outside the host and automate a retention policy. Test restoring into an isolated database using `pg_restore` before relying on the backup. Database dumps and uploaded assets may contain personal data.
