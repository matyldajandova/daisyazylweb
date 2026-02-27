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
  - `/_includes/partials/global-styles.njk` – Webflow global style embeds.
  - `/_includes/partials/navbar.njk` – main navigation (uses `currentPage` from front‑matter).
  - `/_includes/partials/footer.njk` – footer (also uses `currentPage`).
- Pages are still regular `.html` files (`index.html`, `adopce.html`, `adopce-detail.html`, …) with very small Liquid tags for includes and loops.

### Animal data

- Adoption listings are driven from:

```text
/_data/animals.json
```

- `adopce.html` loops over the `animals` array from this file to render cards.
- When `animals` is empty, the original “Momentálně nemáme žádné pejsky a kočičky k adopci.” message is shown automatically.

### Minimal content editor (Decap CMS)

- A lightweight Git‑based editor is available at:

```text
/admin/
```

- Config file:

```text
/admin/config.yml
```

- The `animals` collection in Decap CMS edits the `_data/animals.json` file:
  - Add / edit / remove animals.
  - Fields match what the templates expect (`id`, `name`, `tags`, `image`, `shortDescription`, `detailUrl`, `adoptionStatus`, …).

### Hosting notes

- Deploy the contents of `_site/` to any static host (Netlify, Vercel, GitHub Pages, etc.).
- For Decap CMS to work you will need to configure the `backend` section in `admin/config.yml` to match your Git provider or use Netlify Identity/git‑gateway.

