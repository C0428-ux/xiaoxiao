# Design Presets | Design Presets

Validated design directions for different scenarios. Start with common presets, expand as needed.

---

## Common Presets (Start Here)

These 5 presets cover 80% of use cases. Start here unless you have specific requirements.

### 1. Modern SaaS (Default)

**Applicable**: B2B/SaaS, admin systems, collaboration tools

```css
--color-bg: #fafafa;
--color-surface: #ffffff;
--color-border: #e5e5e5;
--color-text-primary: #171717;
--color-text-secondary: #737373;
--color-accent: #2563eb;
--color-accent-hover: #1d4ed8;
--color-success: #16a34a;
--color-warning: #ca8a04;
--color-error: #dc2626;
```

**Typography**: Inter, 12/14/16/20/24/32/48px
**Corners**: 6-8px, subtle shadows

---

### 2. Apple-level Minimal

**Applicable**: Consumer apps, premium products, portfolios

```css
--color-bg: #ffffff;
--color-surface: #f5f5f7;
--color-border: #d2d2d7;
--color-text-primary: #1d1d1f;
--color-text-secondary: #86868b;
--color-accent: #0071e3;
--color-accent-hover: #0077ed;
--color-success: #34c759;
--color-warning: #ff9500;
--color-error: #ff3b30;
```

**Typography**: SF Pro, 13/15/17/22/28/41/56px
**Corners**: 12-16px, generous whitespace

---

### 3. Enterprise / Corporate

**Applicable**: Enterprise internal systems, government, finance

```css
--color-bg: #f3f4f6;
--color-surface: #ffffff;
--color-border: #d1d5db;
--color-text-primary: #111827;
--color-text-secondary: #6b7280;
--color-accent: #4f46e5;
--color-accent-hover: #4338ca;
--color-success: #059669;
--color-warning: #d97706;
--color-error: #dc2626;
```

**Typography**: system-ui, 11/13/14/16/18/20/24px (compact)
**Corners**: 4-6px, borders instead of shadows

---

### 4. Creative / Portfolio

**Applicable**: Portfolios, creative agencies, art/fashion

```css
--color-bg: #0a0a0a;
--color-surface: #171717;
--color-border: #262626;
--color-text-primary: #fafafa;
--color-text-secondary: #a3a3a3;
--color-accent: #f97316;
--color-accent-alt: #eab308;
--color-success: #22c55e;
--color-warning: #facc15;
--color-error: #ef4444;
```

**Typography**: Decorative fonts, 32/48/64/96px bold
**Corners**: 0px or 16-24px (polarized), dark theme

---

### 5. Data Dashboard

**Applicable**: Data visualization, monitoring, analytics

```css
--color-bg: #0f172a;
--color-surface: #1e293b;
--color-border: #334155;
--color-text-primary: #f8fafc;
--color-text-secondary: #94a3b8;
--color-accent: #3b82f6;
--color-chart-1: #3b82f6;
--color-chart-2: #10b981;
--color-chart-3: #f59e0b;
--color-chart-4: #ef4444;
--color-chart-5: #8b5cf6;
```

**Typography**: Inter, tabular nums, 11/12/14/16/20/24/32px
**Corners**: 8-12px, dark theme, high scanability

---

## Expert Presets

When common presets don't fit, explore these specialized styles.

**To access**: Say "show expert presets" or "more design styles"

| # | Style | Quick Description |
|---|-------|------------------|
| 6 | Developer Tools | Dark, monospace, keyboard-first |
| 7 | FinTech | Trust, precision, security |
| 8 | Healthcare | Clean, calming, accessible |
| 9 | E-commerce | Conversion-focused, product showcase |
| 10 | Social | Warm, conversational, avatar-centric |
| 11 | Gaming | High energy, neon, dark mode |
| 12 | Minimal | Extreme restraint, typography focus |
| 13 | Neo-Brutalism | Bold, raw, offset shadows |
| 14 | Glass/Frosted | Transparent, layered, modern |
| 15 | Retro/Vintage | Warm, heritage, artisanal |

Full specs: `GUIDES/design-presets-expert.md`

---

## Selection Flow

```
1. Show Common Presets (1-5)
2. User selects or describes desired style
3. If unsure → recommend Modern SaaS
4. If user wants more → "Say 'show expert presets' for 10 more styles"
```

---

## Application

1. User selects preset
2. Inject CSS variables into generated HTML
3. All components follow selected preset