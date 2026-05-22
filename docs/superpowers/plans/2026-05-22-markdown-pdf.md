# Markdown → Branded PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a CLI utility at `tools/md-to-pdf/convert.mjs` that converts frontmatter-annotated markdown into branded Pearce Labs PDFs via Puppeteer.

**Architecture:** Parse YAML frontmatter and markdown body, inject into a branded HTML template, then print to PDF with Puppeteer's headless Chrome. Fonts are embedded as base64 data URIs from the existing `@fontsource` packages so no network call or `--allow-file-access-from-files` flag is needed.

**Tech Stack:** Node.js (ESM), `puppeteer`, `marked`, `gray-matter`, `node:test` for tests.

---

## File Map

| Path | Role |
|---|---|
| `tools/md-to-pdf/styles.mjs` | Builds the CSS string; reads font files and embeds as base64 data URIs |
| `tools/md-to-pdf/template.mjs` | `buildHtml({title,client,date,bodyHtml,css})` → full HTML document string |
| `tools/md-to-pdf/convert.mjs` | CLI entry point; orchestrates parse → render → PDF write |
| `tools/md-to-pdf/test/styles.test.mjs` | Unit tests for `buildCss()` |
| `tools/md-to-pdf/test/template.test.mjs` | Unit tests for `buildHtml()` |
| `tools/md-to-pdf/test/convert.test.mjs` | Integration test: runs the full CLI against a temp fixture |

---

## Task 1: Install dependencies and scaffold directory

**Files:**
- Modify: `package.json`
- Create: `tools/md-to-pdf/` (directory only, files come in later tasks)

- [ ] **Step 1: Install npm packages**

```bash
npm install puppeteer marked gray-matter
```

Expected: packages added to `node_modules/`, `package.json` `dependencies` updated with `puppeteer`, `marked`, and `gray-matter`.

- [ ] **Step 2: Create the tools directory**

```bash
mkdir -p tools/md-to-pdf/test
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install puppeteer, marked, gray-matter for md-to-pdf"
```

---

## Task 2: Implement `styles.mjs`

**Files:**
- Create: `tools/md-to-pdf/styles.mjs`
- Create: `tools/md-to-pdf/test/styles.test.mjs`

The `buildCss()` function reads woff2 font files from `node_modules/@fontsource/` and returns a CSS string with fonts embedded as base64 data URIs plus all branding styles.

- [ ] **Step 1: Write the failing test**

Create `tools/md-to-pdf/test/styles.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCss } from '../styles.mjs';

test('buildCss returns a non-empty string', () => {
  const css = buildCss();
  assert.equal(typeof css, 'string');
  assert.ok(css.length > 0);
});

test('buildCss embeds Schibsted Grotesk font', () => {
  const css = buildCss();
  assert.ok(css.includes('Schibsted Grotesk'));
  assert.ok(css.includes('data:font/woff2;base64,'));
});

test('buildCss embeds IBM Plex Mono font', () => {
  const css = buildCss();
  assert.ok(css.includes('IBM Plex Mono'));
});

test('buildCss includes branding color tokens', () => {
  const css = buildCss();
  assert.ok(css.includes('#0C0C0A'));   // ink
  assert.ok(css.includes('#F7F6F2'));   // paper
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
node --test tools/md-to-pdf/test/styles.test.mjs
```

Expected: fails with `Cannot find module '../styles.mjs'`.

- [ ] **Step 3: Implement `styles.mjs`**

Create `tools/md-to-pdf/styles.mjs`:

```javascript
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../');

function fontUri(relativePath) {
  const buf = readFileSync(path.join(root, relativePath));
  return `data:font/woff2;base64,${buf.toString('base64')}`;
}

export function buildCss() {
  const sg400 = fontUri('node_modules/@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-400-normal.woff2');
  const sg700 = fontUri('node_modules/@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-700-normal.woff2');
  const sg900 = fontUri('node_modules/@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-900-normal.woff2');
  const ibm400 = fontUri('node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2');
  const ibm700 = fontUri('node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-700-normal.woff2');

  return `
@font-face { font-family: 'Schibsted Grotesk'; font-weight: 400; font-style: normal; src: url('${sg400}') format('woff2'); }
@font-face { font-family: 'Schibsted Grotesk'; font-weight: 700; font-style: normal; src: url('${sg700}') format('woff2'); }
@font-face { font-family: 'Schibsted Grotesk'; font-weight: 900; font-style: normal; src: url('${sg900}') format('woff2'); }
@font-face { font-family: 'IBM Plex Mono'; font-weight: 400; font-style: normal; src: url('${ibm400}') format('woff2'); }
@font-face { font-family: 'IBM Plex Mono'; font-weight: 700; font-style: normal; src: url('${ibm700}') format('woff2'); }

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink:    #0C0C0A;
  --paper:  #F7F6F2;
  --accent: oklch(47.3% 0.137 46.201);
  --stone:  #78716c;
  --stone-light: #e7e5e4;
}

body {
  font-family: 'Schibsted Grotesk', sans-serif;
  color: var(--ink);
  background: var(--paper);
  font-size: 10pt;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ── Cover page ─────────────────────────────────── */
.cover {
  page-break-after: always;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20mm;
  background: var(--paper);
}

.cover-wordmark {
  font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.025em;
  color: var(--ink);
}

.cover-wordmark .slash {
  color: var(--accent);
  margin: 0 2px;
}

.cover-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cover-title {
  font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: -0.025em;
  line-height: 1;
  color: var(--ink);
  margin-bottom: 0.75rem;
}

.cover-client {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--stone);
}

.cover-footer-rule {
  height: 1px;
  background: var(--accent);
  margin-bottom: 10px;
}

.cover-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.cover-meta {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--stone);
}

/* ── Body pages ─────────────────────────────────── */
@page { margin: 20mm; }

/* ── Prose ──────────────────────────────────────── */
.prose h1 {
  font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 1.875rem;
  font-weight: 900;
  letter-spacing: -0.025em;
  line-height: 1;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.prose h2 {
  font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
}

.prose h3 {
  font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.prose p {
  font-size: 1rem;
  line-height: 1.625;
  margin-bottom: 1rem;
}

.prose ul, .prose ol {
  padding-left: 1.25rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.prose ul { list-style-type: disc; }
.prose ol { list-style-type: decimal; }

.prose li {
  font-size: 1rem;
  line-height: 1.625;
  margin-bottom: 0.25rem;
}

.prose a {
  color: var(--accent);
  text-decoration: underline;
}

.prose code {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.875rem;
  background: var(--stone-light);
  padding: 0.1em 0.3em;
  border-radius: 2px;
}

.prose pre {
  background: var(--stone-light);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  overflow-x: hidden;
}

.prose pre code {
  background: none;
  padding: 0;
}

.prose hr {
  border: none;
  border-top: 1px solid var(--stone);
  margin: 2rem 0;
}

.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.875rem;
}

.prose th {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  border-bottom: 1px solid var(--stone);
  padding: 0.5rem;
  text-align: left;
}

.prose td {
  padding: 0.5rem;
  border-bottom: 1px solid var(--stone-light);
  line-height: 1.4;
}

.prose strong { font-weight: 700; }
.prose em { font-style: italic; }
`;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
node --test tools/md-to-pdf/test/styles.test.mjs
```

Expected: all 4 tests pass. Note: `buildCss()` reads font files at call time, so this will take a second while base64-encoding the woff2 files.

- [ ] **Step 5: Commit**

```bash
git add tools/md-to-pdf/styles.mjs tools/md-to-pdf/test/styles.test.mjs
git commit -m "feat: add branded CSS builder for md-to-pdf"
```

---

## Task 3: Implement `template.mjs`

**Files:**
- Create: `tools/md-to-pdf/template.mjs`
- Create: `tools/md-to-pdf/test/template.test.mjs`

`buildHtml()` returns a complete HTML document string. The cover page uses a `<div class="cover">` that fills a full printed page via `page-break-after: always; height: 100vh`. Body content follows in a `<div class="prose">`.

- [ ] **Step 1: Write the failing test**

Create `tools/md-to-pdf/test/template.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildHtml } from '../template.mjs';

const base = { title: 'My Proposal', client: 'Acme Corp', date: 'May 2026', bodyHtml: '<p>Hello</p>', css: '' };

test('buildHtml returns a complete HTML document', () => {
  const html = buildHtml(base);
  assert.ok(html.startsWith('<!DOCTYPE html>'));
  assert.ok(html.includes('<html'));
  assert.ok(html.includes('</html>'));
});

test('buildHtml includes the document title', () => {
  const html = buildHtml(base);
  assert.ok(html.includes('My Proposal'));
});

test('buildHtml includes the client name', () => {
  const html = buildHtml(base);
  assert.ok(html.includes('Acme Corp'));
});

test('buildHtml includes the date', () => {
  const html = buildHtml(base);
  assert.ok(html.includes('May 2026'));
});

test('buildHtml includes the body HTML', () => {
  const html = buildHtml(base);
  assert.ok(html.includes('<p>Hello</p>'));
});

test('buildHtml includes the wordmark slash', () => {
  const html = buildHtml(base);
  assert.ok(html.includes('class="slash"'));
});

test('buildHtml handles empty frontmatter fields without throwing', () => {
  const html = buildHtml({ title: '', client: '', date: '', bodyHtml: '', css: '' });
  assert.ok(html.startsWith('<!DOCTYPE html>'));
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
node --test tools/md-to-pdf/test/template.test.mjs
```

Expected: fails with `Cannot find module '../template.mjs'`.

- [ ] **Step 3: Implement `template.mjs`**

Create `tools/md-to-pdf/template.mjs`:

```javascript
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildHtml({ title, client, date, bodyHtml, css }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>${css}</style>
</head>
<body>
  <div class="cover">
    <div class="cover-wordmark">pearce<span class="slash">/</span>labs</div>
    <div class="cover-body">
      <h1 class="cover-title">${esc(title)}</h1>
      <p class="cover-client">${esc(client)}</p>
    </div>
    <div>
      <div class="cover-footer-rule"></div>
      <div class="cover-footer">
        <span class="cover-meta">Falls Church, VA&nbsp;&nbsp;·&nbsp;&nbsp;pearcelabs.com</span>
        <span class="cover-meta">${esc(date)}</span>
      </div>
    </div>
  </div>
  <div class="prose">${bodyHtml}</div>
</body>
</html>`;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
node --test tools/md-to-pdf/test/template.test.mjs
```

Expected: all 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add tools/md-to-pdf/template.mjs tools/md-to-pdf/test/template.test.mjs
git commit -m "feat: add HTML template builder for md-to-pdf"
```

---

## Task 4: Implement `convert.mjs` and integration test

**Files:**
- Create: `tools/md-to-pdf/convert.mjs`
- Create: `tools/md-to-pdf/test/convert.test.mjs`

The CLI reads the input `.md` file, parses frontmatter, converts markdown to HTML, builds the full HTML document, launches Puppeteer, and writes the PDF. Missing frontmatter fields produce a warning but do not abort.

- [ ] **Step 1: Write the failing integration test**

Create `tools/md-to-pdf/test/convert.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, statSync, writeFileSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const convertScript = path.join(__dirname, '../convert.mjs');

test('exits with error when no input file is given', () => {
  const result = spawnSync('node', [convertScript], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.ok(result.stderr.includes('Usage:'));
});

test('exits with error when input file does not exist', () => {
  const result = spawnSync('node', [convertScript, '/tmp/nonexistent.md'], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
});

test('converts markdown to PDF', { timeout: 60000 }, () => {
  const tmpInput = path.join(os.tmpdir(), `test-${Date.now()}.md`);
  const tmpOutput = path.join(os.tmpdir(), `test-${Date.now()}.pdf`);

  writeFileSync(tmpInput, `---
title: Integration Test Proposal
client: Test Client Inc
date: May 2026
---

## Overview

This is a test document for integration testing.

- Item one
- Item two

### Details

Some additional detail paragraph.
`);

  try {
    execFileSync('node', [convertScript, tmpInput, tmpOutput], {
      timeout: 60000,
      encoding: 'utf8',
    });
    assert.ok(existsSync(tmpOutput), 'PDF file should be created');
    const { size } = statSync(tmpOutput);
    assert.ok(size > 5000, `PDF should be non-trivial size, got ${size} bytes`);
  } finally {
    if (existsSync(tmpInput)) unlinkSync(tmpInput);
    if (existsSync(tmpOutput)) unlinkSync(tmpOutput);
  }
});

test('defaults output path to input filename with .pdf extension', { timeout: 60000 }, () => {
  const tmpInput = path.join(os.tmpdir(), `test-${Date.now()}.md`);
  const expectedOutput = tmpInput.replace(/\.md$/, '.pdf');

  writeFileSync(tmpInput, `---
title: Default Output Test
client: Client
date: May 2026
---

Hello world.
`);

  try {
    execFileSync('node', [convertScript, tmpInput], { timeout: 60000, encoding: 'utf8' });
    assert.ok(existsSync(expectedOutput), 'PDF should be created next to the .md file');
  } finally {
    if (existsSync(tmpInput)) unlinkSync(tmpInput);
    if (existsSync(expectedOutput)) unlinkSync(expectedOutput);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
node --test tools/md-to-pdf/test/convert.test.mjs
```

Expected: first two tests may pass if they exit immediately, but the PDF tests fail with `Cannot find module '../convert.mjs'` or similar.

- [ ] **Step 3: Implement `convert.mjs`**

Create `tools/md-to-pdf/convert.mjs`:

```javascript
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import puppeteer from 'puppeteer';
import { buildCss } from './styles.mjs';
import { buildHtml } from './template.mjs';

const [, , inputArg, outputArg] = process.argv;

if (!inputArg) {
  console.error('Usage: node convert.mjs <input.md> [output.pdf]');
  process.exit(1);
}

const inputPath = path.resolve(inputArg);

if (!existsSync(inputPath)) {
  console.error(`Error: file not found: ${inputPath}`);
  process.exit(1);
}

const outputPath = outputArg
  ? path.resolve(outputArg)
  : inputPath.replace(/\.md$/, '.pdf');

const outputDir = path.dirname(outputPath);
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const source = readFileSync(inputPath, 'utf8');
const { data, content } = matter(source);

const title  = data.title  ?? '';
const client = data.client ?? '';
const date   = data.date   ?? '';

if (!title)  console.warn('Warning: missing frontmatter field "title"');
if (!client) console.warn('Warning: missing frontmatter field "client"');
if (!date)   console.warn('Warning: missing frontmatter field "date"');

const bodyHtml = marked.parse(content);
const css      = buildCss();
const html     = buildHtml({ title, client, date, bodyHtml, css });

const browser = await puppeteer.launch({ headless: true });
const page    = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });

const pdfBuffer = await page.pdf({
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  margin: { top: '70px', bottom: '50px', left: '20mm', right: '20mm' },
  headerTemplate: `
    <div style="width:100%;padding:4px 20mm 0;font-size:10px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <span style="font-family:'Schibsted Grotesk',sans-serif;font-weight:900;letter-spacing:-0.025em;font-size:13px;color:#0C0C0A;">
          pearce<span style="color:oklch(47.3% 0.137 46.201);margin:0 2px;">/</span>labs
        </span>
        <span style="font-family:'IBM Plex Mono',monospace;font-size:8px;text-transform:uppercase;letter-spacing:0.1em;color:#78716c;">
          ${title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </span>
      </div>
      <div style="margin-top:6px;height:1px;background:#78716c;"></div>
    </div>`,
  footerTemplate: `
    <div style="width:100%;padding:0 20mm;border-top:1px solid #78716c;display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:8px;text-transform:uppercase;letter-spacing:0.05em;color:#78716c;padding-top:6px;">
      <span>Pearce Labs, LLC.</span>
      <span class="pageNumber"></span>
    </div>`,
});

await browser.close();

writeFileSync(outputPath, pdfBuffer);
console.log(`PDF written to ${outputPath}`);
```

- [ ] **Step 4: Run integration tests**

```bash
node --test tools/md-to-pdf/test/convert.test.mjs
```

Expected: all 4 tests pass. The two PDF-generating tests will each take 5–15 seconds as Puppeteer launches Chrome.

- [ ] **Step 5: Commit**

```bash
git add tools/md-to-pdf/convert.mjs tools/md-to-pdf/test/convert.test.mjs
git commit -m "feat: add convert.mjs CLI and integration tests for md-to-pdf"
```

---

## Task 5: Create sample fixture and run end-to-end smoke test

**Files:**
- Create: `tools/md-to-pdf/fixtures/sample-proposal.md`

This task creates a realistic sample document to validate the full output visually and leaves it in the repo as a reference.

- [ ] **Step 1: Create the fixture**

Create `tools/md-to-pdf/fixtures/sample-proposal.md`:

```markdown
---
title: Project Proposal
client: Acme Corp
date: May 2026
---

## Overview

Thank you for the opportunity to submit this proposal. Pearce Labs brings full-stack engineering expertise to help Acme Corp modernize its data infrastructure and ship faster.

## Scope of Work

### Phase 1 — Discovery

We'll spend two weeks auditing your current systems, interviewing stakeholders, and producing a technical specification.

- Systems audit (existing APIs, databases, integrations)
- Stakeholder interviews (engineering, product, operations)
- Technical specification document

### Phase 2 — Implementation

Eight weeks of hands-on development, delivered in two-week sprints with demos at each milestone.

- Sprint 1–2: Core data pipeline and API layer
- Sprint 3–4: Dashboard and reporting interface
- Sprint 5–6: QA, performance hardening, and documentation

## Timeline

| Milestone | Duration | Deliverable |
|---|---|---|
| Discovery | 2 weeks | Technical spec |
| Sprint 1–2 | 4 weeks | Core pipeline |
| Sprint 3–4 | 4 weeks | Dashboard |
| Sprint 5–6 | 4 weeks | Production-ready release |

## Pricing

Engagements are billed at a fixed project rate. A detailed breakdown is provided in the attached Statement of Work.

## Next Steps

We're ready to start as soon as the week of June 9th. Please review this proposal and reach out with any questions at email@pearcelabs.com or (571) 786-8962.
```

- [ ] **Step 2: Generate the sample PDF**

```bash
node tools/md-to-pdf/convert.mjs tools/md-to-pdf/fixtures/sample-proposal.md tools/md-to-pdf/fixtures/sample-proposal.pdf
```

Expected output: `PDF written to .../fixtures/sample-proposal.pdf`

- [ ] **Step 3: Open and visually inspect the PDF**

```bash
open tools/md-to-pdf/fixtures/sample-proposal.pdf
```

Check:
- Cover page: wordmark top-left, document title centered, client name below in mono, accent rule and location/date at bottom
- Body pages: running header (wordmark left, title right) with HR, prose content, running footer (Pearce Labs left, page number right)
- Fonts render correctly (Schibsted Grotesk headings, IBM Plex Mono labels)
- Colors match brand (ink body text, accent slash and links)
- Table renders with mono column headers

- [ ] **Step 4: Add fixture to `.gitignore` pattern or commit**

The `.md` fixture is useful as a reference; the generated `.pdf` should not be committed. Add to `.gitignore`:

```
tools/md-to-pdf/fixtures/*.pdf
```

- [ ] **Step 5: Commit**

```bash
git add tools/md-to-pdf/fixtures/sample-proposal.md .gitignore
git commit -m "feat: add sample fixture for md-to-pdf smoke testing"
```

---

## Run all tests

```bash
node --test tools/md-to-pdf/test/styles.test.mjs tools/md-to-pdf/test/template.test.mjs tools/md-to-pdf/test/convert.test.mjs
```

Expected: all tests pass (allow 30–60 seconds for the integration tests).
