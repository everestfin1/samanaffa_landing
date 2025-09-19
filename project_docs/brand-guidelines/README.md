# Sama Naffa Everest - Brand Guidelines

This directory contains the complete brand and style guidelines for Sama Naffa Everest, a digital savings platform revolutionizing financial inclusion in West Africa.

## 📁 File Structure

```
brand-guidelines/
├── README.md                           # This file - overview and usage guide
├── sama-naffa-brand-style-guide.md     # Complete brand style guide
├── color-palette.css                   # CSS variables for colors
├── typography.css                      # Typography system and utilities
├── component-library.css               # Reusable UI components
└── animations.css                      # Animation system and effects
```

## 🎨 Quick Start

### 1. Import the CSS Files

```html
<!-- Include all brand styles -->
<link rel="stylesheet" href="brand-guidelines/color-palette.css">
<link rel="stylesheet" href="brand-guidelines/typography.css">
<link rel="stylesheet" href="brand-guidelines/component-library.css">
<link rel="stylesheet" href="brand-guidelines/animations.css">
```

### 2. Use Brand Colors

```css
/* Using CSS variables */
.my-element {
  background-color: var(--sama-primary-green);
  color: var(--sama-accent-gold);
}

/* Using utility classes */
<div class="sama-bg-primary sama-text-gold">Content</div>
```

### 3. Apply Typography

```html
<h1 class="sama-heading-hero">Main Title</h1>
<p class="sama-body-regular">Regular text content</p>
<span class="sama-text-accent">Highlighted text</span>
```

### 4. Use Components

```html
<!-- Primary Button -->
<button class="sama-button sama-button-primary sama-button-shimmer">
  Click Me
</button>

<!-- Card Component -->
<div class="sama-card sama-hover-lift">
  <div class="sama-card-content">
    <h3 class="sama-heading-card">Card Title</h3>
    <p class="sama-body-regular">Card content goes here.</p>
  </div>
</div>
```

## 🎯 Brand Colors

### Primary Palette
- **Primary Green**: `#435933` - Main brand color
- **Accent Gold**: `#C38D1C` - Call-to-action and highlights
- **Secondary Green**: `#30461f` - Supporting elements

### Usage Examples
```css
/* Primary button */
.sama-button-primary {
  background: var(--sama-gradient-primary);
  color: white;
}

/* Accent highlights */
.sama-text-accent {
  color: var(--sama-accent-gold);
}
```

## 📝 Typography System

### Font Hierarchy
- **Hero Title**: 48px, Bold, Primary Green
- **Section Heading**: 36px, Bold, Dark Text
- **Subsection**: 24px, Semibold, Secondary Green
- **Body Text**: 16px, Regular, Secondary Text

### Responsive Typography
All typography scales automatically across devices:
- Mobile: Smaller sizes for better readability
- Desktop: Larger sizes for impact

## 🧩 Component Library

### Available Components
- **Buttons**: Primary, Secondary, Outline, Ghost variants
- **Cards**: Standard, Feature, with hover effects
- **Inputs**: Form fields with focus states
- **Sliders**: Custom range inputs
- **Avatars**: Profile images in multiple sizes
- **Badges**: Status indicators
- **Alerts**: Notification messages
- **Modals**: Overlay dialogs

### Component Usage
```html
<!-- Button with all variants -->
<button class="sama-button sama-button-primary">Primary</button>
<button class="sama-button sama-button-secondary">Secondary</button>
<button class="sama-button sama-button-outline">Outline</button>

<!-- Card with animation -->
<div class="sama-card sama-hover-lift sama-animate-fade-in">
  <div class="sama-card-content">
    <h3 class="sama-heading-card">Feature Card</h3>
    <p class="sama-body-regular">Card content with hover effects.</p>
  </div>
</div>
```

## ✨ Animation System

### Available Animations
- **Entrance**: `fade-in`, `slide-up`, `bounce-in`, `scale-in`
- **Hover**: `hover-lift`, `hover-glow`, `hover-scale`
- **Special**: `pulse-glow`, `float`, `shimmer`, `particle-float`
- **Flat Design**: `flat-pulse`, `flat-slide`, `flat-bounce`

### Animation Usage
```html
<!-- Animated elements -->
<div class="sama-animate-fade-in sama-delay-200">
  <h2 class="sama-heading-section">Animated Title</h2>
</div>

<div class="sama-hover-lift sama-animate-pulse-glow">
  <p class="sama-body-regular">Hover me for effects!</p>
</div>
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Responsive Utilities
```css
/* Mobile-first approach */
.sama-responsive-text {
  font-size: 1rem; /* Mobile */
}

@media (min-width: 1024px) {
  .sama-responsive-text {
    font-size: 1.125rem; /* Desktop */
  }
}
```

## ♿ Accessibility

### Features Included
- **Color Contrast**: WCAG AA compliant
- **Focus States**: Visible keyboard navigation
- **Reduced Motion**: Respects user preferences
- **Touch Targets**: Minimum 44px for mobile

### Usage
```css
/* Automatic focus states */
.sama-button:focus-visible {
  outline: 2px solid var(--sama-primary-green);
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .sama-animate-fade-in {
    animation: none;
  }
}
```

## 🚀 Performance

### Optimizations
- **CSS Variables**: Efficient color management
- **System Fonts**: Fast loading, no external dependencies
- **GPU Acceleration**: Smooth animations using transforms
- **Minimal Bundle**: Tree-shakeable utility classes

## 🎨 Design Tokens

### Spacing Scale
```css
--sama-space-1: 0.25rem;  /* 4px */
--sama-space-2: 0.5rem;   /* 8px */
--sama-space-4: 1rem;     /* 16px */
--sama-space-6: 1.5rem;   /* 24px */
--sama-space-8: 2rem;     /* 32px */
```

### Border Radius
```css
--sama-radius-sm: 8px;
--sama-radius-md: 12px;
--sama-radius-lg: 16px;
--sama-radius-xl: 20px;
```

## 📋 Implementation Checklist

### For New Projects
- [ ] Import all CSS files
- [ ] Set up CSS variables
- [ ] Configure responsive breakpoints
- [ ] Test accessibility features
- [ ] Validate color contrast
- [ ] Test animations on mobile

### For Existing Projects
- [ ] Audit current color usage
- [ ] Replace hardcoded colors with variables
- [ ] Update typography to use brand system
- [ ] Implement component library
- [ ] Add animation effects
- [ ] Test responsive behavior

## 🔧 Customization

### Extending the System
```css
/* Add custom colors */
:root {
  --sama-custom-color: #your-color;
}

/* Create custom components */
.sama-custom-component {
  background: var(--sama-primary-green);
  border-radius: var(--sama-radius-lg);
  padding: var(--sama-space-4);
}
```

### Theme Variations
The system supports easy theme creation by overriding CSS variables:

```css
/* Dark theme example */
[data-theme="dark"] {
  --sama-bg-card: #1a1a1a;
  --sama-text-primary: #ffffff;
  --sama-text-secondary: #cccccc;
}
```

## 📞 Support

For questions about implementing these brand guidelines:

1. **Design Questions**: Contact the design team
2. **Technical Issues**: Check the component documentation
3. **Accessibility**: Review WCAG guidelines
4. **Performance**: Monitor bundle size and loading times

## 📄 License

These brand guidelines are proprietary to Sama Naffa Everest and are intended for internal use and authorized partners only.

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Maintained by**: Sama Naffa Design Team
