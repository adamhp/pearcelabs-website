import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import puppeteer from 'puppeteer';
import { buildCss } from './styles.mjs';
import { buildHtml, esc } from './template.mjs';

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
const date   = data.date != null ? String(data.date) : '';

if (!title)  console.warn('Warning: missing frontmatter field "title"');
if (!client) console.warn('Warning: missing frontmatter field "client"');
if (!date)   console.warn('Warning: missing frontmatter field "date"');

const bodyHtml = marked.parse(content);
const css      = buildCss();
const html     = buildHtml({ title, client, date, bodyHtml, css });

let browser;
try {
  browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    margin: { top: '70px', bottom: '50px', left: '20mm', right: '20mm' },
    headerTemplate: `
      <div style="width:100%;padding:4px 20mm 0;font-size:10px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-family:sans-serif;font-weight:900;letter-spacing:-0.025em;font-size:13px;color:#0C0C0A;">
            pearce<span style="color:oklch(47.3% 0.137 46.201);margin:0 2px;">/</span>labs
          </span>
          <span style="font-family:monospace;font-size:8px;text-transform:uppercase;letter-spacing:0.1em;color:#78716c;">
            ${esc(title)}
          </span>
        </div>
        <div style="margin-top:6px;height:1px;background:#78716c;"></div>
      </div>`,
    footerTemplate: `
      <div style="width:100%;padding:0 20mm;border-top:1px solid #78716c;display:flex;justify-content:space-between;font-family:monospace;font-size:8px;text-transform:uppercase;letter-spacing:0.05em;color:#78716c;padding-top:6px;">
        <span>Pearce Labs, LLC.</span>
        <span class="pageNumber"></span>
      </div>`,
  });
  writeFileSync(outputPath, pdfBuffer);
  console.log(`PDF written to ${outputPath}`);
} catch (err) {
  console.error(`Error generating PDF: ${err.message}`);
  process.exit(1);
} finally {
  await browser?.close();
}
