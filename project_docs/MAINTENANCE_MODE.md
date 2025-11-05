# Maintenance Mode Documentation

## Overview

The Sama Naffa platform includes a maintenance mode feature that allows you to temporarily redirect all traffic to a branded maintenance page during system updates, deployments, or scheduled maintenance.

## Features

- **Beautiful Sama Naffa branded design**: The maintenance page uses the official Sama Naffa color palette (greens and gold accents)
- **Animated visual elements**: Includes subtle animations and pulsing indicators
- **Contact information**: Displays email and phone contact details for urgent matters
- **Responsive design**: Works seamlessly on all devices (mobile, tablet, desktop)
- **No navigation/footer**: Clean, focused layout without standard site navigation

## How to Enable Maintenance Mode

1. Open the file: `src/proxy.ts`
2. Locate the `MAINTENANCE_MODE` constant (near the top of the `proxy` function)
3. Set it to `true`:

```typescript
const MAINTENANCE_MODE = true;
```

4. Deploy or restart your application

**All requests will now be redirected to `/maintenance`**

## How to Disable Maintenance Mode

1. Open the file: `src/proxy.ts`
2. Locate the `MAINTENANCE_MODE` constant
3. Set it to `false`:

```typescript
const MAINTENANCE_MODE = false;
```

4. Deploy or restart your application

**Normal site operation is restored**

## What Gets Redirected?

When maintenance mode is enabled:

✅ **Redirected to maintenance page:**
- All user-facing pages (home, login, portal, etc.)
- All API routes
- All authenticated pages

❌ **NOT redirected (allowed through):**
- The `/maintenance` page itself (prevents redirect loop)
- Static assets (`/_next/`, `/static/`, images, CSS, JS files)

## Files Involved

### Main Files
- **`src/proxy.ts`**: Middleware that handles the maintenance mode redirect logic
- **`src/app/maintenance/page.tsx`**: The maintenance page component
- **`src/app/maintenance/layout.tsx`**: Custom layout without navigation/footer

### Theme & Styling
- Uses colors from: `src/app/globals.css`
- Brand guidelines: `project_docs/brand-guidelines/`

## Customization

### Update Contact Information

Edit `src/app/maintenance/page.tsx` and update these lines:

```tsx
<a href="mailto:contact@samanaffa.sn">
  contact@samanaffa.sn
</a>
<a href="tel:+221338234567">
  +221 33 823 45 67
</a>
```

### Update Message

Modify the text content in `src/app/maintenance/page.tsx`:

```tsx
<h1>Maintenance en cours</h1>
<p>Nous améliorons votre expérience</p>
<p>Notre plateforme est actuellement en maintenance...</p>
```

### Update Colors

The maintenance page uses Sama Naffa brand colors defined in CSS variables:

- Primary green: `#435933` (`--sama-primary-green`)
- Secondary green: `#30461f` (`--sama-secondary-green`)
- Accent gold: `#C38D1C` (`--sama-accent-gold`)

## Testing

1. Enable maintenance mode
2. Try to access any page (e.g., `/`, `/login`, `/portal/dashboard`)
3. Verify you're redirected to `/maintenance`
4. Check that the page displays correctly on mobile and desktop
5. Verify static assets (logo, images) load correctly
6. Disable maintenance mode
7. Verify normal site access is restored

## Environment Variables (Optional Enhancement)

For more flexibility, you can use an environment variable instead of a hardcoded constant:

In `src/proxy.ts`:
```typescript
const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
```

In `.env` or `.env.local`:
```bash
NEXT_PUBLIC_MAINTENANCE_MODE=true
```

This allows you to toggle maintenance mode without code changes, just by updating environment variables.

## Support

For questions or issues with maintenance mode, contact the development team or refer to the project documentation in `project_docs/`.

---

**Last Updated:** November 2025

