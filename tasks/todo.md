# Long description as rich text

## Plan

- [x] Switch `longDescription` to markdown (rich text) in Decap CMS
- [x] Add markdown render filter; use it on detail page with `w-richtext` / `text-rich-text`
- [x] Ensure existing newline paragraphs convert/render correctly
- [x] Regenerate CMS config; browser-verify paragraph breaks on detail

## Review

- CMS: `longDescription` widget → `markdown` (Decap rich text)
- Build: `markdown` Liquid filter via `markdown-it` (`breaks: true` so single newlines become `<br>`, blank lines → `<p>`)
- Detail: `text-rich-text w-richtext` + `{{ … | markdown }}`
- Content: normalized existing longDescriptions (trim / collapse 3+ newlines)
- Verified Arya detail: 3 `<p>` paragraphs; CMS editor shows multi-paragraph Podrobný popis
