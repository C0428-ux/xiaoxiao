# Design Presets | Design Presets

5 validated design directions for different scenarios. Choose the style that best matches your project personality.

---

## 1. Modern SaaS (Default)

**Applicable scenarios**: B2B/SaaS products, admin systems, collaboration tools

**Philosophy**: Clean, professional, spacious. Less is more.

### Colors
```css
--color-bg: #fafafa;
--color-surface: #ffffff;
--color-border: #e5e5e5;
--color-text-primary: #171717;
--color-text-secondary: #737373;
--color-accent: #2563eb;        /* Blue 600 */
--color-accent-hover: #1d4ed8;  /* Blue 700 */
--color-success: #16a34a;
--color-warning: #ca8a04;
--color-error: #dc2626;
```

### Typography
- **Display**: Inter (Google Fonts) or system-ui
- **Body**: Inter, -apple-system, sans-serif
- **Scale**: 12/14/16/20/24/32/48px

### Spacing
- **Grid**: 8px base
- **Scale**: 4, 8, 12, 16, 24, 32, 48, 64px

### Components
- Rounded corners: 6-8px
- Shadows: subtle, layered (0 1px 3px rgba(0,0,0,0.1))
- Cards: white bg, border or shadow, not both
- Buttons: solid primary, ghost secondary

---

## 2. Apple-level Minimal

**Applicable scenarios**: Consumer apps, premium products, personal portfolios

**Philosophy**: Restraint, bold whitespace, precise hierarchy. Emulate Apple design language.

### Colors
```css
--color-bg: #ffffff;
--color-surface: #f5f5f7;
--color-border: #d2d2d7;
--color-text-primary: #1d1d1f;
--color-text-secondary: #86868b;
--color-accent: #0071e3;        /* Apple Blue */
--color-accent-hover: #0077ed;
--color-success: #34c759;
--color-warning: #ff9500;
--color-error: #ff3b30;
```

### Typography
- **Display**: SF Pro Display, -apple-system, BlinkMacSystemFont
- **Body**: SF Pro Text, -apple-system, sans-serif
- **Scale**: 13/15/17/22/28/41/56px (Apple style)
- **Tracking**: Slightly tighter than default, enhanced hierarchy

### Spacing
- **Grid**: 8px base
- **Scale**: 8, 16, 24, 40, 64, 96px
- **Feature**: Generous whitespace, content area minimum 640px maximum 980px

### Components
- Rounded corners: 12-16px (larger)
- Shadows: extremely light (0 2px 12px rgba(0,0,0,0.08))
- Cards: solid color background or subtle shadow
- Buttons: Apple style, 12px rounded corners, subtle adjustment on hover

---

## 3. Enterprise / Corporate

**Applicable scenarios**: Enterprise internal systems, government/finance, data-intensive applications

**Philosophy**: High information density, clear structure, efficient operations. Function first.

### Colors
```css
--color-bg: #f3f4f6;
--color-surface: #ffffff;
--color-border: #d1d5db;
--color-text-primary: #111827;
--color-text-secondary: #6b7280;
--color-accent: #4f46e5;        /* Indigo 600 */
--color-accent-hover: #4338ca;  /* Indigo 700 */
--color-success: #059669;
--color-warning: #d97706;
--color-error: #dc2626;
```

### Typography
- **Display**: system-ui, -apple-system, sans-serif
- **Body**: system-ui, readability first
- **Scale**: 11/13/14/16/18/20/24px (compact)
- **Table**: 13px body, minimum row height 36px

### Spacing
- **Grid**: 4px base (more compact)
- **Scale**: 4, 8, 12, 16, 20, 24, 32px
- **Tables**: cell padding 8-12px

### Components
- Rounded corners: 4-6px (smaller)
- Shadows: almost none, use borders to differentiate
- Cards: white background, gray border
- Forms: labels on left or top, compact layout
- Tables: zebra striping, sortable columns, sticky header

---

## 4. Creative / Portfolio

**Applicable scenarios**: Portfolios, creative agencies, fashion/art related

**Philosophy**: Break conventions, bold expression, asymmetric layouts. Personality over consistency.

### Colors
```css
--color-bg: #0a0a0a;
--color-surface: #171717;
--color-border: #262626;
--color-text-primary: #fafafa;
--color-text-secondary: #a3a3a3;
--color-accent: #f97316;        /* Orange 500 */
--color-accent-alt: #eab308;    /* Yellow 500 */
--color-success: #22c55e;
--color-warning: #facc15;
--color-error: #ef4444;
```

### Typography
- **Display**: Decorative fonts (Playfair Display, Space Grotesk, etc.)
- **Body**: Inter, -apple-system, sans-serif
- **Scale**: Irregular, emphasis on drama
- **Headings**: 32/48/64/96px (bold)

### Spacing
- **Grid**: 8px base
- **Scale**: Extreme contrast (8px vs 96px)
- **Feature**: Asymmetric margins, text blocks can offset

### Components
- Rounded corners: 0px or 16-24px (polarized)
- Shadows: strong shadow or no shadow
- Cards: dark theme, glow on hover
- Buttons: outlined or full color, encouraging interaction
- Motion: 150-300ms ease-out, subtle

---

## 5. Data Dashboard

**Applicable scenarios**: Data visualization, monitoring dashboards, Analytics products

**Philosophy**: Data first, clear hierarchy, high scanability. Let data tell the story.

### Colors
```css
--color-bg: #0f172a;            /* Slate 900 */
--color-surface: #1e293b;       /* Slate 800 */
--color-border: #334155;        /* Slate 700 */
--color-text-primary: #f8fafc;
--color-text-secondary: #94a3b8;
--color-accent: #3b82f6;        /* Blue 500 */
--color-chart-1: #3b82f6;
--color-chart-2: #10b981;
--color-chart-3: #f59e0b;
--color-chart-4: #ef4444;
--color-chart-5: #8b5cf6;
```

### Typography
- **Display**: Inter or DM Sans
- **Body**: Inter, -apple-system, sans-serif
- **Scale**: 11/12/14/16/20/24/32px
- **Numbers**: Tabular nums (font-variant-numeric: tabular-nums)

### Spacing
- **Grid**: 8px base
- **Scale**: 8, 12, 16, 24, 32px
- **Dashboard**: 16-24px gap between cards

### Components
- Rounded corners: 8-12px
- Shadows: moderate, differentiate layers
- Cards: dark background, data grid layout
- Charts: 16 color-blind friendly colors
- Tables: high density, sortable
- KPI Cards: large numbers, emphasize trends

---

## Selection Guide

| Scenario | Recommended Preset |
|----------|-------------------|
| B2B SaaS / Admin | Modern SaaS |
| Consumer App / Tools | Apple-level Minimal |
| Enterprise Internal | Enterprise / Corporate |
| Portfolio / Creative | Creative / Portfolio |
| Data Platform / Analytics | Data Dashboard |

**When unsure**: Start with Modern SaaS, it's the safest choice.

---

## Application Method

After completing SKILL.md Phase 0:
1. Show user 5 presets
2. User selects or describes desired style
3. Inject selected preset CSS variables into generated HTML
4. All subsequent components generated based on this preset