# Shoplet API

NestJS REST API for Shoplet. TypeScript (ESM), PostgreSQL through Prisma 8, JWT authentication, Swagger documentation.

## Requirements

- Node.js (developed on Node 24)
- PostgreSQL 15 or newer

## Setup

```bash
npm install
cp .env.example .env     # fill in the values below
npx prisma db migrate    # apply the migrations in ./migrations
npm run start:dev        # watch mode
```

The API listens on <http://localhost:3000>. Interactive docs are at <http://localhost:3000/api/docs>, and the raw
OpenAPI document is at `/api/docs-json`.

### Environment

| Variable         | Required | Notes                                                            |
| ---------------- | -------- | ---------------------------------------------------------------- |
| `DATABASE_URL`   | yes      | PostgreSQL connection string                                     |
| `JWT_SECRET`     | yes      | At least 32 characters. The app refuses to start without it      |
| `JWT_EXPIRES_IN` | no       | Access token lifetime. Default `15m`                             |
| `CORS_ORIGIN`    | no       | Allowed frontend origins, comma-separated. Default `http://localhost:5173` |

## Scripts

| Command                | What it does                         |
| ---------------------- | ------------------------------------ |
| `npm run start:dev`    | Run with reload                      |
| `npm run build`        | Compile to `dist/`                   |
| `npm run start:prod`   | Run the compiled build               |
| `npm test`             | Vitest unit and HTTP access tests    |
| `npm run test:cov`     | Tests with coverage                  |
| `npm run lint`         | Oxlint                               |
| `npm run contract:emit`| Regenerate the typed contract        |

## Database and migrations

The schema lives in [`src/prisma/contract.prisma`](src/prisma/contract.prisma). Migrations are in
[`migrations/app/`](migrations/app).

```bash
# after editing contract.prisma
npx prisma contract emit
npx prisma migration plan --name describe_the_change
npx prisma db migrate
npx prisma migration status      # check what is applied
```

Tables: `users`, `business_categories`, `shops`, `shop_contacts`, `product_categories`, `products`, `product_images`,
`store_views`, `product_views`, `contact_clicks`, `admin_actions`.

## Authentication and access

- `POST /auth/register` and `POST /auth/login` are public. Login returns an access token, sent afterwards as
  `Authorization: Bearer <token>`.
- Passwords need 8 to 72 characters with an upper case letter, a lower case letter, a number and a special character, and are hashed with bcrypt.
- A global guard requires a valid token on every route unless it is marked `@Public()`. A second guard enforces
  `@Roles('ADMIN')` where used.
- **Ownership:** creating, changing or deleting anything inside a shop (the shop itself, contacts, categories, products,
  images) is allowed for the shop's owner or an admin. Anyone else gets `403`.

## Endpoints

"Public" means no token. "Owner" means the shop's owner or an admin. Every module has full create, read, update and
delete unless noted.

| Path                        | Read       | Write                                  |
| --------------------------- | ---------- | -------------------------------------- |
| `/auth`                     | -          | `register`, `login` (public)           |
| `/users`                    | `me`: self | `PATCH me`: self. Everything else: admin |
| `/business-categories`      | public     | admin                                  |
| `/shops`                    | public     | owner                                  |
| `/shop-contacts`            | public     | owner                                  |
| `/product-categories`       | public     | owner                                  |
| `/products`                 | public     | owner                                  |
| `/product-images`           | public     | owner                                  |
| `/store-views`              | admin      | `POST`: public                         |
| `/product-views`            | admin      | `POST`: public                         |
| `/contact-clicks`           | admin      | `POST`: public                         |
| `/admin-actions`            | admin      | admin                                  |
| `/analytics/shops/:shopId`  | owner      | -                                      |

### Analytics

```
GET /analytics/shops/:shopId?days=30&timezone=Asia/Manila
```

`days` is 1 to 365 (default 30). `timezone` is an IANA name (default `UTC`) and decides where each day starts. The
response holds the totals for the period and for the period before it, one row per day (zeros included), the top
products, the least viewed visible products, and contact clicks by method. Counts come from SQL `GROUP BY` queries over
`store_views`, `product_views` and `contact_clicks`.

## Validation and errors

- Request bodies are validated with `class-validator` DTOs. Unknown fields are rejected, and messages are written for
  people, for example `Password must contain at least one number`.
- A global `DatabaseExceptionFilter` turns database errors into clear responses instead of `500`. A duplicate value becomes `409`. A missing or still-used related row, a
  missing value, a badly formatted value or a too-long value becomes `400`.
- Update endpoints ignore fields that were not sent, so a partial update never overwrites data with `undefined`.

## Project layout

```
src/
  main.ts                     bootstrap: CORS, validation, Swagger, error filter
  app.module.ts
  config/                     JWT settings
  common/
    filters/                  database-exception.filter.ts
    utils/                    ownership.ts, defined-only.ts
  prisma/                     contract.prisma, db.ts (ORM), pool.ts (plain SQL for reports)
  modules/
    <feature>/                controller, service, module, dto/, spec files
    auth/                     strategy, guards, decorators (@Public, @Roles, @CurrentUser)
migrations/app/               generated migrations
test/                         end-to-end tests
```

## Testing

```bash
npm test
```

The suite covers each service and controller, the ownership rules, the HTTP access rules for each role, and the
analytics calculations.
