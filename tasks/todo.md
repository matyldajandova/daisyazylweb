# Short + long animal descriptions

## Plan

- [x] Add `longDescription` to `admin/config.yml`; clarify `shortDescription` hint
- [x] Migrate `cms/animals.json`: full text → `longDescription`, first paragraph → `shortDescription`
- [x] Wire `sverenec-detail.html` to `longDescription`; confirm card/SEO use short
- [x] Update README; build and browser-verify card vs detail vs meta

## Review

- CMS: `shortDescription` (card/SEO) + `longDescription` (detail) in Decap animals collection
- Content: all 5 animals migrated (first paragraph → short, full text → long)
- Templates: cards/`head.njk`/`schema.njk` keep short; `sverenec-detail.html` uses long with short fallback
- Regenerated served CMS config via `npm run cms:config` (`.cms-config/config.yml`)
- Verified in browser:
  - CMS form shows Stručný popis + Podrobný popis with hints
  - Listing card shows short blurb
  - Detail hero length 782 with full story
  - Meta description length 316 = short only
