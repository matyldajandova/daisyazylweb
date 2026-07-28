# CMS-editable výroční zprávy

## Plan

- [x] Add vyrocni-zpravy collection to admin/config.yml (name + file → public/documents)
- [x] Create cms/vyrocni-zpravy.json + _data/vyrocniZpravy.js
- [x] Loop reports in vyrocni-zpravy.html with dividers between items
- [x] Serve + browser-verify CMS admin and /vyrocni-zpravy/ (multi-item dividers)

## Review

- **CMS:** New Decap collection `Výroční zprávy` in `admin/config.yml` — list of `name` + `file` (uploads to `public/documents` → `/documents/…`).
- **Data:** `cms/vyrocni-zpravy.json` + `_data/vyrocniZpravy.js` (filters entries needing both name and file). Seed left empty (`reports: []`) until a real PDF is uploaded.
- **Page:** `vyrocni-zpravy.html` loops CMS data; `.divider-horizontal` only between items (verified with 2 temp entries: item → divider → item).
- **Verified:** `/admin/` shows collection with Název + Soubor widgets; `/vyrocni-zpravy/` renders from CMS. Dev server: http://localhost:8080
