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
