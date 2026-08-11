## Browser-based verification is mandatory

- When working on this project, always validate fixes and changes in a real browser session before marking a task complete.
- Use the configured browser MCP tools to load the relevant page, exercise the affected behavior, and confirm that the UI behaves as intended.
- Treat "tests passing without a browser check" as insufficient for user-facing work; a browser run-through is required before considering the work done.

## CMS image preview and dev server

- The CMS preview uses the same origin as the admin (e.g. `http://localhost:8080/images/uploads/…`). For that URL to work, the dev server must serve `/images/uploads/` from the repo. Use Eleventy’s standard approach: `addPassthroughCopy("images")` plus `setServerPassthroughCopyBehavior("passthrough")` in `.eleventy.js` so that during `eleventy --serve` passthrough files are served from source and new CMS uploads appear without a rebuild. Do not remove these or previews will 404.

## Decap field-level media_folder needs a leading slash

- On a Decap **field** `media_folder` (file/image widget), a path without `/` is relative to the entry folder (e.g. `cms/`), not the repo root.
- For uploads that must land under `public/documents/`, use `media_folder: "/public/documents"` with the leading slash, and `public_folder: "/documents"` for the published URL.
- Without the slash, Decap writes files to `cms/public/documents/` while the site links to `/documents/…` → 404 HTML downloaded as a broken “PDF”/`.txt`.

## Footer grass / dog positioning

- Never position `.footer-grass` with `%` of `.footer15_component` height (`top` / `inset`). When footer content grows (partners, team, etc.), those percentages pull the grass up and it floats above the green footer.
- Use fixed `px` tops (and keep `max-height: 140px`) so the horizon stays anchored to the footer top edge regardless of content length.

## eleventy-img must write into `_site`, not `public/`

- Eleventy 3 runs passthrough copy (`public/` → `_site/`) **in parallel** with template generation (`Promise.all` in `TemplateWriter.write()`).
- Global data (e.g. `_data/animals.js`) runs during template generation. If `@11ty/eleventy-img` writes into `public/images/animals/`, files created after the copier passes never reach `_site/` → intermittent 404s on main images (desktop vs mobile can differ because they pick different `srcset` widths).
- Always set `outputDir: "./_site/images/animals/"` (with matching `urlPath: "/images/animals/"`). Do not commit generated WebPs under `public/images/animals/`.
- After builds, verify every `/images/animals/*.webp` referenced in HTML exists on disk under `_site/`.
