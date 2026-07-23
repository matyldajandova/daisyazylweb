# Update Kontakty and Náš tým

## Plan

- [x] Update phone to 605 793 896 and add Instagram link in footer Kontakty
- [x] Replace Náš tým with 5 name+role entries only (no phones/emails)
- [x] Sync `_data/site.js`, schema.njk, and llms.txt.liquid contact data
- [x] Build and verify footer contacts/team in browser

## Review

- **Kontakty:** Phone is `605 793 896`; Messenger + email kept; Instagram link added with `images/instagram.svg` at 16×16 (same as phone/email icons).
- **Náš tým:** Five members, names + roles only; per-person phone/email/Messenger removed.
- **SEO:** `site.contact.telephone` → `+420605793896`; Instagram in `site.js`, schema `sameAs`, and `llms.txt`.
- **Verified in browser:** icon sizes all 16×16; single tel link under Kontakty; full team roster present.
