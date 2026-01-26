# bocalERP Design System

> A modern, professional design system for ERP applications that respects user productivity.

---

## Design Philosophy

bocalERP's design system embodies our core philosophy: **pragmatism over dogma**, **simplicity first**, and **developer experience matters**.

We draw inspiration from:
- **Apple** (pre-Liquid Glass) — Typography hierarchy, clear affordances
- **Vercel** — Minimal, information-dense, fast
- **IBM Carbon** — Systematic tokens, data table patterns
- **Shopify Polaris** — Semantic colors, action hierarchy
- **Material 3** — State layers, tonal surfaces
- **Atlassian** — Productivity focus, keyboard-first

### Core Principles

1. **Every pixel earns its place** — No decoration without function
2. **Fast means invisible** — Motion aids comprehension, never draws attention
3. **Color is semantic** — It communicates status, not mood
4. **Whitespace is structure** — Let content breathe
5. **Progressive disclosure** — Show what's needed now, reveal more on demand
6. **Keyboard velocity** — Speed is the ultimate delight for power users

---

## Foundation Tokens

### Spacing Scale (8px Grid)

Systematic spacing based on an 8px rhythm for visual consistency.

```css
:root {
  /* Base scale */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px - tight padding */
  --space-2: 0.5rem;    /* 8px - standard gap */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px - section padding */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px - card padding */
  --space-8: 2rem;      /* 32px - section gaps */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px - page margins */
  --space-16: 4rem;     /* 64px - large sections */
  
  /* Semantic spacing */
  --space-input-x: var(--space-3);     /* Input horizontal padding */
  --space-input-y: var(--space-2);     /* Input vertical padding */
  --space-button-x: var(--space-4);    /* Button horizontal padding */
  --space-button-y: var(--space-2);    /* Button vertical padding */
  --space-card: var(--space-6);        /* Card padding */
  --space-page: var(--space-8);        /* Page content padding */
}
```

**Usage:**
```tsx
// Use semantic tokens when possible
<div className="p-[var(--space-card)]">

// Use scale tokens for custom spacing
<div className="gap-[var(--space-4)]">
```

### Typography Scale

14px base for ERP-appropriate information density.

```css
:root {
  /* Type scale - Minor third (1.2) ratio */
  --text-xs: 0.75rem;      /* 12px - captions, badges */
  --text-sm: 0.8125rem;    /* 13px - secondary text, table cells */
  --text-base: 0.875rem;   /* 14px - body text (ERP-optimized) */
  --text-lg: 1rem;         /* 16px - emphasized body */
  --text-xl: 1.125rem;     /* 18px - card titles */
  --text-2xl: 1.25rem;     /* 20px - page titles */
  --text-3xl: 1.5rem;      /* 24px - section headers */
  --text-4xl: 1.875rem;    /* 30px - hero text */
  
  /* Line heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  
  /* Font weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Semantic type styles */
  --text-page-title: var(--text-2xl);
  --text-section-title: var(--text-lg);
  --text-card-title: var(--text-base);
  --text-body: var(--text-sm);
  --text-caption: var(--text-xs);
}
```

**Hierarchy Example:**
```tsx
<h1 className="text-[var(--text-page-title)] font-semibold">Page Title</h1>
<h2 className="text-[var(--text-section-title)] font-medium">Section</h2>
<p className="text-[var(--text-body)]">Body text optimized for readability</p>
<span className="text-[var(--text-caption)] text-muted-foreground">Helper text</span>
```

### Elevation System

Systematic depth through shadow and border (Material 3 inspired).

```css
:root {
  /* Elevation levels */
  --elevation-0: none;
  --elevation-1: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --elevation-2: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --elevation-3: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --elevation-4: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --elevation-5: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

[data-mode='dark'] {
  /* Dark mode uses border + subtle glow instead of shadows */
  --elevation-0: none;
  --elevation-1: 0 0 0 1px rgb(255 255 255 / 0.05);
  --elevation-2: 0 0 0 1px rgb(255 255 255 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.4);
  --elevation-3: 0 0 0 1px rgb(255 255 255 / 0.05), 0 4px 8px 0 rgb(0 0 0 / 0.4);
  --elevation-4: 0 0 0 1px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.4);
  --elevation-5: 0 0 0 1px rgb(255 255 255 / 0.1), 0 16px 32px 0 rgb(0 0 0 / 0.5);
}
```

**Usage:**
```tsx
// Rest state
<Card className="shadow-[var(--elevation-2)]">

// Hover state
<Card className="shadow-[var(--elevation-2)] hover:shadow-[var(--elevation-3)]">
```

### State Layers

Consistent hover/pressed/focus states using opacity overlays (Material 3 pattern).

```css
:root {
  /* State layer opacities */
  --state-hover: 0.08;      /* 8% opacity overlay on hover */
  --state-focus: 0.12;      /* 12% on focus */
  --state-pressed: 0.12;    /* 12% on press */
  --state-selected: 0.08;   /* 8% when selected */
  --state-disabled: 0.38;   /* 38% opacity for disabled elements */
}
```

**Usage:**
```tsx
// Apply state layer to interactive elements
<button className="relative hover:bg-current/[0.08] active:bg-current/[0.12]">
```

### Border Radius Scale

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;    /* 4px - badges, small elements */
  --radius-md: 0.375rem;   /* 6px - buttons, inputs */
  --radius-lg: 0.5rem;     /* 8px - cards */
  --radius-xl: 0.75rem;    /* 12px - modals, large cards */
  --radius-2xl: 1rem;      /* 16px - panels */
  --radius-full: 9999px;   /* Pills, avatars */
  
  /* Semantic radius */
  --radius-button: var(--radius-md);
  --radius-input: var(--radius-md);
  --radius-card: var(--radius-lg);
  --radius-modal: var(--radius-xl);
}
```

### Motion Tokens

Fast, functional transitions.

```css
:root {
  /* Duration scale */
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  
  /* Easing curve - one curve for consistency */
  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

**Rule:** If an animation takes longer than 200ms, question whether it's needed.

---

## Color System

### Semantic Colors

Colors are named by **purpose**, not appearance.

```css
:root {
  /* Interactive - Primary actions */
  --color-interactive: 239 84% 67%;
  --color-interactive-hovered: 239 84% 60%;
  --color-interactive-pressed: 239 84% 53%;
  
  /* Success - Positive outcomes, enabled states */
  --color-success: 160 84% 39%;
  --color-success-surface: 160 84% 95%;
  
  /* Warning - Attention needed, pending */
  --color-warning: 38 92% 50%;
  --color-warning-surface: 38 92% 95%;
  
  /* Critical - Errors, destructive actions */
  --color-critical: 4 90% 58%;
  --color-critical-surface: 4 90% 95%;
  
  /* Info - Neutral information */
  --color-info: 210 100% 50%;
  --color-info-surface: 210 100% 95%;
}
```

**When to use each:**

| Color | Use For | Examples |
|-------|---------|----------|
| **Primary/Interactive** | Main CTAs, links, focus rings | Save button, active nav item |
| **Success** | Positive state, completed actions | Active badge, saved indicator |
| **Warning** | Needs attention, not blocking | Pending status, expiring soon |
| **Critical** | Errors, destructive actions | Delete button, error message |
| **Info** | Neutral information | Tips, help text |

### Neutral Scale

```css
:root {
  /* Slightly warm neutral scale */
  --gray-50: 40 20% 98%;   /* Background */
  --gray-100: 40 15% 96%;  /* Subtle backgrounds */
  --gray-200: 40 10% 92%;  /* Borders, dividers */
  --gray-300: 40 8% 85%;   /* Disabled backgrounds */
  --gray-400: 40 5% 65%;   /* Placeholder text */
  --gray-500: 40 4% 46%;   /* Secondary text */
  --gray-600: 40 4% 36%;   /* Primary text */
  --gray-700: 40 5% 26%;
  --gray-800: 40 6% 16%;
  --gray-900: 40 8% 10%;   /* Dark backgrounds */
  --gray-950: 40 10% 6%;
}
```

### Dark Mode

True dark mode with proper contrast (not just inverted colors).

```css
[data-mode='dark'] {
  /* Background layers */
  --gray-950: 220 13% 5%;     /* Deepest background */
  --gray-900: 220 13% 9%;     /* Card background */
  --gray-800: 220 13% 14%;    /* Elevated surfaces */
  --gray-700: 220 13% 20%;    /* Borders */
  --gray-500: 220 8% 46%;     /* Muted text */
  --gray-400: 220 8% 60%;     /* Secondary text */
  --gray-100: 220 8% 93%;     /* Primary text */
  
  /* Primary needs to be lighter in dark mode for contrast */
  --primary: 239 70% 70%;
  
  /* Status colors adjusted for visibility */
  --success: 160 70% 50%;
  --warning: 38 90% 55%;
  --critical: 4 85% 62%;
}
```

---

## Component Patterns

### Button Hierarchy

Three levels: Primary → Secondary → Tertiary

```tsx
import { Button } from '@bocalerp/console-ui';

// Primary - One per view ideally (main CTA)
<Button variant="primary">Save Changes</Button>

// Secondary - Important but not primary
<Button variant="secondary">Cancel</Button>

// Tertiary - Least emphasis (ghost style)
<Button variant="tertiary">View Details</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Destructive tertiary (for icon buttons)
<Button variant="destructive-tertiary" size="icon">
  <TrashIcon />
</Button>
```

**Sizes:**
- `sm` - 32px height (compact)
- `md` - 36px height (default)
- `lg` - 40px height (emphasized)
- `icon` - 36px square
- `icon-sm` - 32px square

### Input with Label/Error

```tsx
import { Input } from '@bocalerp/console-ui';

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  helperText="We'll never share your email"
  required
/>

// With error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
  required
/>

### Stepper (Numeric Input)

Use for high-frequency numeric adjustments where typing is slower or error-prone.

```tsx
import { Stepper } from '@/components/ui/Stepper'

<Stepper
  label="Jours"
  value={durationDays}
  onChange={setDurationDays}
  min={1}
  max={90}
/>
```

**Guidance:**
- Prefer Stepper over raw `<input type="number">` for repeated adjustments.
- Always bound values (`min`, `max`).
- Use `tabular-nums` for stable alignment.
```

### Badge Variants

```tsx
import { Badge } from '@bocalerp/console-ui';

// Status badges (filled)
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="critical">Error</Badge>
<Badge variant="info">Draft</Badge>

// Outline badges (subtle)
<Badge variant="outline-success">Verified</Badge>
<Badge variant="outline-warning">Expiring</Badge>

// Tonal badges (very subtle, inline)
<Badge variant="tonal-success">Enabled</Badge>

### Toast (Non-blocking Notifications)

Toasts are used for non-blocking feedback and reversible actions.

```tsx
import { useToast } from '@/components/ui/Toast'

const { addToast } = useToast()

addToast({
  type: 'info',
  message: 'Élément retiré',
  action: {
    label: 'Annuler',
    onClick: () => restore(),
  },
})
```

**Guidance:**
- Prefer inline errors for validation.
- Prefer toast + Undo for reversible destructive actions (e.g., removing a line item).
- Avoid toast spam; one toast per user action.
```

### Card Variants

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@bocalerp/console-ui';

// Standard card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Subdued (nested, secondary content)
<Card subdued>...</Card>

// Interactive (clickable)
<Card interactive onClick={() => navigate('/detail')}>...</Card>

// Flush (no padding, for tables)
<Card flush>
  <Table>...</Table>
</Card>
```

### Data Table Density

```tsx
import { Table, TableDensity } from '@bocalerp/console-ui';

// Comfortable (default) - good for touch, readability
<Table density="comfortable">
  {/* 16px x 12px cell padding */}
</Table>

// Compact - data-heavy views, desktop power users
<Table density="compact">
  {/* 12px x 8px cell padding */}
</Table>
```

### Page Shell

```tsx
import { PageShell } from '@bocalerp/console-ui';

<PageShell
  title="Users"
  description="Manage user accounts and permissions"
  breadcrumbs={<Breadcrumb>...</Breadcrumb>}
  primaryAction={
    <Button variant="primary">Create User</Button>
  }
  secondaryActions={
    <>
      <Button variant="secondary">Export</Button>
      <Button variant="tertiary">Settings</Button>
    </>
  }
>
  {/* Page content */}
</PageShell>
```

---

## Accessibility

### Focus Indicators

All interactive elements must have visible focus indicators.

```tsx
// Standard focus ring
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

// For dark backgrounds
className="focus-visible:ring-offset-background"
```

### Color Contrast

All text must meet WCAG AA standards:
- **Normal text:** 4.5:1 contrast ratio minimum
- **Large text (18px+):** 3:1 contrast ratio minimum
- **UI components:** 3:1 contrast ratio minimum

### Keyboard Navigation

All actions must be keyboard-accessible:
- **Tab** - Move focus forward
- **Shift+Tab** - Move focus backward
- **Enter/Space** - Activate buttons, links
- **Escape** - Close modals, cancel actions
- **Arrow keys** - Navigate lists, menus

---

## Layout Patterns

### Content Width

```tsx
// Full width
<div className="w-full">

// Constrained (reading, forms)
<div className="max-w-2xl mx-auto">

// Wide (tables, dashboards)
<div className="max-w-7xl mx-auto">
```

### Responsive Breakpoints

```css
/* Tailwind defaults */
sm: 640px   /* Small tablet */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Grid System

```tsx
// 2-column on tablet+
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

// 3-column on desktop+
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Auto-fit (responsive cards)
<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
```

---

## Interaction Patterns

- See [UX Patterns](./ux-patterns.md) for detailed interaction guidelines including:
- Read vs. Edit modes
- Sheet patterns

---

## Implementation Checklist

When building a new component:

- [ ] Uses design tokens (spacing, typography, colors)
- [ ] Has hover/focus/active states
- [ ] Supports dark mode
- [ ] Keyboard accessible
- [ ] Has ARIA labels where needed
- [ ] Meets contrast requirements
- [ ] Responsive (mobile → desktop)
- [ ] Has loading/error/empty states
- [ ] Documented in Storybook (future)
- [ ] Matches design system patterns

---

## Resources

- [Theme System](./theme-system.md) - Theme architecture and runtime API
- [UX Patterns](./ux-patterns.md) - Interaction patterns and workflows
- [Keyboard Shortcuts](./keyboard-shortcuts.md) - Global shortcut reference
- [Component Library](../../packages/console-ui/README.md) - Available components

---

## Evolution

This design system is a living document. As we learn what works in production:

1. **Add patterns** that solve real problems
2. **Remove patterns** that add complexity without value
3. **Refine tokens** based on usage
4. **Document decisions** for future contributors

If a pattern isn't serving users or developers, we change it. Pragmatism over dogma.