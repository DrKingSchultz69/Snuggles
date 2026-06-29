## Overview
- Build a new Shopify Online Store 2.0 theme with a minimal, image‑forward aesthetic similar to `zara.com`.
- Deliverables: a zip theme ready to upload, containing home page (index) and product page templates and configurable sections.
- Base approach: start from Shopify’s `Dawn` architecture for compatibility, then replace styling and sections with a monochrome, editorial design.

## Visual Style
- Color: predominantly white/black, subtle grays, no borders unless essential.
- Typography: clean sans serif, tight leading, small caps/uppercase for nav; avoid licensed fonts unless provided.
- Imagery: edge‑to‑edge hero, large editorial tiles, hover image swap on product cards.
- Layout: generous whitespace, grid‑based, mobile‑first, subtle transitions (no heavy animations).

## Theme Structure
- `layout/theme.liquid`: minimal shell, loads CSS/JS and renders header/footer.
- `config/settings_schema.json`: theme settings for colors, typography, spacing, grids, toggles.
- `sections/`
  - `header.liquid`: centered logo, minimal nav, search overlay, cart icon.
  - `footer.liquid`: compact link columns, locale/currency selector (optional).
  - `hero.liquid`: full‑bleed image/video, optional headline and CTA.
  - `editorial-grid.liquid`: 2–3 column image tiles linking to collections/products.
  - `featured-collection.liquid`: product grid with hover swap and quick add.
  - `collection-list.liquid`: category cards.
  - `newsletter.liquid`: slim subscription strip.
  - `product-main.liquid`: gallery + product details, size selector, add to cart, accordions.
  - `product-recommendations.liquid`: row/grid of related items.
- `templates/`
  - `index.json`: references `hero`, `editorial-grid`, `featured-collection`, `newsletter` and `footer`.
  - `product.json`: references `product-main` and `product-recommendations`.
- `snippets/`
  - `card-product.liquid`, `price.liquid`, `badge.liquid`, `responsive-image.liquid`.
- `assets/`
  - `base.css` + `theme.css`: CSS variables, grid, cards, gallery, header/footer.
  - `theme.js`: vanilla JS for menu/search overlays, hover swap, gallery, accordions.

## Home Page Sections
- **Hero**: configurable media, overlay text, alignment, desktop/mobile crop, CTA link.
- **Editorial Grid**: configurable tiles (image, title, link), 2–3 columns responsive.
- **Featured Collection**: pick a collection, set product card layout (hover swap, show badge/price), grid size per breakpoint.
- **Newsletter**: headline, subcopy, consent checkbox toggle, form action.

## Product Page
- **Gallery**: stacked or thumb‑strip layout; lazy‑loaded images with `srcset`/`sizes` and zoom on hover.
- **Details**: title, price, badges; variant picker (size grid); stock messaging; disabled CTA until size selected.
- **Info Blocks**: collapsible sections for description, composition, shipping & returns.
- **Recommendations**: Shopify recommendations endpoint, layout matches product grid.
- **Accessibility**: keyboard focus, ARIA for accordions and gallery, readable contrasts.

## Interactions
- Header: sticky on scroll, minimal hover underline; search overlay with keyboard focus trap.
- Product Cards: hover image swap, quick add (if variant preselectable), graceful mobile behavior.
- Product CTA: add to cart with inline feedback; error states for unavailable variants.

## Theme Settings
- Colors (text/background/hover), typography scale, max content width, grid column counts.
- Toggles: hover image swap, quick add, sticky header, show badges.
- Section settings: per‑tile image focal point, copy alignment, mobile stacking.

## Performance & Accessibility
- Images: `srcset`, `sizes`, lazy loading, aspect‑ratio placeholders; compress assets.
- JS: vanilla, small footprint; defer non‑critical; no large dependencies.
- SEO: semantic headings, meta defaults, product structured data via Shopify defaults.
- A11y: alt text from media settings, focus outlines, ARIA attributes, keyboard navigation.

## Delivery & Import
- Provide a zip of the theme folder (root contains `layout/`, `sections/`, `templates/`, `snippets/`, `assets/`, `config/`).
- Upload via Shopify Admin: `Online Store` → `Themes` → `Add theme` → `Upload zip`.
- Includes `settings_schema.json` with defaults so the theme renders immediately.

## Implementation Notes
- Start from `Dawn` to ensure OS 2.0 compliance, then replace UI with the minimal aesthetic.
- No copied brand assets; provide placeholders and settings to use your own imagery and text.
- Breakpoints: 375/768/1024/1440; test with Shopify preview and Theme Inspector.

## Next Steps
- After approval, I’ll scaffold the theme, implement sections/templates, write CSS/JS, hook up settings, and package a zip for upload. I’ll also run a quick pass for performance/a11y and confirm it previews correctly.