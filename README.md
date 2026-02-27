## Daisy Azyl – build & content editing

### Build pipeline

- **Install dependencies**:

```bash
npm install --legacy-peer-deps
```

- **Build static site with Eleventy** (outputs to `_site/`):

```bash
npm run build
```

- **Local preview**:

```bash
npm run serve
```

Then open `http://localhost:8080`.

### Minimal templating structure

- Shared pieces:
  - `/_includes/partials/head.njk` – document `<head>` (title, description, og/twitter; uses `title`/`description`/`ogImage` from front matter, or `animal` on adopce-detail).
  - `/_includes/partials/global-styles.njk` – Webflow global style embeds.
  - `/_includes/partials/navbar.njk` – main navigation (uses `currentPage` from front‑matter).
  - `/_includes/partials/footer.njk` – footer (also uses `currentPage`).
- Pages are still regular `.html` files (`index.html`, `adopce.html`, `adopce-detail.html`, …) with very small Liquid tags for includes and loops.

### Animal data

- Adoption listings and detail pages are driven from:

```text
cms/animals.json      (edited by Decap CMS)
_data/animals.js      (reads cms/animals.json, adds URL slugs, exposes global "animals")
```

- **Listing** (`adopce.html`): Loops over `animals.animalsEnriched` to render cards and links to each animal’s detail at `/adopce/<slug>/` (e.g. `/adopce/kocka-betuska/`).
- **Detail** (`adopce-detail.html`): Uses Eleventy pagination (one page per animal) and binds each animal’s fields (name, tags, shortDescription, image, etc.). URLs are SEO-friendly: `/adopce/<species>-<name>/` (e.g. `/adopce/kocka-betuska/`).
- When `animals.animals` is empty, no detail pages are generated and the listing shows “Momentálně nemáme žádné pejsky a kočičky k adopci.”

### Minimal content editor (Decap CMS)

- A lightweight Git‑based editor is available at:

```text
/admin/
```

- Config file:

```text
/admin/config.yml
```

- The `animals` collection in Decap CMS edits the `cms/animals.json` file:
  - Add / edit / remove animals.
  - Fields match what the templates expect (`id`, `name`, `species`, `tags`, `image`, `shortDescription`, `adoptionStatus`, …). Detail URLs are generated at build time (no `detailUrl` field).

### Hosting notes

- Deploy the contents of `_site/` to any static host (Netlify, Vercel, GitHub Pages, etc.).
- For Decap CMS to work you will need to configure the `backend` section in `admin/config.yml` to match your Git provider or use Netlify Identity/git‑gateway.

