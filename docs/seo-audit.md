# SEO Audit — Pearce Labs

_Last updated: 2026-05-21_

---

## What's Good

- Canonical URLs — correctly computed per-page
- robots.txt — clean, sitemap referenced
- Sitemap — `@astrojs/sitemap` configured
- JSON-LD structured data — `ProfessionalService` with address, geo, phone, services
- OG + Twitter Card — full coverage on all pages
- Unique page titles — each page has a distinct `<title>`
- Homepage meta description — keyword-rich, local geo signal
- Font loading — non-blocking `onload` pattern

---

## Issues

### High Priority

**1. Homepage `<title>` has no keywords**
`"Pearce Labs"` is pure brand. No one searching "software development Falls Church VA" will see it ranked.
- Suggested: `"Pearce Labs | Software Development & Tech Consulting — Falls Church, VA"`
- File: `src/pages/index.astro` (pass a `title` prop to `<Layout>`)

**2. Missing `og:image:alt`**
OG images without alt text miss accessibility scoring and some social platform previews.
```html
<meta property="og:image:alt" content="Pearce Labs — Software development and consulting for DC businesses" />
```
- File: `src/layouts/Layout.astro` (after line 104)

**3. JSON-LD missing `image` property**
Google's rich result validator flags this for `LocalBusiness`/`ProfessionalService` schemas.
```json
"image": "https://pearcelabs.com/og-image.png"
```
- File: `src/layouts/Layout.astro` (inside the `jsonLd` object, ~line 22)

**4. Typo in privacy page**
"We collet payment through Stripe." → "We **collect** payment through Stripe."
- File: `src/pages/privacy.astro:20`

**5. `theme_color` mismatch**
`src/layouts/Layout.astro:83` has `content="#F5F0E8"` (paper color), but `public/site.webmanifest` has `"theme_color": "#ffffff"`. Browser chrome will flash white on PWA launch.
- Fix: Change manifest to `"theme_color": "#F5F0E8"`

---

### Medium Priority

**6. `twitter:site` and `twitter:creator` missing**
Adds credibility signal for Twitter/X card previews. Low lift if a handle exists.
- File: `src/layouts/Layout.astro` (after line 112)

**7. JSON-LD missing `sameAs`**
Links entity to Google Business Profile, LinkedIn, etc. — important for Knowledge Graph.
```json
"sameAs": ["https://www.google.com/maps/...", "https://www.linkedin.com/company/pearcelabs"]
```
- File: `src/layouts/Layout.astro` (inside `jsonLd`)

**8. Legal/support pages indexed unnecessarily**
`privacy.astro`, `terms.astro`, and `support.astro` are in the sitemap. They don't rank for useful keywords but dilute crawl budget. `ContentLayout` should accept a `robots` prop and these pages should pass `noindex, follow`.
- Files: `src/layouts/ContentLayout.astro`, `src/pages/privacy.astro`, `src/pages/terms.astro`, `src/pages/support.astro`

**9. Web manifest missing `start_url`**
Without it, PWA install behavior is undefined in some browsers.
```json
"start_url": "/"
```
- File: `public/site.webmanifest`

**10. JSON-LD missing `openingHoursSpecification`**
Not required, but adds detail Google can surface in local search results.

---

### Lower Priority (Content / Strategy)

**11. Homepage visible copy has no geo or keyword signals**
The H1 reads "pearce / labs" and taglines are brand copy. All keyword content is in the meta description and JSON-LD — not in crawlable visible copy. Consider adding a visible line like "Based in Falls Church, VA. Serving businesses across the DC metro area." to the homepage body.

**12. Thin internal linking**
No `<a>` links in the services section body. No links from homepage to Support or other pages. Thin link graph overall.

**13. No content marketing surface**
No blog, case studies, or project write-ups. This is expected for a brochure site, but it's the primary ceiling for organic growth beyond branded search.

---

## Quick Wins

| # | Fix | File | Effort |
|---|-----|------|--------|
| 1 | Update `<title>` to include keywords | `src/pages/index.astro` | 5 min |
| 2 | Add `og:image:alt` | `src/layouts/Layout.astro:104` | 2 min |
| 3 | Add `image` to JSON-LD | `src/layouts/Layout.astro:22` | 2 min |
| 4 | Fix typo "collet" → "collect" | `src/pages/privacy.astro:20` | 1 min |
| 5 | Fix `theme_color` in manifest | `public/site.webmanifest` | 1 min |
| 6 | Add `start_url` to manifest | `public/site.webmanifest` | 1 min |
