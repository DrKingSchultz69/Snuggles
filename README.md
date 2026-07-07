# Snuggles — Headless Shopify Storefront

Premium loungewear e-commerce site for the **Snuggle** brand (snuggle.co.in). React storefront (frontend) + Shopify (products, inventory, checkout, payments).

**Live:** https://snuggles-woad.vercel.app
**Shopify store:** `xcerae-cn.myshopify.com` (Basic plan, INR, India)

## Architecture

```
Browser ──> React SPA (Vercel)
              │  Shopify Storefront API (GraphQL, public token)
              ▼
            Shopify ── products, variants, inventory
              │
              ▼
            Shopify Checkout (cartCreate → checkoutUrl redirect)
```

- The React app is a pure storefront "face". All commerce logic (orders, payments, stock) lives in Shopify.
- Checkout: `Add to bag` builds a local cart (React Context + localStorage). "Checkout" calls the Storefront API `cartCreate` mutation and redirects the customer to Shopify's hosted checkout at `xcerae-cn.myshopify.com`.
- No customer data is stored in this codebase.

## Tech Stack

| Layer | Tech |
|---|---|
| UI | React 18, TypeScript, Vite 6, Tailwind CSS 3, React Router 7 |
| State | React Context (`CartContext`, `SearchContext`), cart persisted to localStorage |
| Commerce | Shopify Storefront API (GraphQL) via `src/lib/shopify.ts` |
| API (legacy) | Express server in `api/` — currently unused by the storefront, kept for future server needs |
| Hosting | Vercel (project `snuggles`, GitHub auto-deploy on push to `main`) |

## Getting Started

```bash
npm install
cp .env.example .env   # fill in real values (see below)
npm run dev            # runs Vite (5173) + Express API concurrently
```

### Environment Variables

| Name | Purpose |
|---|---|
| `VITE_SHOPIFY_STORE_DOMAIN` | Shopify store domain, e.g. `xcerae-cn.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API public access token (from the Headless app in Shopify admin) |

Notes:
- `VITE_`-prefixed vars are baked into the client bundle at build time and visible in the browser. This is by design — the Storefront token is a *public* token with read-only, storefront-scoped access. Never put an Admin API token here.
- Same two vars must exist in Vercel (Production + Preview). Changing them requires a redeploy because Vite bakes them at build time.

### Scripts

| Command | What |
|---|---|
| `npm run dev` | Vite dev server + Express API together |
| `npm run client:dev` | Vite only |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run check` | TypeScript type-check only |
| `npm run lint` | ESLint |
| `node scripts/snapshot.mjs` | Full-page screenshots + DOM dumps of every route into `site-snapshots/` (dev server must be running; requires Chrome at the path set in the script) |

## Code Map

```
src/
  App.tsx                    Routes
  main.tsx                   Entry, providers
  lib/
    shopify.ts               All Shopify Storefront API calls + types
                             (getProducts, getProduct, createCart)
    utils.ts                 formatPrice (INR via Intl.NumberFormat), cn helper
  context/
    CartContext.tsx          Cart state, localStorage persistence, checkout redirect
    SearchContext.tsx        Search modal state, live catalog search (session-cached)
  components/
    layout/                  Navbar (with bag dropdown), Footer, Layout
    search/SearchModal.tsx   Search UI
  pages/
    Home.tsx                 Hero, category blocks, "The Collection" (live products)
    ProductListing.tsx       /category/:category — product grid (fetches all products)
    ProductDetail.tsx        /product/:handle — gallery, color/size selectors, add to bag
    Cart.tsx                 Cart page, checkout CTA
    CheckoutPending.tsx      Interstitial while redirecting to Shopify checkout
    Policy.tsx               Static policy page
api/                         Express app (auth route scaffold) — not used by storefront
scripts/snapshot.mjs         Screenshot tool
public/Font/                 Brand fonts (Maglisto, Balkist, Lunea Sans) — see FONTS.md
```

Product routing uses **Shopify handles** as URL ids: `/product/cami-set-cream`, `/product/cami-set-brown`, `/product/bundle-cami`.

## Deployment

- Vercel project `snuggles`, connected to this GitHub repo — **every push to `main` auto-deploys to production**.
- Manual deploy: `vercel --prod` (Vercel CLI).
- `vercel.json` rewrites: `/api/*` → serverless function, everything else → `index.html` (SPA fallback).
- Custom domain `snuggle.co.in` — GoDaddy DNS must point `A @ → 76.76.21.21` and `CNAME www → cname.vercel-dns.com` (pending; currently points to Shopify).

## Known Gaps / TODO

- **Placeholder images**: Home hero, category blocks, and ProductDetail fallback gallery use generated placeholder images (`coresg-normal.trae.ai` URLs). Replace with real brand photos in `public/` when the client provides them. The Bundle Cami product image in Shopify is also a placeholder.
- **Payments**: Shopify checkout works, but no payment gateway is activated yet (Razorpay pending client KYC).
- **Fallback products**: `ProductListing.tsx` contains a hardcoded 2-product fallback shown only if the Shopify API fails. Keep handles in sync with real Shopify handles if products change.
- `/account` and `/wishlist` routes are placeholders (`Empty` component).
- Filters / Sort buttons on the listing page are visual only, not wired.
- `api/` Express server is scaffold only.

## Related Docs

- `PROJECT_OVERVIEW.md` — design system, brand palette, KPIs, full page specs
- `FONTS.md` — brand font usage
- `site-snapshots/` — current-state screenshots of every page
