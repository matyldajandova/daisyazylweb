# Sverenci design audit fixes

## Plan

- [x] Restyle hub cards + filter bar with site design tokens in global-styles.njk
- [x] Hub: visitor copy, hide empty categories, clean empty-species state
- [x] Filter: remove Rozcestník link, hide zero-count options
- [x] Human per-category intros in `_data/animals.js`
- [x] Browser-verify desktop + mobile

## Review

### Design
- Hub cards use `--_primitives---colors--green` + site radius (same language as `event16_item`).
- Badges match `.tag` (yellow token, 3px radius, dark text).
- Filter is an unboxed dark-green toolbar (no light panel).

### UX
- Visitor intro on hub; empty categories hidden; Psi empty card has no dead links/button.
- Filter: no “← Rozcestník”; category select only lists non-empty options (+ current).
- Category intros e.g. “Tyto kočičky právě hledají svůj nový domov.”

### Verified
- `/nasi-sverenci/`: green cards, only “Hledají domov (5)” under Kočky, Psi empty note only.
- `/nasi-sverenci/kocky/hledaji-domov/`: human intro; filter options = Všechny + Hledají domov (5).
- `/nasi-sverenci/psi/`: empty message; detail `/sverenec/kocka-arya/` still has “Zpět: Hledají domov”.
- Mobile a11y tree for hub confirms stacked single-column structure.
