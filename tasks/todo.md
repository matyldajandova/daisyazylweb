# Admin categorization, missing FeLV cats, Failed to fetch

## Plan

- [x] Unique detail slugs (append id on name collision) + assert uniqueness
- [x] Migrate `cms/animals.json` → `cms/animals/*.json`; folder collection with filters/groups
- [x] Persist hardening: ASCII media slugs, pin Decap, preSave auto-id, browser WebP+resize, gallery eleventy-img
- [x] Browser-verify FeLV listing, both Johanka URLs, CMS list/filter/new-entry, large-image upload

## Review

Local `npm run build` succeeds. Two Johankas no longer share a permalink: original stays at `/sverenec/kocka-johanka/`, FeLV Johanka is `/sverenec/kocka-johanka-42/`. Duplicate slug now throws a clear error from `_data/animals.js` instead of Eleventy’s opaque permalink crash.

Animals are one JSON file per cat under `cms/animals/` (44 files). Admin is a folder collection with filters (FeLV+, species, public categories) and groups (Kategorie / Druh). **＋ Zvíře** is on the collection index. Opening Jasmínka goes to `/admin/#/collections/animals/entries/43-jasminka`.

Browser (desktop, `http://localhost:8082/`):

- `/nasi-sverenci/kocky/felv/` lists **7** cats including Jasmínka, Filípek, and both Johankas
- Filípek gallery uses `/images/animals/…webp` srcset (400/800/1200), not raw uploads
- CMS: list + FeLV+ filter + group by category; New Zvíře form; throwaway `9999-cms-test-kocka.json` loaded then deleted via local backend
- Image pick: 3200×2400 JPEG → blob preview **1920×1440** WebP named `cms-test-large.webp` without refresh

Decap’s markdown widget does not take programmatic fill (Publish stayed blocked with “Podrobný popis is required” until a real typed value is in the store). A human editor typing the story is unaffected.

Production updates only after this lands on `main` and Vercel builds green. Not pushed.
