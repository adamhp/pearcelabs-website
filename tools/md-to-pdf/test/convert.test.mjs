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
  const result = spawnSync('node', [convertScript, '/tmp/nonexistent-pearcelabs-test.md'], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.ok(result.stderr.includes('Error:'), `expected "Error:" in stderr, got: ${result.stderr}`);
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
