## Browser-based verification is mandatory

- When working on this project, always validate fixes and changes in a real browser session before marking a task complete.
- Use the configured browser MCP tools to load the relevant page, exercise the affected behavior, and confirm that the UI behaves as intended.
- Treat "tests passing without a browser check" as insufficient for user-facing work; a browser run-through is required before considering the work done.

## CMS image preview and dev server

- The CMS preview uses the same origin as the admin (e.g. `http://localhost:8080/images/uploads/…`). For that URL to work, the dev server must serve `/images/uploads/` from the repo. The custom `scripts/serve.js` does this; do not revert to `eleventy --serve` for the main serve script or previews will 404 for uploads.
