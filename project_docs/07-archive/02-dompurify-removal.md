# DOMPurify Removal Explanation

## Background

`isomorphic-dompurify` was originally added as part of the security implementation plan to provide XSS (Cross-Site Scripting) protection through HTML sanitization.

## Why It Was Added

1. **Security Requirement**: Part of the comprehensive security implementation that included:
   - HTML/text sanitization with DOMPurify
   - XSS prevention
   - Input validation and sanitization
   - Applied to authentication endpoints

2. **Why `isomorphic-dompurify`**: 
   - Works in both browser and Node.js environments (isomorphic)
   - Based on DOMPurify, a battle-tested HTML sanitization library
   - Allows controlled HTML sanitization (keeping safe tags like `<b>`, `<i>`, `<p>` while removing dangerous scripts)

3. **Intended Use Case**:
   - Sanitize user-generated HTML content
   - Allow safe formatting tags while removing malicious scripts
   - Server-side sanitization for API endpoints

## Why It Was Removed

### The Problem

**Production Error**: `/api/transactions/intent` was failing with:
```
Error: Failed to load external module jsdom: Error: ENOENT: no such file or directory, 
open '/var/task/node_modules/jsdom/lib/jsdom/browser/default-stylesheet.css'
```

**Root Cause**:
- `isomorphic-dompurify` depends on `jsdom` for server-side HTML parsing
- `jsdom` requires CSS files that aren't bundled in production builds
- This caused deployment failures in preview/production environments

### Why Removal Was Safe

1. **Not Actually Used**: 
   - `sanitizeHTML()` function was never called anywhere in the codebase
   - Only `sanitizeText()` was being used, which doesn't require DOMPurify

2. **Current Implementation is Sufficient**:
   - `sanitizeText()` strips ALL HTML tags using regex: `/<[^>]*>/g`
   - This approach is simpler and sufficient for our use case
   - We don't accept HTML content from users - only plain text

3. **Additional Protection Layers**:
   - Content Security Policy (CSP) headers provide XSS protection
   - React escapes content by default
   - Input validation prevents malicious data at the source

## Solution

**Current Implementation** (`src/lib/sanitization.ts`):
- `sanitizeHTML()` now delegates to `sanitizeText()` (regex-based)
- No external dependencies required
- Works reliably in all environments (dev, preview, production)
- Sufficient for our security needs

## Files Modified

- `src/lib/sanitization.ts` - Removed DOMPurify import, simplified `sanitizeHTML()`

## Recommendation

**Keep `isomorphic-dompurify` in `package.json`** (optional):
- Can be removed if desired, but causes no harm if not imported
- Could be useful if we need HTML sanitization in the future
- Currently unused but available if needed

## Related Documentation

- `SECURITY_IMPLEMENTATION_COMPLETE.md` - Original security implementation plan
- `src/lib/sanitization.ts` - Current sanitization implementation
- `src/proxy.ts` - CSP headers and XSS protection

---

**Date**: October 30, 2025  
**Status**: Resolved - DOMPurify removed, regex-based sanitization sufficient

