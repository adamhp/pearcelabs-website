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
  break-after: page;
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
  white-space: pre-wrap;
  word-break: break-all;
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
