# Mobile widget card alignment

## Plan

- [x] Stop leftover `padding-right: 2.75rem !important` from indenting support cards on mobile
- [x] Stretch Darujme iframe to the card embed width below 991px
- [x] Browser-verify even padding and full-width widgets on a 390px viewport

## Review

Cause: under 991px every `.cta39_card-content` got `padding-right: 2.75rem !important` (illustration overlap leftover). Widget cards measured 20px left / 44px right; Darujme iframe stayed 270px in a ~300px embed.

Fix in `_includes/partials/global-styles.njk`: scope the extra right pad to `.cta39_card:has(.cta-illustration)`, and at ≤991px force Darujme token/iframe `width: 100%`.

Browser 390px: padding even 20px; Darujme iframe 291px in 307px embed; Donio iframe 291px. Desktop 1440px unchanged (2×630 cards, Darujme still 270px).

# Pořadí svěřenců, text podpory, widget Znesnáze21

## Plan

- [x] Pořadí v kategorii přes pole `sortOrder` (menší číslo = výš), prázdné až za očíslovanými podle ID
- [x] Text v Podpořte nás vyměnit za znění o chodu azylu
- [x] Sundat Donio a ukázat sbírku Speciální krmivo pro marody (živý průběh + Přispět)

## Review

Přetahování ve složkové kolekci Decap pořadí na webu neukládá. V CMS je pole Pořadí v kategorii. Widget bere stav z veřejné stránky sbírky (při buildu i přes `/api/znesnaze`). Ověřeno v prohlížeči: text, částka 31 059 Kč / 62 %, odkaz na darování, výpis Hledají domov (Enýsek, Borůvka, Rozárka, Nyx) a přepnutí na Nově přijaté. Na 390px je padding karty 20/20 px.
