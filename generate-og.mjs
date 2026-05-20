import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontDir = p => join(__dirname, 'node_modules', p);

const sg900 = readFileSync(fontDir('@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-900-normal.woff'));
const sg400 = readFileSync(fontDir('@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-400-normal.woff'));
const mono  = readFileSync(fontDir('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff'));

const BG     = '#F7F6F2';
const INK    = '#0C0C0A';
const ACCENT = '#973c00';
const MUTED  = '#78756E';
const RULE   = 'rgba(12,12,10,0.18)';

const SERVICES = ['SOFTWARE', 'AI', 'DATA', 'WEB', 'CONSULTING'];

const serviceNodes = [];
SERVICES.forEach((s, i) => {
  if (i > 0) serviceNodes.push({
    type: 'span',
    props: { style: { color: ACCENT, margin: '0 10px', fontFamily: 'IBM Plex Mono', fontSize: '16px' }, children: '·' },
  });
  serviceNodes.push({
    type: 'span',
    props: { style: { fontFamily: 'IBM Plex Mono', fontSize: '16px', letterSpacing: '0.12em', color: MUTED }, children: s },
  });
});

const ruleEl = {
  type: 'div',
  props: { style: { width: '100%', height: '1px', background: RULE }, children: null },
};

// Flat flex column, space-between over 6 logical rows:
//   0. services row
//   1. top rule
//   2. hero (centered)
//   3. tagline
//   4. bottom rule
//   5. footer row
const tree = {
  type: 'div',
  props: {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '1200px',
      height: '630px',
      background: BG,
      padding: '56px 64px',
      boxSizing: 'border-box',
    },
    children: [

      // ── TOP: services + rule (tight) ─────────────────────
      {
        type: 'div',
        props: {
          style: { display: 'flex', flexDirection: 'column', gap: '16px' },
          children: [
            { type: 'div', props: { style: { display: 'flex', alignItems: 'center' }, children: serviceNodes } },
            ruleEl,
          ],
        },
      },

      // ── MIDDLE: hero, centered ────────────────────────────
      {
        type: 'div',
        props: {
          style: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
          children: [{
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'baseline' },
              children: [
                { type: 'span', props: { style: { fontFamily: 'Schibsted Grotesk', fontWeight: 900, fontSize: '148px', color: INK, letterSpacing: '-4px', lineHeight: 1 }, children: 'pearce' } },
                { type: 'span', props: { style: { fontFamily: 'Schibsted Grotesk', fontWeight: 900, fontSize: '148px', color: ACCENT, lineHeight: 1, margin: '0 18px' }, children: '/' } },
                { type: 'span', props: { style: { fontFamily: 'Schibsted Grotesk', fontWeight: 900, fontSize: '148px', color: INK, letterSpacing: '-4px', lineHeight: 1 }, children: 'labs' } },
              ],
            },
          }],
        },
      },

      // ── BOTTOM: rule + footer (tight) ────────────────────
      {
        type: 'div',
        props: {
          style: { display: 'flex', flexDirection: 'column', gap: '16px' },
          children: [
            ruleEl,
            {
              type: 'div',
              props: {
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
                children: [
                  { type: 'span', props: { style: { fontFamily: 'IBM Plex Mono', fontSize: '16px', color: MUTED, letterSpacing: '0.04em' }, children: 'pearcelabs.com' } },
                  { type: 'span', props: { style: { fontFamily: 'IBM Plex Mono', fontSize: '16px', color: MUTED, letterSpacing: '0.04em' }, children: 'Full-stack thinking. Full-scope execution.' } },
                ],
              },
            },
          ],
        },
      },

    ],
  },
};

const svg = await satori(tree, {
  width: 1200,
  height: 630,
  fonts: [
    { name: 'Schibsted Grotesk', data: sg400, weight: 400, style: 'normal' },
    { name: 'Schibsted Grotesk', data: sg900, weight: 900, style: 'normal' },
    { name: 'IBM Plex Mono',     data: mono,  weight: 400, style: 'normal' },
  ],
});

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync('public/og-image.png', png);
console.log('✓ public/og-image.png written');
