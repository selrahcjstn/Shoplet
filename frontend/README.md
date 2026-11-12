# Shoplet frontend

The seller dashboard and public pages for Shoplet. React 19, TypeScript, Vite, Tailwind CSS v4, React Router.

## Setup

```bash
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:3000
npm run dev              # http://localhost:5173
```

The [backend](../backend/README.md) must be running for login and the dashboard to work.

| Command           | What it does                    |
| ----------------- | ------------------------------- |
| `npm run dev`     | Vite dev server with hot reload |
| `npm run build`   | Type-check, then production build |
| `npm run preview` | Serve the production build      |
| `npm run lint`    | Oxlint                          |

Code style is set in `.prettierrc` (single quotes, no semicolons, 120 columns).

## Pages

| Route                   | Page                                                               |
| ----------------------- | ------------------------------------------------------------------ |
| `/`                     | Landing page                                                       |
| `/register`, `/login`   | Account pages                                                      |
| `/shops`                | Public list of shops                                               |
| `/dashboard`            | Overview: welcome, 30-day performance, stock counts, recent products, setup checklist |
| `/dashboard/shop`       | My shop: details, visibility, contacts, page polish checklist      |
| `/dashboard/products`   | Products: grid, filters, search, add, edit, hide, delete           |
| `/dashboard/categories` | Categories: add, edit, delete, product counts                      |
| `/dashboard/analytics`  | Analytics: 7, 30 or 90 days, chart, insights, top products, best days |

Dashboard routes sit behind `ProtectedRoute`, which sends signed-out visitors to `/login`.

## Structure

The app is organized by feature. Each feature owns its pages, components, API calls and types.

```
src/
  main.tsx, App.tsx
  index.css                   Tailwind import and design tokens (@theme)
  routes/                     AppRoutes.tsx, NotFoundPage
  layouts/                    MarketingLayout, PublicLayout, DashboardLayout
  components/
    ui/                       Button, Input, Select, Textarea, Modal, Badge, Alert, Card, SectionCard, EmptyState, ...
    layout/                   Container, PageHeader, Logo
  lib/                        api-client.ts, token.ts, format.ts, slug.ts, cn.ts
  features/
    auth/                     login, register, password rules, ProtectedRoute
    dashboard/                Sidebar, header, Overview cards and page
    shops/                    My shop page and forms
    products/                 Products page, card, form, availability helpers
    categories/               Categories page, card, form
    analytics/                Analytics page, chart, cards, formatting helpers
    landing/                  Landing page sections
  assets/                     Logo mark and illustrations (SVG)
```

## Conventions

- **API access:** everything goes through `lib/api-client.ts`. It adds the bearer token, parses the JSON error body into
  friendly messages (`ApiError`), and signs the user out when the API rejects the token. The token is stored in
  `localStorage` as `shoplet_token`.
- **State:** plain `useState` and `useEffect` inside pages. There is no global store or custom hook layer; add one when a
  second feature needs the same data.
- **Forms:** validate on the client first with the same rules as the API, then map API messages back to the right field.
- **Design:** colors, type scale, radii and shadows come from [`../docs/DESIGN.md`](../docs/DESIGN.md) and are defined as
  tokens in `index.css`, for example `bg-primary`, `text-content-secondary`, `bg-brand-ink`, `text-h4`. Use the tokens
  instead of raw colors.
- **Accessibility:** visible keyboard focus, labelled controls, text on every badge (never color alone), and reduced
  motion respected. Charts also render a hidden data table for screen readers.
- **Imports** use relative paths. Files are named after the component they export.
