# 🛍️ Snuggles — Project Overview

> A luxury-minimal fashion e-commerce platform built with modern web technologies.

---

## 📌 What Is This Project?

**Snuggles** is a premium contemporary fashion e-commerce web application. It is designed to feel editorial, high-end, and confident — inspired by luxury fashion brands. The interface prioritises bold typography, generous whitespace, a neutral colour palette, immersive photography, and subtle micro-animations.

The goal is to deliver a seamless, mobile-first shopping experience that positions Snuggles as a distinctive fashion brand in the mid-premium segment.

---

## 🎯 Project Goals

- Establish Snuggles as a premium contemporary fashion brand online
- Deliver a fast, responsive, mobile-first shopping experience (target LCP < 2.5s)
- Drive product discovery through clean, intuitive navigation
- Build a strong visual brand identity through design consistency
- Achieve measurable KPIs: conversion rate > 2.5%, bounce rate < 45%

---

## 🗂️ Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, category blocks, campaign section, trending products, newsletter |
| `/category/:category` | Product Listing (PLP) | Filterable product grid by category |
| `/product/:id` | Product Detail (PDP) | Image gallery, size selector, add to bag, related products |
| `/cart` | Cart | Item list, quantities, totals, checkout CTA |
| `/checkout` | Checkout Pending | Minimal 2-step checkout flow |
| `/policy` | Policy | Shipping, returns, and legal policies |
| `/account` | Account | User dashboard (placeholder) |
| `/wishlist` | Wishlist | Saved items (placeholder) |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI component library |
| TypeScript | ~5.8 | Type safety |
| Vite | 6.3 | Build tool & dev server |
| React Router | 7.3 | Client-side routing |
| Tailwind CSS | 3.4 | Utility-first styling |
| Zustand | 5.0 | Global state management (cart, wishlist) |
| Lucide React | 0.511 | Icon library |
| clsx + tailwind-merge | latest | Conditional class utilities |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Express.js | 4.21 | REST API server |
| Node.js / TypeScript | — | Server runtime |
| Nodemon | 3.1 | Dev server with hot reload |
| dotenv | 17 | Environment variable management |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Hosting & serverless functions |
| Concurrently | Run client + server in dev together |

---

## 📁 Project Structure

```
Snuggles/
├── api/                    # Express backend
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Server entry point
│   ├── index.ts            # Vercel serverless entry
│   └── routes/
│       └── auth.ts         # Authentication routes
│
├── src/                    # React frontend
│   ├── App.tsx             # Root component & route definitions
│   ├── main.tsx            # React DOM entry point
│   ├── index.css           # Global styles & custom font faces
│   │
│   ├── pages/              # Top-level route pages
│   │   ├── Home.tsx        # Homepage
│   │   ├── ProductListing.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── CheckoutPending.tsx
│   │   └── Policy.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx  # Page shell (Navbar + Footer)
│   │   │   ├── Navbar.tsx  # Top navigation bar
│   │   │   └── Footer.tsx  # Site footer
│   │   ├── search/         # Search components
│   │   └── Empty.tsx       # Placeholder / fallback component
│   │
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Shared utilities / helpers
│
├── public/                 # Static assets
│   └── Font/
│       └── maglisto/       # Custom brand font (Maglisto.otf)
│
├── index.html              # HTML entry point (Google Fonts CDN)
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # Vercel deployment config
├── nodemon.json            # Nodemon dev config
├── PRD.md                  # Product Requirements Document
├── FONTS.md                # Typography documentation
└── PROJECT_OVERVIEW.md     # This file
```

---

## 🎨 Design System

### Typography

| Role | Font | Tailwind Class |
|---|---|---|
| Brand Logo | Maglisto (custom `.otf`) | `font-logo` |
| Headings & Titles | Playfair Display (Serif) | `font-serif` |
| Body & UI Text | Inter (Sans-serif) | `font-sans` |
| Navigation / Buttons | Inter | `font-sans` |

### Colour Palette

| Name | Hex | Usage |
|---|---|---|
| Black | `#000000` | Primary text, buttons, borders |
| White | `#FFFFFF` | Backgrounds, overlays |
| Soft Beige | `#F5F5F5` | Section backgrounds |
| Warm Grey | `#DCDCDC` | Dividers, subtle borders |

> No bright accent colours — the palette intentionally stays neutral and editorial.

### Design Principles
- **ALL CAPS** navigation and labels
- Generous whitespace between elements
- No decorative borders on product cards
- Hover interactions: image swap, button invert, zoom
- Fade-in on scroll animations

---

## ⚙️ Functional Features

- ✅ Responsive layout (mobile-first, 1 → 2 → 3–4 column grids)
- ✅ Product listing with category filtering
- ✅ Product detail with image gallery and size selector
- ✅ Add to Cart / Cart management via Zustand
- ✅ Menu drawer (hamburger navigation)
- ✅ Search functionality
- ✅ Lazy-loaded images
- ✅ Micro-interactions (hover image swap, button invert, drawer transitions)
- ✅ Newsletter signup section
- ✅ Policy page (Shipping, Returns, Legal)
- ⏳ Account dashboard (placeholder)
- ⏳ Wishlist (placeholder)
- ⏳ Full checkout flow (currently pending)

---

## 📱 Mobile Experience

- Sticky navigation
- Full-width product images
- One-thumb shopping flow
- Fast tap targets
- Collapsible product detail sections

---

## 🔍 SEO & Performance Targets

| Metric | Target |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s |
| Image format | WebP |
| Image loading | Lazy |
| URL structure | Clean (`/category/women`, `/product/123`) |
| Meta descriptions | Per-page |
| Product schema | Structured data |
| Sitemap | Auto-generated |

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Run both frontend and backend in dev mode
npm run dev

# Frontend only
npm run client:dev

# Backend only
npm run server:dev

# Type check
npm run check

# Build for production
npm run build
```

> The frontend runs on `http://localhost:5173` (Vite default).  
> The backend API runs concurrently via Nodemon.

---

## 🗺️ Roadmap (Phase 2)

- [ ] Lookbook / Editorial section
- [ ] AI size recommender
- [ ] Loyalty / rewards program
- [ ] Store locator
- [ ] Multi-language support
- [ ] AR try-on feature
- [ ] Full checkout & payment integration

---

## 📊 Success KPIs

| Metric | Target |
|---|---|
| Conversion rate | > 2.5% |
| Bounce rate | < 45% |
| Avg. session duration | > 2 minutes |
| Cart abandonment rate | < 65% |
| Repeat customer rate | > 30% |
| Uptime | 99.9% |

---

## 🔐 Non-Functional Requirements

- GDPR compliant
- PCI-compliant checkout (Phase 2)
- Scalable to 100k+ products
- Load time < 2.5s

---

*Last updated: June 2026 · Built with React + TypeScript + Vite · Deployed on Vercel*
