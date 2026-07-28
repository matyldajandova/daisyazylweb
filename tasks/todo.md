# Remove 2024 report and Radana/Lilli

## Plan

- [x] Delete Výroční zpráva 2024 block + dividers in vyrocni-zpravy.html
- [x] Delete Radana a Lilli Kyle block from footer.njk
- [x] Start npm run serve and browser-verify both pages

## Review

- **Removed:** `Výroční zpráva 2024` entry (+ dividers) from `vyrocni-zpravy.html`; only 2025 remains.
- **Removed:** `Radana a Lilli Kyle` from footer team in `_includes/partials/footer.njk`. Remaining: Tereza, Alžběta, Pavla, Iveta.
- **Verified:** `npm run serve` at http://localhost:8080 — `/vyrocni-zpravy/` shows only 2025; footer team has no Radana/Lilli. (Copyright © 2024 is unrelated and left as-is.)
