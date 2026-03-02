# SEO/GEO audit and improvements

## Plan (completed)

- [x] Add global site config (`_data/site.js`) for URL, name, locale, address, contact
- [x] Enhance head: canonical, og:url, og:site_name, og:locale, absolute og:image, twitter:image, noindex for 404/401
- [x] Schema.org: AnimalShelter (org), WebPage + BreadcrumbList, ItemList (adopce), Thing (animal detail)
- [x] Sitemap.xml and robots.txt (generated; sitemap lists /, /adopce/, and each animal detail)
- [x] SEO copy: meta descriptions and titles with keywords (adopce koček/psů, azyl, Městec Králové, ČR); H1 fixes; typo fix
- [x] Image alt text: descriptive Czech alts for hero/content images; noindex on 404/401
- [x] **llms.txt**: AI discovery file per llmstxt.org / AI Visibility spec (H1, blockquote, Contact, Services, What We Do Not Do, Key Information, AI Discovery Files)

## Review

- **Technical:** Canonical and absolute OG/Twitter URLs use `site.siteUrl` (env `URL` or `SITE_URL`, default `https://daisyazyl.cz`). All main pages have `lang="cs"`.
- **Schema:** AnimalShelter includes address, telephone, email, sameAs, areaServed (ČR), taxID. WebPage has breadcrumbs. ItemList on /adopce/ for adoption listings; Thing on animal detail.
- **GEO:** Local terms (Městec Králové, Středočeský kraj), areaServed in schema, address in Organization.
- **Verification:** `npm run build` succeeds; sitemap and robots generated; 404/401 have noindex.

## Files changed/added

- `_data/site.js` (new)
- `_includes/partials/head.njk` (canonical, OG/Twitter, noindex)
- `_includes/partials/schema.njk` (new)
- `sitemap.xml.liquid`, `robots.txt.liquid` (new)
- **`llms.txt.liquid`** (new) – outputs `/llms.txt` for LLM/AI discovery
- `index.html`, `adopce.html`, `adopce-detail.html`, `404.html`, `401.html` (lang, copy, H1, alts)
- `.eleventy.cjs` (templateFormats: added liquid)

# Image performance – baseline & inventory

## Baseline (pre-optimization, static analysis)

- **Home (`/`)**
  - Hero image grid uses mostly AVIF (`images/1.avif`, `6.avif`, `5.avif`, `3.avif`, `7.avif`, `4.avif`, `8.avif`) plus one legacy PNG: `images/2.png` (hero cat photo).
  - Decorative/UI assets are SVGs (paw, bone, arrow, etc.).
- **Listing (`/adopce/`)**
  - Animal cards use dynamic `animal.image` / `animal.imageSrcset` (formats determined by upstream pipeline, not hard-coded here).
  - Hidden sample cards use AVIF (`images/5.avif`) only.
- **Detail (`/adopce/:slug/`)**
  - Main hero image uses dynamic `animal.image` / `animal.imageSrcset` (already wired with `srcset` + `sizes`, `loading=\"eager\"`).
  - Gallery slider uses three hard-coded JPEGs: `images/Snímek-obrazovky-2026-01-13-v-11.13.47-p-500.jpg`, `…-p-800.jpg`, and `…11.13.47.jpg`.
- **Meta/social images**
  - Default OG/Twitter image and organization image in schema use `images/og.png`.
  - Apple touch icon uses `images/webclip.png`.

## Bitmap inventory under `images/` (from templates)

- **Hero/content photos**
  - `images/2.png` – Home hero grid (likely LCP candidate).
  - `images/Snímek-obrazovky-2026-01-13-v-11.13.47.jpg` (+ `-p-500.jpg`, `-p-800.jpg`) – Detail page gallery slider.
- **Meta / app icons**
  - `images/og.png` – Default OG/Twitter image and schema.org `image`.
  - `images/webclip.png` – Apple touch icon.

Classification:

- **Hero (LCP-critical)**: `images/2.png`.
- **Gallery (secondary but prominent)**: `images/Snímek-obrazovky-2026-01-13-v-11.13.47*.jpg`.
- **Decorative/UI & meta**: `images/og.png`, `images/webclip.png`.
