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
  // verify the font is actually embedded, not just referenced
  const dataUriCount = (css.match(/data:font\/woff2;base64,/g) ?? []).length;
  assert.ok(dataUriCount >= 2, `expected at least 2 data URIs (one per font family), got ${dataUriCount}`);
});

test('buildCss includes branding color tokens', () => {
  const css = buildCss();
  assert.ok(css.includes('#0C0C0A'));   // ink
  assert.ok(css.includes('#F7F6F2'));   // paper
});
