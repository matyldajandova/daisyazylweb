# Fix local GitHub CMS login (`Cannot GET /api/auth`)

## Plan

- [ ] Extract `publicOrigin` helper; default `http` for localhost
- [ ] Mount `/api/auth` and `/api/callback` in `.eleventy.js` serve middleware
- [ ] Load `.env` locally so `GITHUB_CLIENT_*` are available during serve
- [ ] Update README; browser-verify `/api/auth` and `/admin` login

## Review

_(pending)_
