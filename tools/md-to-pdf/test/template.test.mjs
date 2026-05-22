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

test('buildHtml escapes HTML special characters in title, client, and date', () => {
  const html = buildHtml({
    title: '<b>"Hello" & World</b>',
    client: 'A & B Corp',
    date: '2026 > 2025',
    bodyHtml: '<p>Raw body</p>',
    css: '',
  });
  // special chars in user fields must be escaped
  assert.ok(html.includes('&lt;b&gt;'), 'title < and > should be escaped');
  assert.ok(html.includes('&amp;'), 'ampersands should be escaped');
  assert.ok(html.includes('&quot;'), 'double quotes should be escaped');
  // body HTML must NOT be escaped (it's already rendered HTML)
  assert.ok(html.includes('<p>Raw body</p>'), 'bodyHtml should be inserted raw');
  // raw unescaped < from title must NOT appear in cover
  assert.ok(!html.includes('<b>'), 'raw <b> tag from title must not appear unescaped');
});
