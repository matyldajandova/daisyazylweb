# Mobile widget card alignment

## Plan

- [x] Stop leftover `padding-right: 2.75rem !important` from indenting support cards on mobile
- [x] Stretch Darujme iframe to the card embed width below 991px
- [x] Browser-verify even padding and full-width widgets on a 390px viewport

## Review

Cause: under 991px every `.cta39_card-content` got `padding-right: 2.75rem !important` (illustration overlap leftover). Widget cards measured 20px left / 44px right; Darujme iframe stayed 270px in a ~300px embed.

Fix in `_includes/partials/global-styles.njk`: scope the extra right pad to `.cta39_card:has(.cta-illustration)`, and at ≤991px force Darujme token/iframe `width: 100%`.

Browser 390px: padding even 20px; Darujme iframe 291px in 307px embed; Donio iframe 291px. Desktop 1440px unchanged (2×630 cards, Darujme still 270px).
