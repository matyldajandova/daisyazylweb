# Decap on Vercel (GitHub)

## Plan

- [x] Point local `origin` to GitHub (`matyldajandova/daisyazylweb`)
- [x] Add `/api/auth` + `/api/callback` GitHub OAuth proxy
- [x] Update `admin/config.yml` + `vercel.json` + README
- [x] Verify remote + build

## Review

- Local `origin` is `git@github.com:matyldajandova/daisyazylweb.git` (Bitbucket removed).
- Decap backend is `github` / `matyldajandova/daisyazylweb` with build-time `base_url` injection.
- Vercel serverless OAuth: `api/auth.js`, `api/callback.js`.
- Still required manually: create GitHub OAuth App + set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `CMS_BASE_URL` on Vercel, then redeploy.
