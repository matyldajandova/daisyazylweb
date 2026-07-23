# Legal docs and privacy page

## Plan

- [x] Copy 3 downloadables into public/documents/ with URL-safe names
- [x] Rewrite dokumenty.html list to Stanovy, Osvědčení, Adopční smlouva with real hrefs
- [x] Create ochrana-osobnich-udaju.html from docx content
- [x] Add privacy as first footer legal link; drop hidden EN stubs
- [x] Add privacy + dokumenty + vyrocni-zpravy to sitemap
- [x] Browser-check footer, privacy page, and downloads

## Review

- **Downloads:** `public/documents/` serves Stanovy PDF, Osvědčení PDF, and Adopční smlouva DOCX (URL-safe filenames; Czech labels on the list).
- **Dokumenty:** Placeholder Obchodní podmínky / privacy rows removed; three real download links with `download` attribute.
- **Privacy page:** `/ochrana-osobnich-udaju/` with GDPR prose aligned to the Word source; legal-doc layout (sections, address block, definition rows, rights list).
- **Footer:** Legal links order is Ochrana osobních údajů → Dokumenty → Výroční zprávy; hidden EN stubs removed.
- **Sitemap:** Privacy, dokumenty, and výroční zprávy URLs added.
- **Verified in browser:** privacy page content/formatting, dokumenty list + file hrefs/content-types, footer link order on homepage.
