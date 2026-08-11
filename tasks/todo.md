# Fix local CMS login (`Cannot GET /api/auth`)

## Plan

- [x] Revert local OAuth hacks (Eleventy middleware, CSP bypass, opener/localStorage relay)
- [x] Standard local flow: `local_backend: true` + `decap-server` (`npm run cms:local`)
- [x] Browser-verify local CMS login end to end
- [x] Update README, `.env.example`, lessons

## Review

### What happened
- First attempt mounted the Vercel OAuth handlers (`api/auth.js`, `api/callback.js`) inside `eleventy --serve` via middleware. That spiraled: Eleventy's live-reload injected a CSP that blocked the callback script, then GitHub's COOP severed `window.opener`, which would have required a localStorage/BroadcastChannel relay. Too many hacks for local dev.

### Final (clean) solution
- **Local**: standard Decap workflow — `npm run serve` + `npm run cms:local` (decap-server on 8081), then `/admin/` → **Work with Local Repository**. No GitHub OAuth locally. Edits land in the working tree; commit with git.
- **Production**: unchanged — Vercel serverless `/api/auth` + `/api/callback` with GitHub OAuth.
- Kept one genuine improvement: shared `api/_lib/public-origin.js` (http for localhost, forwarded headers on Vercel).
- Removed: OAuth middleware in `.eleventy.js`, `scripts/load-env.js`, relay script in `admin/index.html`, local `.env` (unused now).

### Verification (browser)
- decap-server running: `/admin/` logs in via local repository; collections (Zvířata, Partneři, Výroční zprávy) load; "Seznam zvířat" opens with all 5 animals; no writes to the working tree from just browsing.
