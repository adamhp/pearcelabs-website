# Markdown → Branded PDF Utility

**Date:** 2026-05-22
**Status:** Approved

## Overview

A CLI utility that converts markdown files into polished, branded PDFs using Pearce Labs visual identity. Intended for client-facing deliverables: proposals, welcome documents, and similar materials.

## Usage

```bash
node tools/md-to-pdf/convert.mjs proposal.md
# writes proposal.pdf next to the source file

node tools/md-to-pdf/convert.mjs proposal.md output/client-proposal.pdf
# explicit output path
```

Markdown files use YAML frontmatter to supply document metadata:

```yaml
---
title: Project Proposal
client: Acme Corp
date: May 2026
---

## Introduction

Body content starts here...
```

## Architecture

The utility lives at `tools/md-to-pdf/` in the existing repo, co-located with the branding source.

```
tools/md-to-pdf/
  convert.mjs      # CLI entry point — parses args, orchestrates the pipeline
  template.mjs     # Returns an HTML string given frontmatter + rendered body HTML
  styles.mjs       # CSS string — colors, fonts, prose rules
```

### Pipeline

1. Read `.md` file from CLI arg
2. Parse YAML frontmatter (`gray-matter`) → extract `title`, `client`, `date`
3. Convert body markdown to HTML (`marked`)
4. Inject frontmatter + body HTML into the HTML template (`template.mjs`)
5. Launch Puppeteer, load the HTML, print to PDF
6. Write PDF to output path (defaults to input filename with `.pdf` extension)

### Dependencies (added to root `package.json`)

| Package | Purpose |
|---|---|
| `puppeteer` | Headless Chrome, drives PDF rendering |
| `marked` | Markdown → HTML |
| `gray-matter` | YAML frontmatter parser |

**Fonts:** Schibsted Grotesk and IBM Plex Mono are sourced from the `@fontsource` packages already in `devDependencies`. Their woff2 files are referenced by file path in the CSS — no network call during generation.

## PDF Visual Design

### Page Setup

- Format: A4
- Margins: 20mm on all sides
- Background: paper (`#F7F6F2`) full bleed

### Branding Tokens

| Token | Value |
|---|---|
| `--color-ink` | `#0C0C0A` |
| `--color-paper` | `#F7F6F2` |
| `--color-accent` | `oklch(47.3% 0.137 46.201)` |
| `--font-body` | Schibsted Grotesk |
| `--font-mono` | IBM Plex Mono |

### Cover Page (page 1)

- **Top-left:** Wordmark — `pearce` + accent-colored `/` + `labs`, Schibsted Grotesk, font-black, tight tracking
- **Vertical center:** Document `title` in 2.5rem / font-black / ink; `client` name below in IBM Plex Mono, small, all-caps, stone-600
- **Bottom:** Thin accent-colored HR, then `Falls Church, VA · pearcelabs.com` at bottom-left and `date` at bottom-right, both in IBM Plex Mono small

### Body Pages (page 2+)

- **Running header:** Wordmark left, document `title` right in IBM Plex Mono — mirrors the site header layout. Separated from content by a `border-stone-500` HR.
- **Content area:** Prose styles matching `src/styles/global.css`:
  - H1: 1.875rem, weight 900, tracking -0.025em
  - H2: 1.25rem, weight 700
  - H3: 1rem, weight 700
  - Body: 1rem, line-height 1.625
  - Links: accent color, underlined
  - Lists: disc, standard spacing
- **Running footer:** `Pearce Labs, LLC.` left, page number right, both in IBM Plex Mono small. Separated from content by an HR.

## Supported Markdown Features

- Headings (H1–H3)
- Paragraphs
- Bold, italic
- Unordered and ordered lists
- Links
- Code (inline and fenced blocks)
- Horizontal rules
- Tables

## Error Handling

- Missing required frontmatter fields (`title`, `client`, `date`): warn to stderr, render with empty string fallback — do not abort
- Input file not found: exit with a clear error message and non-zero exit code
- Output directory does not exist: create it automatically

## Out of Scope

- Images in markdown body (not needed for proposals)
- Interactive PDF features
- Batch conversion of multiple files
- A watch mode
