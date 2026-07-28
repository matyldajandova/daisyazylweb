# Add Vercel Analytics

## Plan

- [x] Add Vercel Analytics HTML snippet to `_includes/partials/head.njk`
- [x] Build and confirm snippet is in output HTML; browser-check page head
- [x] Note dashboard enable step in review

## Review

- **Code:** Official Vercel Web Analytics HTML snippet added at the end of `_includes/partials/head.njk` (covers all public pages via that partial; `admin/` untouched).
- **Verified:** Built `_site/index.html` and `_site/404/index.html` contain `window.va` + deferred `/_vercel/insights/script.js`. Browser at http://localhost:8080/ confirmed both scripts in DOM and `window.va` is a function. Local 404 on the insights script is expected.
- **Manual (post-deploy):** In Vercel → project → **Analytics** → **Enable** Web Analytics. Redeploy if enabling after the last deploy. In production Network tab, confirm a request to `/_vercel/insights/view` (or similar) on page load.
