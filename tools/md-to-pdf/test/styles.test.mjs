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
