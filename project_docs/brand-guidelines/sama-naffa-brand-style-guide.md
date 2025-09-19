# Sama Naffa Everest - Brand & Style Guide

## Table of Contents
1. [Brand Overview](#brand-overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Logo & Brand Assets](#logo--brand-assets)
5. [UI Components](#ui-components)
6. [Design Patterns](#design-patterns)
7. [Animations & Interactions](#animations--interactions)
8. [Spacing & Layout](#spacing--layout)
9. [Voice & Tone](#voice--tone)
10. [Implementation Guidelines](#implementation-guidelines)

---

## Brand Overview

**Sama Naffa** is a digital savings platform revolutionizing financial inclusion in West Africa. The brand embodies trust, growth, and empowerment through intelligent savings solutions.

### Brand Values
- **Trust**: Reliable and secure financial services
- **Growth**: Empowering users to achieve their financial goals
- **Accessibility**: Making savings accessible to everyone
- **Innovation**: Modern digital solutions for traditional needs

### Target Audience
- West African individuals seeking to build savings habits
- Young professionals and entrepreneurs
- Families planning for major life events
- Diaspora community investing in their homeland

---

## Color Palette

### Primary Colors

#### Green Palette (Primary Brand Colors)
```css
/* Main Green */
--primary-green: #435933;
--primary-green-light: #5a7344;
--primary-green-dark: #364529;

/* Secondary Green */
--secondary-green: #30461f;
--secondary-green-light: #243318;

/* Accent Green */
--accent-green: #C38D1C;
--accent-green-dark: #b3830f;
```

#### Neutral Colors
```css
/* Base Colors */
--base-black: #000000;
--base-white: #ffffff;

/* Text Colors */
--text-primary: #01081b;
--text-secondary: #4d525f;
--text-muted: #969696;

/* Background Colors */
--bg-light: #f7f6f6;
--bg-card: #ffffff;
--bg-overlay: rgba(255, 255, 255, 0.9);
```

#### Semantic Colors
```css
/* Success/Positive */
--success: #377e36;

/* Warning/Attention */
--warning: #fcbe1d;

/* Light Green Backgrounds */
--bg-light-green: #e8f5e8;
--bg-light-green-alt: #f0f8f0;
--bg-light-green-card: #F2F8F4;
```

### Color Usage Guidelines

#### Primary Green (#435933)
- **Usage**: Main brand color, primary buttons, headers, active states
- **Accessibility**: Ensure sufficient contrast with white text
- **Context**: Trust, growth, financial security

#### Accent Gold (#C38D1C)
- **Usage**: Call-to-action buttons, highlights, important information
- **Accessibility**: Use with dark text for readability
- **Context**: Premium features, success, achievement

#### Secondary Green (#30461f)
- **Usage**: Secondary buttons, navigation, supporting elements
- **Accessibility**: High contrast with white text
- **Context**: Supporting actions, secondary navigation

---

## Typography

### Font Family
The brand uses system fonts for optimal performance and accessibility:

```css
font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
```

### Typography Scale

#### Headings
```css
/* Hero Title */
.hero-title {
  font-size: 3rem; /* 48px */
  font-weight: 700;
  line-height: 1.1;
  color: #435933;
}

/* Section Headings */
.section-heading {
  font-size: 2.375rem; /* 38px */
  font-weight: 700;
  line-height: 1.2;
  color: #01081b;
}

/* Subsection Headings */
.subsection-heading {
  font-size: 1.5rem; /* 24px */
  font-weight: 600;
  line-height: 1.3;
  color: #30461f;
}
```

#### Body Text
```css
/* Large Body Text */
.body-large {
  font-size: 1.125rem; /* 18px */
  font-weight: 400;
  line-height: 1.6;
  color: #4d525f;
}

/* Regular Body Text */
.body-regular {
  font-size: 1rem; /* 16px */
  font-weight: 400;
  line-height: 1.5;
  color: #4d525f;
}

/* Small Text */
.body-small {
  font-size: 0.875rem; /* 14px */
  font-weight: 400;
  line-height: 1.4;
  color: #969696;
}
```

### Responsive Typography
```css
/* Mobile First Approach */
@media (max-width: 640px) {
  .hero-title { font-size: 2rem; }
  .section-heading { font-size: 1.5rem; }
}

@media (min-width: 1024px) {
  .hero-title { font-size: 3.75rem; }
  .section-heading { font-size: 2.375rem; }
}
```

---

## Logo & Brand Assets

### Primary Logo
- **File**: `logo-sama-naffa-vf-logo-1.png`
- **Usage**: Main brand identifier
- **Sizing**: 
  - Mobile: 120px × 67px
  - Desktop: 194px × 109px
- **Clear Space**: Minimum 20px on all sides

### Logo Variations
- **Standard**: Full color on white background
- **Monochrome**: Single color version for limited color applications
- **White**: For use on dark backgrounds

### Brand Icons
The platform uses custom icons for different savings objectives:
- **House**: `/house-1.png` - Home ownership goals
- **Education**: `/mortarboard-1.png` - Educational funding
- **Travel**: `/flight-1.png` - Travel and leisure
- **Business**: `/suitcase-1.png` - Business development
- **Retirement**: `/person-1.png` - Retirement planning

### Persona Icons
Custom avatar icons representing diverse user profiles:
- `/ic_aminata.png` - The advisor friend
- `/ic_astou.png` - Online seller
- `/ic_axel.png` - Spiritual mentor
- `/ic_bilal.png` - Digital entrepreneur
- `/ic_fatima.png` - Ambitious student
- `/ic_khady.png` - Single mother
- `/ic_mbaye.png` - Diaspora member
- `/ic_momar.png` - Daily worker
- `/ic_sophie.png` - Market trader
- `/ic_yankhoba.png` - Taxi driver
- `/ic_yaay absa.png` - Tontine manager
- `/ic_maam seynabou.png` - Protective grandmother
- `/ic_baay abdou.png` - Government employee
- `/ic_mame malick.png` - Religious leader

---

## UI Components

### Buttons

#### Primary Button
```css
.primary-button {
  background: linear-gradient(135deg, #30461f, #435933);
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(67, 89, 51, 0.2);
}

.primary-button:hover {
  background: linear-gradient(135deg, #243318, #364529);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(67, 89, 51, 0.3);
}
```

#### Secondary Button
```css
.secondary-button {
  background: #C38D1C;
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.secondary-button:hover {
  background: #b3830f;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(195, 141, 28, 0.3);
}
```

#### Outline Button
```css
.outline-button {
  background: transparent;
  color: #30461f;
  border: 2px solid #30461f;
  border-radius: 12px;
  padding: 10px 22px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.outline-button:hover {
  background: #30461f;
  color: white;
}
```

### Cards

#### Standard Card
```css
.standard-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(67, 89, 51, 0.08);
  border: 1px solid rgba(67, 89, 51, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.standard-card:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 12px 36px rgba(67, 89, 51, 0.12);
}
```

#### Feature Card
```css
.feature-card {
  background: linear-gradient(135deg, #F2F8F4, white);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(67, 89, 51, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: linear-gradient(135deg, #e8f5e8, #f0f8f0);
  transform: translateY(-4px);
}
```

### Form Elements

#### Input Fields
```css
.form-input {
  background: white;
  border: 2px solid rgba(67, 89, 51, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.form-input:focus {
  border-color: #435933;
  box-shadow: 0 0 0 3px rgba(67, 89, 51, 0.1);
  outline: none;
  transform: translateY(-1px);
}
```

#### Sliders
```css
.custom-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  background: linear-gradient(to right, #435933, #e5e7eb);
  border-radius: 4px;
  outline: none;
}

.custom-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #C38D1C, #b3830f);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 3px 8px rgba(67, 89, 51, 0.3);
}
```

---

## Design Patterns

### Layout Principles

#### Container Widths
- **Mobile**: Full width with 16px padding
- **Tablet**: Max-width with 32px padding
- **Desktop**: Max-width 1400px with 133px horizontal padding

#### Grid System
```css
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 768px) {
  .container { padding: 0 32px; }
}

@media (min-width: 1024px) {
  .container { padding: 0 133px; }
}
```

### Spacing System
```css
/* Spacing Scale */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
```

### Section Spacing
- **Section Padding**: 48px (mobile) / 76px (desktop)
- **Element Spacing**: 24px (mobile) / 32px (desktop)
- **Card Spacing**: 16px (mobile) / 24px (desktop)

---

## Animations & Interactions

### Micro-interactions

#### Hover Effects
```css
.hover-lift {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(67, 89, 51, 0.3);
  transform: translateY(-2px);
}
```

#### Loading Animations
```css
@keyframes fade-in {
  0% { 
    opacity: 0; 
    transform: translateY(30px) scale(0.95); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 15px rgba(179, 131, 15, 0.2);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 25px rgba(179, 131, 15, 0.35);
    transform: scale(1.01);
  }
}
```

#### Button Animations
```css
.button-shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.button-shimmer:hover::before {
  left: 100%;
}
```

### Animation Guidelines
- **Duration**: 0.3s for micro-interactions, 0.6s for page transitions
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` for natural motion
- **Performance**: Use `transform` and `opacity` for smooth animations
- **Accessibility**: Respect `prefers-reduced-motion` settings

---

## Voice & Tone

### Brand Voice
- **Friendly**: Approachable and warm
- **Empowering**: Encouraging and supportive
- **Trustworthy**: Reliable and professional
- **Inclusive**: Welcoming to all backgrounds

### Tone Guidelines

#### Primary Messaging
- **Hero**: "Épargne intelligemment pour réaliser tes projets"
- **Value Prop**: "Rejoignez la révolution de l'épargne digitale en Afrique de l'Ouest"
- **CTA**: "Je m'inscris" / "Je commence à épargner"

#### User Personas
The platform addresses users through personalized personas:
- **Protective**: "Tu penses à ta famille d'abord"
- **Ambitious**: "Tu veux réussir sans être freinée par l'argent"
- **Hardworking**: "Tu bosses dur tous les jours"
- **Entrepreneurial**: "Tu veux transformer tes idées en business solide"

#### Language Style
- **Informal**: Use "tu" instead of "vous" for familiarity
- **Local**: Incorporate West African cultural references
- **Motivational**: Focus on empowerment and achievement
- **Clear**: Simple, direct language for financial concepts

---

## Implementation Guidelines

### CSS Custom Properties
```css
:root {
  /* Brand Colors */
  --primary-green: #435933;
  --accent-gold: #C38D1C;
  --secondary-green: #30461f;
  
  /* Spacing */
  --container-padding: 16px;
  --section-padding: 48px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(67, 89, 51, 0.08);
  --shadow-md: 0 6px 24px rgba(67, 89, 51, 0.12);
  --shadow-lg: 0 12px 36px rgba(67, 89, 51, 0.15);
}
```

### Responsive Breakpoints
```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Accessibility Standards
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus States**: Visible focus indicators for keyboard navigation
- **Touch Targets**: Minimum 44px for interactive elements
- **Screen Readers**: Proper semantic HTML and ARIA labels

### Performance Considerations
- **Images**: Use WebP format with fallbacks
- **Fonts**: System fonts for optimal loading
- **Animations**: GPU-accelerated transforms
- **Bundle Size**: Tree-shake unused CSS

---

## Brand Applications

### Digital Platforms
- **Web Application**: Primary platform for savings management
- **Mobile App**: Native iOS and Android applications (coming soon)
- **Marketing Website**: Landing pages and promotional content

### Marketing Materials
- **Social Media**: Consistent visual identity across platforms
- **Email Campaigns**: Branded templates and messaging
- **Print Materials**: Business cards, brochures, and signage

### Partnership Materials
- **API Documentation**: Developer-friendly with brand consistency
- **Integration Guides**: Clear, branded technical documentation
- **White-label Solutions**: Customizable brand elements for partners

---

*This style guide serves as the foundation for maintaining consistent brand identity across all Sama Naffa Everest products and communications. For questions or updates, please contact the design team.*

**Last Updated**: January 2025
**Version**: 1.0
