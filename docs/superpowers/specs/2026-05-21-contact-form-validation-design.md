# Contact Form Validation Design

**Date:** 2026-05-21  
**Status:** Approved

## Summary

Add basic form validation to `ContactSection.astro` using native browser validation and Tailwind CSS only — no new JavaScript.

## Problem

The contact form has `novalidate` on the `<form>` element, which suppresses browser validation. Fields have `required` and `type="email"` attributes, but nothing prevents submission of an empty or malformed form.

## Design

### Approach

Remove `novalidate` to restore native browser validation. The browser validates `required` and `type="email"` attributes before the `submit` event fires, so the existing fetch handler only runs on valid submissions. No new JS needed.

### Error Feedback

Add Tailwind `user-invalid:` variant classes to the shared `inputClass` variable. `:user-invalid` activates only after the user has interacted with a field, avoiding red-border-on-page-load noise.

```
user-invalid:border user-invalid:border-red-500
```

This applies to all three inputs (name, email, message) since they share `inputClass`.

Browser native error tooltips appear on submit for any invalid fields. The tooltip text and style are browser-controlled and not customizable.

### Validation Rules

| Field   | Rule                              |
|---------|-----------------------------------|
| Name    | Required (non-empty)              |
| Email   | Required + valid email format     |
| Message | Required (non-empty)              |

## Changes

Two edits to `src/components/ContactSection.astro`:

1. Remove `novalidate` from the `<form>` element
2. Add `user-invalid:border user-invalid:border-red-500` to `inputClass`

## Trade-offs

- **Pro:** Zero new JS, zero new CSS files, uses Tailwind v4 variant syntax consistently
- **Con:** Browser error tooltip appearance is browser-native and cannot be styled to match the site's `font-mono` design

## Out of Scope

- Minimum message length
- Phone number field
- Custom styled error messages
