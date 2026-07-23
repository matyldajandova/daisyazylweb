## Browser-based verification is mandatory

- When working on this project, always validate fixes and changes in a real browser session before marking a task complete.
- Use the configured browser MCP tools to load the relevant page, exercise the affected behavior, and confirm that the UI behaves as intended.
- Treat "tests passing without a browser check" as insufficient for user-facing work; a browser run-through is required before considering the work done.

## CMS image preview and dev server

- The CMS preview uses the same origin as the admin (e.g. `http://localhost:8080/images/uploads/…`). For that URL to work, the dev server must serve `/images/uploads/` from the repo. Use Eleventy’s standard approach: `addPassthroughCopy("images")` plus `setServerPassthroughCopyBehavior("passthrough")` in `.eleventy.js` so that during `eleventy --serve` passthrough files are served from source and new CMS uploads appear without a rebuild. Do not remove these or previews will 404.

## Footer grass / dog positioning

- Never position `.footer-grass` with `%` of `.footer15_component` height (`top` / `inset`). When footer content grows (partners, team, etc.), those percentages pull the grass up and it floats above the green footer.
- Use fixed `px` tops (and keep `max-height: 140px`) so the horizon stays anchored to the footer top edge regardless of content length.
