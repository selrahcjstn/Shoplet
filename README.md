# Shoplet

A mini online storefront platform. A seller signs up, opens a shop, adds products and categories, and sees how many
people visit and get in touch. This repository holds both halves of the app.

| Folder                  | What it is                                              |
| ----------------------- | ------------------------------------------------------- |
| [`backend/`](backend)   | REST API: NestJS, PostgreSQL, JWT auth, Swagger docs    |
| [`frontend/`](frontend) | Seller dashboard and public pages: React, Vite, Tailwind |
| [`docs/`](docs)         | Design system (`DESIGN.md`)                             |

## What it does

- **Accounts:** register and log in. Passwords are hashed, and the API hands out short-lived JWT access tokens.
- **Roles:** `SELLER` (the default) and `ADMIN`. Sellers can only change their own shop. Admins can manage everything.
- **My shop:** name, link, category, description, logo, cover photo, accent color, announcement, contact details, and a
  publish switch.
- **Products and categories:** add, edit, hide, feature and delete. Products have a photo link, a price and an
  availability status (available, out of stock, made to order, coming soon).
- **Analytics:** store visits, product views and contact clicks over 7, 30 or 90 days, with a comparison against the
  period before, top products, least viewed products, best days of the week and a contact-method breakdown. Days follow
  the seller's own timezone.
- **Overview:** a dashboard home with live numbers, trend lines, recent products and a setup checklist.

## Quick start

You need **Node.js** (the project is developed on Node 24) and **PostgreSQL 15 or newer**.

```bash
# 1. Create an empty database, for example "shoplet_db"

# 2. Backend
cd backend
npm install
cp .env.example .env        # then fill in DATABASE_URL and JWT_SECRET
npx prisma db migrate       # create the tables
npm run start:dev           # http://localhost:3000, Swagger at /api/docs

# 3. Frontend (in a second terminal)
cd frontend
npm install
cp .env.example .env        # VITE_API_URL defaults to http://localhost:3000
npm run dev                 # http://localhost:5173
```

Create a seller at <http://localhost:5173/register>, log in, and open **My shop** to get started.

Generate a `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Scripts

| Where       | Command                | What it does                      |
| ----------- | ---------------------- | --------------------------------- |
| `backend/`  | `npm run start:dev`    | API with reload                   |
| `backend/`  | `npm test`             | Unit and HTTP access tests        |
| `backend/`  | `npm run build`        | Compile to `dist/`                |
| `frontend/` | `npm run dev`          | Vite dev server                   |
| `frontend/` | `npm run build`        | Type-check and production build   |
| `frontend/` | `npm run lint`         | Oxlint                            |

## How the pieces fit

```
Browser (React, :5173)  ──fetch + Bearer token──▶  NestJS API (:3000)  ──SQL──▶  PostgreSQL
                                                    │
                                                    └─ Swagger UI at /api/docs
```

- The frontend stores the access token in `localStorage` under `shoplet_token` and sends it on every request. A
  rejected token signs the user out.
- The API allows the frontend origin through CORS. Set `CORS_ORIGIN` (comma-separated) if you serve the frontend from
  another address.

## Known limits

- There is **no public storefront page yet**. The shop link shown in the dashboard (`shoplet/your-shop`) is a label, not
  a working address, so visits and contact clicks are only recorded if something posts to the API's view and click
  endpoints. Those endpoints are public and unauthenticated, so counts can be inflated until rate limiting is added.
- `GET /shops` is public and returns every shop, including drafts.
- Photos are links only. There is no image upload.
- There is no way to create an admin from the app. Change a user's `role` in the database.

## Documentation

- [Backend README](backend/README.md): environment, migrations, modules and endpoints, testing.
- [Frontend README](frontend/README.md): structure, conventions, design tokens.
- [Design system](docs/DESIGN.md): colors, type scale, components.
