# Lupeti E-commerce API

Production-ready NestJS API for Lupeti's e-commerce backend. It provides secure authentication, RBAC-protected routes, Prisma/PostgreSQL data access, and hardened defaults ready for deployment.

## Stack

- [NestJS](https://nestjs.com/) with TypeScript
- [Prisma](https://www.prisma.io/) ORM + PostgreSQL
- JWT authentication with Argon2id hashing
- Helmet, compression, cookie-parser, strict CORS, throttling, and structured logging

## Features

- Argon2id password hashing
- JWT access tokens (15 minutes) + refresh tokens (7 days) stored as HttpOnly secure cookies and hashed at rest
- Refresh token rotation and revocation on login/logout
- RBAC with `USER` and `ADMIN` roles (`GET /admin/ping` protected by ADMIN)
- Store/global settings and homepage content management (shipping fees, feature toggles, and local hero assets)
- Per-route throttling for auth endpoints plus global 100 rpm/IP
- Global validation pipe, structured exception filter, and correlation-id logging middleware

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # edit .env with your DATABASE_URL, JWT secrets, FRONTEND_URL, NODE_ENV, COOKIE_SECURE
   ```
3. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```
4. **Apply migrations**
   ```bash
   npm run prisma:migrate
   ```
5. **Seed the database (creates admin@local.test / Admin123!ChangeMe)**
   ```bash
   npm run prisma:seed
   ```
6. **Run the API in watch mode**
   ```bash
   npm run start:dev
   ```

## Docker Quickstart

Run the API and PostgreSQL without installing local Postgres:

1. From the repository root copy your env file (secrets stay on your machine):
   ```bash
   cd api
   cp .env.example .env
   # fill JWT secrets, FRONTEND_URL, etc. DATABASE_URL will be overridden in Docker
   cd ..
   ```
2. Build and start the stack (API + PostgreSQL):
   ```bash
   docker compose up --build -d
   ```
3. Seed the database inside the container (creates `admin@local.test / Admin123!ChangeMe`):
   ```bash
   docker compose exec api npm run prisma:seed
   ```
4. Tail logs or restart as needed:
   ```bash
   docker compose logs -f api
   docker compose down
   ```

**Container endpoints & credentials**

- API: `http://localhost:3000`
- PostgreSQL: `postgres://lupeti:lupeti@localhost:5432/lupeti`
  - Username: `lupeti`
  - Password: `lupeti`
  - Database: `lupeti`

The API container automatically runs `prisma migrate deploy` before starting so schema changes are applied at boot.

## Settings Schema Notes

Two singleton tables back the admin settings UI and homepage content:

- `StoreSettings`: store name, support contacts, shipping fees, currency, checkout/support toggles, and PayTR enablement.
- `HomepageSettings`: local asset URLs for hero/story/category visuals plus toggles for premium homepage sections.

## Sample cURL Requests

Use these commands (assuming `http://localhost:3000`) to verify the main flows:

```bash
# Login as admin (stores refresh cookie + prints access token)
curl -i -c cookies.txt http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "admin@local.test", "password": "Admin123!ChangeMe" }'

# Export the access token from the JSON response if you need bearer auth
export ACCESS_TOKEN="<paste-access-token>"

# Public catalog endpoints
curl http://localhost:3000/categories
curl "http://localhost:3000/products?category=dog&search=lamb&sort=price_desc"
curl http://localhost:3000/products/anatolian-lamb-herbs-kibble

# Public settings snapshot
curl http://localhost:3000/settings/public

# Admin category creation
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "slug": "treats", "name": "Seasonal Treats" }'

# Admin settings update (shipping + feature toggles)
curl -X PATCH http://localhost:3000/admin/settings/store \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "shippingExpressCents": 3000, "enableCheckout": true, "paytrEnabled": true }'

# Cart operations scoped to the logged-in user
curl -b cookies.txt -c cookies.txt http://localhost:3000/cart
curl -X POST -b cookies.txt -c cookies.txt http://localhost:3000/cart/items \
  -H "Content-Type: application/json" \
  -d '{ "productId": "<PRODUCT_ID>", "quantity": 2 }'

# Checkout + PayTR payment initiation
curl -X POST -b cookies.txt -c cookies.txt http://localhost:3000/orders/checkout \
  -H "Content-Type: application/json" \
  -d '{ "shippingAddress": { "line1": "42 Akasya", "city": "Istanbul", "postalCode": "34000", "country": "TR" } }'

curl -X POST -b cookies.txt -c cookies.txt http://localhost:3000/payments/paytr/initiate \
  -H "Content-Type: application/json" \
  -d '{ "orderId": "<ORDER_ID>" }'
```

## Available NPM Scripts

- `npm run prisma:migrate` – run pending Prisma migrations against the DB
- `npm run prisma:generate` – regenerate Prisma Client
- `npm run prisma:seed` – execute `prisma/seed.ts`
- `npm run start:dev` – Nest dev server with live reload
- `npm run start:prod` – run compiled server
- `npm run lint` / `npm run test` – quality gates

## Production Hardening Notes

- Terminate TLS and add a WAF (Cloudflare, AWS WAF, Fastly, etc.) in front of the API.
- Place NestJS behind a reverse proxy (NGINX, Traefik, API Gateway) for HTTP/2, caching, request size limits, and DoS protection.
- Keep the PostgreSQL database on a private network/VPC—never expose it publicly. Enable automated backups and PITR.
- Rotate JWT secrets regularly, store them in a secret manager (AWS Secrets Manager, Vault), and prefer managed Argon2 hardware when available.
- Monitor the throttling/logging outputs (ship to ELK/OTel) and ensure logs include the `x-request-id` for correlation.


## Payments & PayTR Configuration

- Set PayTR credentials via `.env`: `PAYTR_MERCHANT_ID`, `PAYTR_MERCHANT_KEY`, `PAYTR_MERCHANT_SALT`, `PAYTR_OK_URL`, `PAYTR_FAIL_URL`, `PAYTR_CALLBACK_URL`, and `PUBLIC_APP_URL`. Keep these secrets in a vault in production.
- When `NODE_ENV !== production`, the API automatically sends `test_mode=1` to PayTR so you can use sandbox credentials without code changes.
- **Flow overview**:
  1. User checks out (`POST /orders/checkout`) to create a `PENDING_PAYMENT` order.
  2. Client calls `POST /payments/paytr/initiate { orderId }`. The API validates ownership, creates/reuses a `Payment`, calls PayTR's token API with merchant secrets, and returns `{ token, iframeUrl, merchantOid }`.
  3. Frontend redirects or loads the PayTR iframe located at `https://www.paytr.com/odeme/guvenli/<token>` and handles the hosted payment UI.
  4. PayTR redirects the shopper to `PAYTR_OK_URL` / `PAYTR_FAIL_URL` and also notifies `POST /payments/paytr/callback`.
  5. The callback verifies the signature using merchant key/salt, records a `PaymentEvent`, and updates both `Payment` and `Order` statuses transactionally before replying with the plain text `OK`.
- Future providers (Stripe, etc.) can be added inside `src/payments/` by creating new initiate/webhook handlers that reuse the shared `Payment` / `PaymentEvent` schema.


