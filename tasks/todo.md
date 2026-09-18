# Darujme + Donio widgets in Podpořte nás

## Plan

- [x] Add two self-contained cream cards in `#podpora` (after the bank-account card)
- [x] Embed Darujme widget with the provided token/script
- [x] Embed Donio iframe (`widget2/43522`)
- [x] Style the pair to match existing `cta39_card` support cards
- [x] Browser-verify both widgets on desktop and a mobile viewport

## Review

Added Darujme.cz and Donio as a two-column pair of cream `cta39_card`s in `_includes/partials/support-section.njk`, directly under the transparent-account card. Shared styles live in `_includes/partials/global-styles.njk`. The partial is already included on homepage, listings, and animal details.

Browser (Eleventy `http://localhost:8080/#podpora`):

- Mobile 390px: cards stack; Darujme iframe rendered (270×515) with amounts + **Darovat**; Donio iframe loaded campaign **Šance na nový život pro kočky** (157 270 Kč)
- Desktop 1440px: equal 630×789 cards side by side, corner graphic matches the account card
- `/nasi-sverenci/#podpora` also shows both headings and campaign links
