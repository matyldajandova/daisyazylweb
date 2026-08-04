# Add QR code to bank account section

## Plan

- [x] Copy QR PNG to `public/images/qr-platba-daisy-azyl.png`
- [x] Update `support-section.njk` — QR beside account; remove two-people illustration on this card
- [x] Add flex / white-pad / responsive styles in `global-styles.njk`
- [x] Browser-check `/#podpora` desktop + mobile

## Review

- **Asset:** `public/images/qr-platba-daisy-azyl.png` (526×514 PNG), served at `/images/qr-platba-daisy-azyl.png` (HTTP 200).
- **UI:** QR sits in the financial support card next to account `267695286/0600`; decorative `two-people.svg` removed from this card only.
- **Layout:** Desktop row (text left, QR right); ≤991px stacks with QR under the account link. White pad keeps the code scannable.
- **Verified (localhost:8080/#podpora):** QR loads (`naturalWidth` 526), alt present, side-by-side at 1280px and stacked at 390px.
- **Stacked gap fix:** `justify-content: flex-start` + `gap: 1rem` (was `space-between`); text `flex: 0 1 auto`. Measured account→QR gap = 16px at 390/900px.
