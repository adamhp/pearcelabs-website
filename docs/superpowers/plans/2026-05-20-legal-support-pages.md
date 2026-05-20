# Legal & Support Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Privacy Policy, Terms of Service, and Support pages with a shared content layout, plus a footer nav row linking to all three.

**Architecture:** Extract the footer into a reusable `Footer.astro` component (adding a nav row), create a `ContentLayout.astro` that wraps `Layout.astro` for prose pages, then create three new page files using that layout.

**Tech Stack:** Astro 5, Tailwind CSS v4 (CSS-first, no config file), static output deployed on Netlify.

---

## File Map

| Action | File |
|--------|------|
| Modify | `src/styles/global.css` — add `.prose` styles |
| Create | `src/components/Footer.astro` — extracted footer + nav row |
| Create | `src/layouts/ContentLayout.astro` — prose page wrapper |
| Modify | `src/pages/index.astro` — replace inline footer with `<Footer />` |
| Create | `src/pages/privacy.astro` |
| Create | `src/pages/terms.astro` |
| Create | `src/pages/support.astro` |

---

### Task 1: Add prose styles to global.css

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add `.prose` layer block**

Open `src/styles/global.css` and append this block after the existing `@layer components { ... }` block:

```css
@layer components {
  /* Prose — long-form content pages */
  .prose h1 {
    font-size: 1.875rem;
    font-weight: 900;
    letter-spacing: -0.025em;
    line-height: 1;
    margin-bottom: 0.5rem;
  }
  .prose h2 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-top: 2.5rem;
    margin-bottom: 0.75rem;
  }
  .prose h3 {
    font-size: 1rem;
    font-weight: 700;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .prose p {
    font-size: 0.875rem;
    line-height: 1.625;
    margin-bottom: 1rem;
  }
  .prose ul {
    list-style-type: disc;
    padding-left: 1.25rem;
    margin-bottom: 1rem;
  }
  .prose ul li {
    font-size: 0.875rem;
    line-height: 1.625;
    margin-bottom: 0.25rem;
  }
  .prose a {
    color: var(--color-accent);
    text-decoration: underline;
  }
}
```

- [ ] **Step 2: Verify build passes**

```bash
cd /Users/adam/dev/pearcelabs-website && npm run build
```

Expected: build completes with no errors. Ignore "dist/" output size lines.

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/pearcelabs-website
git add src/styles/global.css
git commit -m "style: add prose layer for long-form content pages"
```

---

### Task 2: Create Footer component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create the file**

Create `src/components/Footer.astro` with this exact content:

```astro
---
import Wordmark from "./Wordmark.astro";
---

<footer class="py-4">
  <div class="flex h-6 items-center justify-between gap-4">
    <Wordmark />
    <span class="font-mono text-xs tracking-widest text-stone-500 uppercase"
      >Falls Church, VA</span
    >
    <span class="font-mono text-xs text-stone-500">© 2026 Pearce Labs, LLC.</span>
  </div>
  <hr class="my-2 border-stone-500" />
  <div
    class="flex h-6 items-center justify-center gap-4 font-mono text-xs tracking-widest"
  >
    <a
      href="/privacy"
      class="text-stone-500 uppercase transition-colors duration-200 hover:text-accent"
      >Privacy</a
    >
    <span class="text-accent">·</span>
    <a
      href="/terms"
      class="text-stone-500 uppercase transition-colors duration-200 hover:text-accent"
      >Terms</a
    >
    <span class="text-accent">·</span>
    <a
      href="/support"
      class="text-stone-500 uppercase transition-colors duration-200 hover:text-accent"
      >Support</a
    >
  </div>
</footer>
```

- [ ] **Step 2: Verify build passes**

```bash
cd /Users/adam/dev/pearcelabs-website && npm run build
```

Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/pearcelabs-website
git add src/components/Footer.astro
git commit -m "feat: add Footer component with nav row"
```

---

### Task 3: Create ContentLayout

**Files:**
- Create: `src/layouts/ContentLayout.astro`

- [ ] **Step 1: Create the file**

Create `src/layouts/ContentLayout.astro` with this exact content:

```astro
---
import Footer from "../components/Footer.astro";
import Wordmark from "../components/Wordmark.astro";
import Layout from "./Layout.astro";

interface Props {
  title?: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<Layout title={title} description={description}>
  <header class="py-4">
    <div class="flex h-6 items-center justify-between">
      <Wordmark />
      <a
        href="/"
        class="font-mono text-xs tracking-widest text-stone-500 uppercase transition-colors duration-200 hover:text-accent"
        >← Home</a
      >
    </div>
    <hr class="my-2 border-stone-500" />
  </header>
  <main class="prose mx-auto max-w-2xl px-4 py-12">
    <slot />
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 2: Verify build passes**

```bash
cd /Users/adam/dev/pearcelabs-website && npm run build
```

Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/pearcelabs-website
git add src/layouts/ContentLayout.astro
git commit -m "feat: add ContentLayout for prose pages"
```

---

### Task 4: Update index.astro to use Footer component

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add Footer import**

In `src/pages/index.astro`, add `import Footer from "../components/Footer.astro";` to the frontmatter imports block. The imports section should look like:

```astro
---
import Footer from "../components/Footer.astro";
import Wordmark from "../components/Wordmark.astro";
import Layout from "../layouts/Layout.astro";
```

- [ ] **Step 2: Replace the inline footer**

Find the existing footer in `src/pages/index.astro` (near the bottom, before `<script>`):

```astro
  <!-- FOOTER -->
  <footer class="flex h-6 items-center justify-between gap-4 py-4">
    <Wordmark />
    <span class="font-mono text-xs tracking-widest text-stone-500 uppercase"
      >Falls Church, VA</span
    >
    <span class="font-mono text-xs text-stone-500"
      >© 2026 Pearce Labs, LLC.</span
    >
  </footer>
```

Replace it with:

```astro
  <!-- FOOTER -->
  <Footer />
```

- [ ] **Step 3: Verify build passes**

```bash
cd /Users/adam/dev/pearcelabs-website && npm run build
```

Expected: build completes with no errors.

- [ ] **Step 4: Start dev server and verify visually**

```bash
cd /Users/adam/dev/pearcelabs-website && npm run dev
```

Open http://localhost:4321 in a browser. Scroll to the bottom. Verify:
- Wordmark, "Falls Church, VA", and copyright line appear in the top row
- A rule separator appears
- "PRIVACY · TERMS · SUPPORT" nav links appear in the second row
- Hover on each link turns it accent color

Stop the dev server with Ctrl+C when done.

- [ ] **Step 5: Commit**

```bash
cd /Users/adam/dev/pearcelabs-website
git add src/pages/index.astro
git commit -m "refactor: replace inline footer with Footer component"
```

---

### Task 5: Create Privacy Policy page

**Files:**
- Create: `src/pages/privacy.astro`

- [ ] **Step 1: Create the file**

Create `src/pages/privacy.astro` with this exact content:

```astro
---
import ContentLayout from "../layouts/ContentLayout.astro";
---

<ContentLayout
  title="Privacy Policy — Pearce Labs"
  description="Privacy policy for Pearce Labs."
>
  <h1>Privacy Policy</h1>
  <p class="mt-1 mb-8 font-mono text-xs tracking-widest text-stone-500 uppercase">
    Effective May 20, 2026
  </p>

  <h2>Information We Collect</h2>
  <p>
    When you fill out the contact form on this site, we collect your name, email
    address, and the message you submit. We also collect analytics data —
    including pages visited, referrer, and device type — through PostHog. We do
    not have an account system, and we do not collect payment information
    directly.
  </p>

  <h2>How We Use It</h2>
  <p>
    We use the information you provide to respond to your inquiry. Analytics data
    helps us understand how the site is being used and improve it over time. We
    do not sell your information or share it with third parties, except for
    service providers we use to operate this site: Netlify (hosting and form
    processing) and PostHog (analytics).
  </p>

  <h2>Cookies &amp; Analytics</h2>
  <p>
    PostHog may set cookies or use local storage to track sessions and behavior.
    These are analytics cookies only — we do not use advertising or tracking
    cookies.
  </p>

  <h2>Data Retention</h2>
  <p>
    Contact form submissions are kept for as long as necessary to respond and
    follow up. Analytics data is retained according to PostHog's own data
    retention policy.
  </p>

  <h2>Your Rights</h2>
  <p>
    You may request access to or deletion of your personal data at any time by
    contacting us at <a href="mailto:hello@pearcelabs.com"
      >hello@pearcelabs.com</a
    >.
  </p>

  <h2>Contact</h2>
  <p>
    <a href="mailto:hello@pearcelabs.com">hello@pearcelabs.com</a>
  </p>
</ContentLayout>
```

- [ ] **Step 2: Verify build and check the page**

```bash
cd /Users/adam/dev/pearcelabs-website && npm run build
```

Expected: build completes with no errors and `dist/privacy/index.html` is created.

Start dev server and open http://localhost:4321/privacy. Verify:
- Header shows Wordmark and "← Home" link
- Privacy Policy heading and effective date appear
- All six sections render
- Footer with nav links appears at the bottom
- "← Home" navigates back to the landing page

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/pearcelabs-website
git add src/pages/privacy.astro
git commit -m "feat: add Privacy Policy page"
```

---

### Task 6: Create Terms of Service page

**Files:**
- Create: `src/pages/terms.astro`

- [ ] **Step 1: Create the file**

Create `src/pages/terms.astro` with this exact content:

```astro
---
import ContentLayout from "../layouts/ContentLayout.astro";
---

<ContentLayout
  title="Terms of Service — Pearce Labs"
  description="Terms of service for Pearce Labs."
>
  <h1>Terms of Service</h1>
  <p class="mt-1 mb-8 font-mono text-xs tracking-widest text-stone-500 uppercase">
    Effective May 20, 2026
  </p>

  <h2>Services</h2>
  <p>
    Pearce Labs provides custom software development, AI implementation, data
    engineering, web development, and technology consulting services. The scope
    of services for each engagement is defined in a separate project agreement or
    statement of work.
  </p>

  <h2>Payment</h2>
  <p>
    Services are invoiced on a per-project or retainer basis. Payment is due
    within 15 days of invoice unless otherwise agreed in writing.
  </p>

  <h2>Intellectual Property</h2>
  <p>
    Upon receipt of full payment, the client owns all deliverables produced
    specifically for that engagement. Pearce Labs retains ownership of any
    general tools, frameworks, or know-how developed independently of the
    project.
  </p>

  <h2>Confidentiality</h2>
  <p>
    Both parties agree to keep the other's confidential information private.
    Client information shared during an engagement will not be disclosed to third
    parties.
  </p>

  <h2>Limitation of Liability</h2>
  <p>
    Pearce Labs' total liability for any claim arising from an engagement is
    limited to the fees paid for that engagement. In no event will Pearce Labs be
    liable for indirect, incidental, or consequential damages.
  </p>

  <h2>Governing Law</h2>
  <p>
    These terms are governed by the laws of the Commonwealth of Virginia. Any
    disputes will be resolved in the courts of Fairfax County, Virginia.
  </p>

  <h2>Contact</h2>
  <p>
    <a href="mailto:hello@pearcelabs.com">hello@pearcelabs.com</a>
  </p>
</ContentLayout>
```

- [ ] **Step 2: Verify build and check the page**

```bash
cd /Users/adam/dev/pearcelabs-website && npm run build
```

Expected: build completes with no errors and `dist/terms/index.html` is created.

Open http://localhost:4321/terms. Verify all seven sections render correctly with proper heading hierarchy.

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/pearcelabs-website
git add src/pages/terms.astro
git commit -m "feat: add Terms of Service page"
```

---

### Task 7: Create Support page

**Files:**
- Create: `src/pages/support.astro`

- [ ] **Step 1: Create the file**

Create `src/pages/support.astro` with this exact content:

```astro
---
import ContentLayout from "../layouts/ContentLayout.astro";
---

<ContentLayout
  title="Support — Pearce Labs"
  description="Frequently asked questions and contact information for Pearce Labs."
>
  <h1>Support</h1>

  <h2>Frequently Asked Questions</h2>

  <h3>What kinds of businesses do you work with?</h3>
  <p>
    Primarily small businesses in the DC metro area, though we work remotely
    with clients nationwide. If you have a technical challenge, we're happy to
    talk regardless of location.
  </p>

  <h3>How do I start a project?</h3>
  <p>
    Fill out the <a href="/#contact">contact form</a> or email us directly. The
    first call is free — we'll talk through what you're working on and whether
    we're a good fit.
  </p>

  <h3>What does a typical engagement look like?</h3>
  <p>
    Most projects start with a discovery call, followed by a proposal or
    statement of work. From there we build iteratively and hand off a finished
    product — or stay on as a retainer for ongoing work.
  </p>

  <h3>Do you offer ongoing support after launch?</h3>
  <p>
    Yes. We offer post-launch support on a retainer basis or as-needed. We'd
    rather keep things running well than hand off and disappear.
  </p>

  <h3>How quickly do you respond?</h3>
  <p>We typically respond within one business day.</p>

  <h2>Contact</h2>
  <p>
    Email: <a href="mailto:hello@pearcelabs.com">hello@pearcelabs.com</a><br />
    Phone: <a href="tel:+15717868962">(571) 786-8962</a>
  </p>
  <p>We typically respond within one business day.</p>
</ContentLayout>
```

- [ ] **Step 2: Verify build and check the page**

```bash
cd /Users/adam/dev/pearcelabs-website && npm run build
```

Expected: build completes with no errors and `dist/support/index.html` is created.

Open http://localhost:4321/support. Verify:
- "Support" heading appears
- FAQ section has five questions with h3 headings
- Contact section shows email and phone as clickable links
- Footer nav links back to Privacy and Terms

- [ ] **Step 3: Final cross-page check**

With dev server running, verify:
- http://localhost:4321 — footer nav row shows Privacy · Terms · Support
- http://localhost:4321/privacy — loads, "← Home" works, footer visible
- http://localhost:4321/terms — loads, "← Home" works, footer visible
- http://localhost:4321/support — loads, "← Home" works, contact link works

- [ ] **Step 4: Commit**

```bash
cd /Users/adam/dev/pearcelabs-website
git add src/pages/support.astro
git commit -m "feat: add Support page"
```

---

### Task 8: Push to remote

- [ ] **Step 1: Push all commits**

```bash
cd /Users/adam/dev/pearcelabs-website && git push
```

Expected: all commits pushed to `origin/main`. Netlify will pick up the push and deploy automatically.
