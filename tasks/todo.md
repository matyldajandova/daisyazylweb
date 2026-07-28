# Fix výroční zpráva PDF download path

## Plan

- [x] Change field media_folder to /public/documents in admin/config.yml
- [x] Move daisy-logo.pdf from cms/public/documents/ to public/documents/ and remove cms/public/
- [x] Sync cms/vyrocni-zpravy.json from origin/main with the /documents/ path
- [x] Browser-verify /vyrocni-zpravy/ download returns a real PDF

## Review

- **Cause:** field `media_folder: "public/documents"` (no leading `/`) saved the CMS upload under `cms/public/documents/`, while links used `/documents/…`.
- **Fix:** `media_folder: "/public/documents"`; moved `daisy-logo.pdf` → `public/documents/`; removed `cms/public/`.
- **Verified (localhost:8082):** page lists Výroční zpráva 2025 → `/documents/daisy-logo.pdf`; fetch returns `200`, `application/pdf`, magic `%PDF-`.
