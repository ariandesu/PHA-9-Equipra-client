# Equipra — client

The storefront for **Equipra**, an equipment rental marketplace: owners list
heavy gear, an admin approves it, customers browse, book and pay online.

Built with Next.js (App Router), Tailwind CSS v4, shadcn/ui, BetterAuth and
TanStack Query. Every screen follows the design export in `design-export/`.

- **Live site:** https://equipra-client.vercel.app
- **Live API:** https://equipra-server.vercel.app
- **Server repo:** https://github.com/ariandesu/Assignment-9-server

## Features

- **Landing page** — animated hero, showcase, owner marquee, stats, featured
  equipment with tabs, 3D photo wall, category focus cards, how-it-works timeline,
  bento grid, reviews, FAQ, owner CTA and a full-width wordmark footer.
- **Auth** — email/password and Google via BetterAuth, role chosen at signup
  (customer or owner), password rules enforced inline and via toast.
- **Catalog** — server-side search, filters, sorting and pagination, with every
  filter reflected in the URL so a reload restores it.
- **Details & booking** — gallery with zoom, spec grid, owner card, favorites, and a
  booking modal with a live total matching the server formula that hands off to
  Stripe Checkout.
- **Dashboards** — role-aware sidebar for customers (rentals, favorites, profile),
  owners (analytics, add/edit equipment, listings, rentals) and admins (platform
  analytics, users, equipment moderation, all rentals).
- **Extras** — ⌘K command search, dark/light theme with localStorage, reduced-motion
  support throughout, route-level loading, error and not-found states.

## Packages

`next`, `react`, `react-dom`, `@tanstack/react-query`, `axios`, `better-auth`,
`mongodb`, `motion`, `lucide-react`, `recharts`, `cmdk`, `react-hook-form`, `zod`,
`@hookform/resolvers`, `sonner`, `next-themes`, `radix-ui`, `class-variance-authority`,
`clsx`, `tailwind-merge`, `tw-animate-css`, `tailwindcss`.

## Environment variables

Names only — copy `.env.example` to `.env.local` and fill in the values.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Express API base URL (ends in `/api`) |
| `NEXT_PUBLIC_DATA_SOURCE` | `mock` for in-memory demo data, `api` for the live server |
| `BETTER_AUTH_URL` | This app's own URL |
| `BETTER_AUTH_SECRET` | BetterAuth signing secret |
| `MONGODB_URI` | Atlas connection string (BetterAuth + seed) |
| `DB_NAME` | `equipra_dev` locally, `equipra` in production |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `JWT_SECRET` | Must match the server's value exactly |
| `JWT_ISSUER` / `JWT_AUDIENCE` | Must match the server's values |
| `NEXT_PUBLIC_IMGBB_KEY` | imgbb API key for image uploads |
| `SEED_ADMIN_PASSWORD` / `Rent@123456` | Passwords used only by the seed script |

## Demo accounts

Created by `npm run seed`. These are **demo test credentials**, not real secrets;
use these to log in on the live site.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@equipra.app` | `Admin@123456` |
| Owner | `owner@karimhm.com` | `Rent@123456` |
| Owner | `lensbox@bd.com` | `Rent@123456` |
| Customer | `rafi@mail.com` | `Rent@123456` |
| Customer | `tanvir@build.bd` | `Rent@123456` |

The seed also creates the remaining owners and customers referenced by the demo
bookings (`sadia.farm@mail.com`, `farhan@frame.bd`, `nusrat.j@mail.com`,
`mehedi.h@mail.com`, `sabbir@infra.bd`, `sound@craft.bd`, `power@hub.com`,
`drive@line.com`, `agro@rent.bd`, `utsab@events.bd`) with `SEED_USER_PASSWORD`.

## Local run

```bash
npm install
cp .env.example .env.local     # then fill in the values

# terminal 1 — API
cd ../equipra-server && npm run dev     # http://localhost:5000

# terminal 2 — client
npm run dev                             # http://localhost:3000
```

Point the client at the API with `NEXT_PUBLIC_DATA_SOURCE=api` and
`NEXT_PUBLIC_API_URL=http://localhost:5000/api`; leave the source as `mock` to work
entirely on in-memory demo data.

## Seed

```bash
npm run seed -- --db equipra_dev   # local development database
npm run seed -- --db equipra       # production database
```

Only those two names are accepted; anything else refuses before connecting. The
seed is idempotent — re-running upserts rather than duplicating — and creates the
demo users, the 13 demo equipment rows (row 11 unavailable, row 12 rejected, row 13
pending), sample bookings with payments, and favorites.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Next dev server on `:3000` |
| `npm run build` | production build |
| `npm start` | serve the production build |
| `npm run lint` | eslint |
| `npm test` | pricing/format tests (node test runner) |
| `npm run seed` | demo data seed (see above) |

## Payments

Bookings reserve units for 30 minutes and redirect to Stripe Checkout. The success
page confirms the session with `POST /payments/confirm`. Until the server has
`STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` set, checkout returns
`503 {"message":"Payments are not configured"}` and the booking modal reports that
gracefully instead of failing.
