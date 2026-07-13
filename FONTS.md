# Snuggle - Typography Documentation

## Current Font Stack

### Primary Fonts

#### 1. Inter (Sans-serif)
- **Usage**: Body text, UI elements, navigation, buttons, descriptions
- **Weights**: 300, 400, 500, 600
- **Source**: Google Fonts
- **Implementation**: `font-sans` class in Tailwind CSS (primary font in stack)
- **Fallback**: sans-serif

#### 2. Fraunces (Serif)
- **Usage**: Headings, titles, hero text (free lookalike for "Editors Note", a paid editorial serif)
- **Weights**: 300–700, variable (opsz axis 9–144)
- **Styles**: Regular, Italic
- **Source**: Google Fonts
- **Implementation**: `font-serif` class in Tailwind CSS (primary font in stack)
- **Fallback**: serif

#### 3. Maglisto (Logo)
- **Usage**: Brand name "Snuggle" in Logo and Footer
- **Weights**: 400 (Regular)
- **Source**: Custom Font (`/public/Font/maglisto/Maglisto.otf`)
- **Implementation**: `font-logo` class in Tailwind CSS
- **Fallback**: serif

## Font Loading

### Google Fonts
Inter and Playfair Display are loaded via Google Fonts CDN in [index.html](file:///Volumes/Iker%20Bck%201/sys/CascadeProjects/Snuggles/index.html):

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&display=swap" rel="stylesheet">
```

### Custom Fonts
Maglisto is loaded via `@font-face` in `src/index.css`:

```css
@font-face {
  font-family: 'Maglisto';
  src: url('/Font/maglisto/Maglisto.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

## Typography System

### Font Families (Tailwind Config)
```javascript
fontFamily: {
  sans: ["Inter", "sans-serif"],
  serif: ["Fraunces", "serif"],
  logo: ["Maglisto", "serif"],
}
```

### Common Usage Patterns

- **Brand Logo**: `font-logo` (Maglisto)
- **Navigation Links**: `font-sans` (Inter)
- **Section Headings**: `font-serif` (Fraunces)
- **Body Text**: `font-sans` (Inter)
- **Buttons**: `font-sans` (Inter)

## Version History

### Version 1.3 (Current)
- **Title Font**: Fraunces (free Google Fonts lookalike for "Editors Note", a paid editorial serif)
- **Body Font**: Inter (unchanged)
- **Logo Font**: Kept as Maglisto
- **Status**: Active
- **Date**: 2026-07-13

### Version 1.2
- **Title Font**: Reverted to Playfair Display
- **Body Font**: Reverted to Inter
- **Logo Font**: Kept as Maglisto
- **Status**: Active
- **Date**: 2025-02-25

### Version 1.1
- **Fonts**: Lunea (Body) + Balkist (Titles) + Maglisto (Logo)
- **Status**: Archived
- **Date**: 2025-02-25

### Version 1.0
- **Fonts**: Inter + Playfair Display
- **Status**: Archived
- **Date**: 2025-02-25

---

*This documentation is automatically maintained. Last updated: February 25, 2025*