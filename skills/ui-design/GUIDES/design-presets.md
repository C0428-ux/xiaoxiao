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

## 6. Developer Tools / GitHub Style

**Applicable scenarios**: DevTools, IDE extensions, code editors, CI/CD dashboards

**Philosophy**: Information-dense but readable, keyboard-first, dark mode default.

### Colors
```css
--color-bg: #0d1117;
--color-surface: #161b22;
--color-border: #30363d;
--color-text-primary: #e6edf3;
--color-text-secondary: #8b949e;
--color-accent: #58a6ff;        /* Blue 400 */
--color-accent-hover: #79c0ff;
--color-success: #3fb950;
--color-warning: #d29922;
--color-error: #f85149;
```

### Typography
- **Display**: JetBrains Mono, Fira Code, monospace
- **Body**: system-ui, -apple-system, sans-serif
- **Scale**: 12/14/16/20/24px
- **Code**: 13px, line-height 1.6

### Spacing
- **Grid**: 4px base
- **Scale**: 4, 8, 12, 16, 24, 32px
- **Panels**: 8px padding, 1px borders

### Components
- Rounded corners: 6px
- Shadows: none, use borders
- Buttons: subtle, keyboard shortcuts visible
- Tables: compact, syntax highlighting
- Inputs: dark background, focus ring

---

## 7. FinTech / Banking

**Applicable scenarios**: Finance apps, banking, payment systems, trading platforms

**Philosophy**: Trust through precision, data clarity, security-conscious design.

### Colors
```css
--color-bg: #f8fafc;
--color-surface: #ffffff;
--color-border: #e2e8f0;
--color-text-primary: #0f172a;
--color-text-secondary: #64748b;
--color-accent: #0f766e;        /* Teal 700 */
--color-accent-hover: #115e59;
--color-success: #059669;
--color-warning: #d97706;
--color-error: #dc2626;
--color-highlight: #fef3c7;     /* Amber 100 - for important numbers */
```

### Typography
- **Display**: DM Sans, Inter, sans-serif
- **Body**: DM Sans, clear readability
- **Scale**: 12/14/16/18/24/32/48px
- **Numbers**: Tabular nums, slight letter-spacing

### Spacing
- **Grid**: 4px base
- **Scale**: 4, 8, 12, 16, 24, 32, 48px
- **Cards**: 24px padding, subtle shadow

### Components
- Rounded corners: 8-12px
- Shadows: subtle, layered
- Cards: white, soft shadow, 24px padding
- Buttons: solid, trust-building colors
- Tables: zebra striping, clear headers
- Security indicators: lock icons, verification badges

---

## 8. Healthcare / Medical

**Applicable scenarios**: Health apps, medical records, telemedicine, fitness tracking

**Philosophy**: Clean, calming, accessible. Trust and clarity over style.

### Colors
```css
--color-bg: #f0fdf4;           /* Green 50 */
--color-surface: #ffffff;
--color-border: #bbf7d0;        /* Green 200 */
--color-text-primary: #14532d;  /* Green 900 */
--color-text-secondary: #166534;
--color-accent: #16a34a;        /* Green 600 */
--color-accent-hover: #15803d;
--color-success: #22c55e;
--color-warning: #eab308;
--color-error: #ef4444;
--color-info: #3b82f6;
```

### Typography
- **Display**: Inter, -apple-system, sans-serif
- **Body**: Inter, high readability
- **Scale**: 14/16/18/20/24/32px
- **Accessibility**: Minimum 14px body text

### Spacing
- **Grid**: 8px base
- **Scale**: 8, 16, 24, 32, 48px
- **Cards**: generous padding, breathing room

### Components
- Rounded corners: 12-16px (friendly)
- Shadows: very soft, gentle
- Buttons: rounded, clear labels
- Icons: medical-friendly (heart, pulse, plus)
- Accessibility: WCAG AA minimum, large touch targets

---

## 9. E-commerce / Marketplace

**Applicable scenarios**: Online stores, marketplaces, product catalogs

**Philosophy**: Drive conversion, showcase products beautifully, clear CTAs.

### Colors
```css
--color-bg: #ffffff;
--color-surface: #fafafa;
--color-border: #e5e5e5;
--color-text-primary: #171717;
--color-text-secondary: #525252;
--color-accent: #e11d48;        /* Rose 600 - urgency */
--color-accent-hover: #be123c;
--color-success: #16a34a;
--color-warning: #ea580c;       /* Orange 600 - sale */
--color-error: #dc2626;
--color-highlight: #fef08a;     /* Yellow 200 - deals */
```

### Typography
- **Display**: Poppins, -apple-system, sans-serif
- **Body**: Inter, clear product descriptions
- **Scale**: 12/14/16/20/24/32/48px
- **Prices**: Bold, prominent

### Spacing
- **Grid**: 8px base
- **Scale**: 8, 16, 24, 32, 48, 64px
- **Product cards**: 16px gap, consistent grid

### Components
- Rounded corners: 8px (product cards), 4px (buttons)
- Shadows: medium, lift on hover
- Product cards: image-dominant, clear price
- Buttons: high contrast, "Add to Cart" prominent
- Badges: sale, new, limited - color coded
- Reviews: star ratings, social proof

---

## 10. Social / Community

**Applicable scenarios**: Social apps, forums, community platforms, messaging

**Philosophy**: Warm, conversational, encourage interaction. People-first design.

### Colors
```css
--color-bg: #fef7ed;           /* Amber 50 - warm */
--color-surface: #ffffff;
--color-border: #fed7aa;        /* Amber 200 */
--color-text-primary: #1c1917;
--color-text-secondary: #57534e;
--color-accent: #ea580c;        /* Orange 600 */
--color-accent-hover: #c2410c;
--color-success: #16a34a;
--color-warning: #d97706;
--color-error: #ef4444;
--color-message: #dbeafe;        /* Blue 100 - incoming */
--color-message-out: #dcfce7;    /* Green 100 - outgoing */
```

### Typography
- **Display**: Nunito, -apple-system, sans-serif
- **Body**: Nunito, friendly and readable
- **Scale**: 14/16/18/20/24/32px
- **Chat**: 15px, comfortable reading

### Spacing
- **Grid**: 8px base
- **Scale**: 8, 12, 16, 24, 32px
- **Messages**: 12px padding, 8px gap

### Components
- Rounded corners: 16-24px (conversational)
- Shadows: soft, gentle
- Avatars: circular, colorful borders
- Messages: bubble style, timestamps
- Buttons: rounded, emoji-friendly
- Notifications: badges, subtle animations

---

## 11. Gaming / Esports

**Applicable scenarios**: Gaming platforms, esports, game launchers, streaming

**Philosophy**: High energy, immersive, dark mode dominant, futuristic.

### Colors
```css
--color-bg: #0a0a0f;
--color-surface: #12121a;
--color-border: #2a2a3d;
--color-text-primary: #f0f0f5;
--color-text-secondary: #8888a0;
--color-accent: #a855f7;        /* Purple 500 - energy */
--color-accent-hover: #9333ea;
--color-neon-1: #00ff88;         /* Neon green */
--color-neon-2: #ff00ff;         /* Magenta */
--color-neon-3: #00d4ff;         /* Cyan */
--color-success: #22c55e;
--color-warning: #fbbf24;
--color-error: #ef4444;
```

### Typography
- **Display**: Orbitron, Rajdhani, monospace
- **Body**: Inter, -apple-system, sans-serif
- **Scale**: 12/14/16/20/28/36px
- **Headings**: all-caps, letter-spacing 2-4px

### Spacing
- **Grid**: 8px base
- **Scale**: 8, 16, 24, 32, 48px
- **Cards**: 16px padding, neon borders on hover

### Components
- Rounded corners: 4px (tech) or 16px (cards)
- Shadows: glow effects, neon borders
- Cards: dark, gradient borders, glow on hover
- Buttons: gradient backgrounds, glow effects
- Progress bars: animated, neon colors
- Particles: subtle floating elements

---

## 12. Minimal / Brutalist

**Applicable scenarios**: Minimalist products, architectural portfolios, art galleries

**Philosophy**: Extreme restraint, typography as design, no decoration.

### Colors
```css
--color-bg: #ffffff;
--color-surface: #ffffff;
--color-border: #000000;
--color-text-primary: #000000;
--color-text-secondary: #404040;
--color-accent: #000000;
--color-success: #000000;
--color-warning: #404040;
--color-error: #000000;
```

### Typography
- **Display**: Times New Roman, Georgia, serif
- **Body**: Arial, -apple-system, sans-serif
- **Scale**: 12/16/20/32/48/72/96px
- **Headings**: Bold, uppercase optional

### Spacing
- **Grid**: 8px base
- **Scale**: 8, 16, 24, 48, 96, 128px
- **Feature**: Extreme whitespace, asymmetric

### Components
- Rounded corners: 0px
- Shadows: none
- Borders: 2-4px solid black
- Cards: outlined, no fill
- Buttons: black outline, black fill on hover
- Images: black and white, high contrast

---

## 13. Neo-Brutalism

**Applicable scenarios**: Startups, creative agencies, bold brands

**Philosophy**: Bold, raw, intentionally "unpolished". Makes a statement.

### Colors
```css
--color-bg: #fff9db;            /* Yellow 100 */
--color-surface: #ffffff;
--color-border: #000000;
--color-text-primary: #000000;
--color-text-secondary: #404040;
--color-accent: #ff6b6b;        /* Coral */
--color-accent-alt: #4ecdc4;   /* Teal */
--color-success: #95e679;
--color-warning: #ffd93d;
--color-error: #ff6b6b;
```

### Typography
- **Display**: Space Grotesk, -apple-system, sans-serif
- **Body**: Inter, -apple-system, sans-serif
- **Scale**: 14/16/20/28/40/56px
- **Headings**: Bold, slight rotation (-2 to 2deg)

### Spacing
- **Grid**: 8px base
- **Scale**: 8, 16, 24, 32, 48px
- **Feature**: intentional misalignment

### Components
- Rounded corners: 0px or 16px (harsh contrast)
- Shadows: solid black offset (4px 4px 0 #000)
- Cards: white fill, thick black border
- Buttons: solid fill, thick border, offset shadow
- Icons: simple, thick strokes
- Hover: shadow moves, slight scale

---

## 14. Glass / Frosted

**Applicable scenarios**: Premium apps, mobile apps, layered interfaces

**Philosophy**: Depth through transparency, modern, sleek, layered UI.

### Colors
```css
--color-bg: #1e1e2e;            /* Dark base */
--color-surface: rgba(255,255,255,0.08);
--color-surface-hover: rgba(255,255,255,0.12);
--color-border: rgba(255,255,255,0.15);
--color-text-primary: #ffffff;
--color-text-secondary: #a0a0b0;
--color-accent: #7c3aed;        /* Violet 600 */
--color-accent-hover: #6d28d9;
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
```

### Typography
- **Display**: Plus Jakarta Sans, Inter, sans-serif
- **Body**: Plus Jakarta Sans, -apple-system, sans-serif
- **Scale**: 12/14/16/20/24/32px

### Spacing
- **Grid**: 8px base
- **Scale**: 8, 12, 16, 24, 32, 48px

### Components
- Rounded corners: 16-24px (generous)
- Background: backdrop-filter: blur(16px)
- Borders: 1px solid rgba(255,255,255,0.2)
- Cards: semi-transparent, blur backdrop
- Shadows: colored glow behind elements
- Buttons: gradient or glass effect

---

## 15. Retro / Vintage

**Applicable scenarios**: Heritage brands, artisanal products, nostalgic services

**Philosophy**: Warmth, authenticity, craftsmanship. Time-tested aesthetic.

### Colors
```css
--color-bg: #f5f0e8;            /* Cream */
--color-surface: #ffffff;
--color-border: #d4c4a8;
--color-text-primary: #2d2a26;
--color-text-secondary: #6b635a;
--color-accent: #b45309;         /* Amber 700 */
--color-accent-hover: #92400e;
--color-success: #15803d;
--color-warning: #a16207;
--color-error: #b91c1c;
--color-accent-alt: #7c3aed;     /* For contrast */
```

### Typography
- **Display**: Playfair Display, Georgia, serif
- **Body**: Source Serif Pro, Georgia, serif
- **Scale**: 12/14/16/18/22/28/36px
- **Headings**: Elegant, slight letter-spacing

### Spacing
- **Grid**: 8px base
- **Scale**: 8, 16, 24, 32, 48, 64px
- **Feature**: centered layouts, generous margins

### Components
- Rounded corners: 2-4px (subtle)
- Shadows: very subtle, warm tint
- Cards: bordered, cream background
- Buttons: outlined, warm colors
- Borders: thin, elegant
- Icons: line art, vintage style
- Decorative: subtle patterns, flourishes

---

## Selection Guide (Full)

| Scenario | Recommended Preset |
|----------|-------------------|
| B2B SaaS / Admin | Modern SaaS |
| Consumer App / Tools | Apple-level Minimal |
| Enterprise Internal | Enterprise / Corporate |
| Portfolio / Creative | Creative / Portfolio |
| Data Platform / Analytics | Data Dashboard |
| DevTools / CI-CD | Developer Tools |
| Finance / Banking | FinTech / Banking |
| Health / Medical | Healthcare / Medical |
| Store / Marketplace | E-commerce |
| Social / Forum | Social / Community |
| Gaming / Streaming | Gaming / Esports |
| Minimal / Architecture | Minimal / Brutalist |
| Bold Startup / Brand | Neo-Brutalism |
| Modern Mobile App | Glass / Frosted |
| Heritage Brand | Retro / Vintage |

**When unsure**: Start with Modern SaaS, it's the safest choice.

---

## Application Method

After completing SKILL.md Phase 0:
1. Show user 15 presets (original 5 + new 10)
2. User selects or describes desired style
3. Inject selected preset CSS variables into generated HTML
4. All subsequent components generated based on this preset