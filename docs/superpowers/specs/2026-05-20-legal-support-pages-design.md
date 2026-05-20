# Legal & Support Pages Design

**Date:** 2026-05-20
**Status:** Approved

## Overview

Add three new pages to the Pearce Labs website — Privacy Policy, Terms of Service, and Support — plus a footer navigation row linking to all three. Content is drafted-in-place boilerplate appropriate for a small digital services agency.

---

## Architecture

### New Components

**`src/components/Footer.astro`**
Extracted from `index.astro`. Replaces the inline footer markup. Adds a second row with nav links to Privacy, Terms, and Support pages.

**`src/layouts/ContentLayout.astro`**
Extends `Layout.astro`. Wraps content in a centered column with appropriate max-width, padding, and prose typography. Used by all three new pages.

### New Pages

| File | Route | Title |
|------|-------|-------|
| `src/pages/privacy.astro` | `/privacy` | Privacy Policy |
| `src/pages/terms.astro` | `/terms` | Terms of Service |
| `src/pages/support.astro` | `/support` | Support |

### Modified Files

- `src/pages/index.astro` — replace inline footer with `<Footer />` component
- `src/styles/global.css` — add prose styles for long-form content pages

---

## Footer Component

Two-row layout, consistent with existing header style:

```
Row 1 (existing): [Wordmark]   Falls Church, VA   © 2026 Pearce Labs, LLC.
Row 2 (new):                   Privacy · Terms · Support
```

Row 2 uses `font-mono text-xs tracking-widest text-stone-500` with `·` separators. Links use the existing hover style (`hover:text-accent hover:border-accent`). Both rows separated by `<hr class="border-stone-500">`.

---

## ContentLayout

Wraps `Layout.astro`. Adds:
- Header with `<Wordmark />` and back-link to `/` ("← Home")
- `<main>` with `max-w-2xl mx-auto py-16 px-4` and prose typography
- Footer via `<Footer />`

Prose styles in `global.css` scoped to `.prose`:
- `h1`: `text-3xl font-black tracking-tight mb-2`
- `h2`: `text-xl font-bold mt-10 mb-3`
- `p`, `li`: `text-sm leading-relaxed text-ink`
- `ul`: `list-disc pl-5 space-y-1`
- `a`: `text-accent underline`

---

## Page Content

### Privacy Policy (`/privacy`)

**Effective date:** May 20, 2026

Sections:
1. **Information We Collect** — contact form submissions (name, email, message); analytics data (pages visited, referrer, device type) via PostHog; no account system, no payment data collected directly
2. **How We Use It** — respond to inquiries; improve the site; no sale or sharing with third parties except service providers (Netlify for hosting/forms, PostHog for analytics)
3. **Cookies & Analytics** — PostHog may set cookies or use local storage; no advertising cookies
4. **Data Retention** — form submissions kept as long as needed to respond; analytics data per PostHog's retention policy
5. **Your Rights** — contact hello@pearcelabs.com to request deletion or access
6. **Contact** — hello@pearcelabs.com

### Terms of Service (`/terms`)

**Effective date:** May 20, 2026

Sections:
1. **Services** — custom software, AI, data, web, consulting; scope defined per-project agreement
2. **Payment** — invoiced per-project or on retainer; net-15 unless otherwise agreed
3. **Intellectual Property** — client owns deliverables upon full payment; Pearce Labs retains rights to general tools and know-how
4. **Confidentiality** — mutual; client information not shared
5. **Limitation of Liability** — liability capped at fees paid for the relevant engagement; no consequential damages
6. **Governing Law** — Virginia law; disputes resolved in Fairfax County
7. **Contact** — hello@pearcelabs.com

### Support (`/support`)

**Purpose:** FAQ + contact info. No ticket system.

FAQ (5 questions):
1. **What kinds of businesses do you work with?** — Small businesses in the DC metro area; remote available
2. **How do I start a project?** — Fill out the contact form or email hello@pearcelabs.com; first call is free
3. **What does a typical engagement look like?** — Discovery call → proposal/SOW → iterative build → handoff/retainer
4. **Do you offer ongoing support after launch?** — Yes, retainer or as-needed basis
5. **How quickly do you respond?** — Within one business day

Contact block:
- Email: hello@pearcelabs.com
- Phone: (571) 786-8962
- Response time note: "We typically respond within one business day."

---

## Non-Goals

- No CMS or admin UI for editing legal content
- No cookie consent banner (PostHog is analytics-only, not advertising)
- No ticket/helpdesk system on the support page
- No separate mobile layout — ContentLayout is responsive by default

---

## Open Questions

None — all design decisions resolved.
