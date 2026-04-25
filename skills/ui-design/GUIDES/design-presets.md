# Design Presets | 设计风格预设

5 种经过验证的设计方向，适用于不同场景。选择最符合项目气质的风格。

---

## 1. Modern SaaS（默认）

**适用场景**: B2B/SaaS 产品、后台管理系统、协作工具

**Philosophy**: 干净、专业、空间感强。少即是多。

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
- **Display**: Inter (Google Fonts) 或 system-ui
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

**适用场景**: 消费级应用、高端产品、个人作品集

**Philosophy**: 克制、大胆的留白、精确的层次感。模仿 Apple 设计语言。

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
- **Scale**: 13/15/17/22/28/41/56px (Apple 风格)
- **Tracking**: 略紧于默认，增强层次

### Spacing
- **Grid**: 8px base
- **Scale**: 8, 16, 24, 40, 64, 96px
- **特点**: 大量留白，内容区最小 640px 最大 980px

### Components
- Rounded corners: 12-16px (更大的圆角)
- Shadows: 极轻 (0 2px 12px rgba(0,0,0,0.08))
- Cards: 纯色背景或微阴影
- Buttons: Apple 风格，圆角 12px，hover 时微调

---

## 3. Enterprise / Corporate

**适用场景**: 企业内部系统、政府/金融、表格密集型应用

**Philosophy**: 信息密度高、结构清晰、高效操作。功能优先。

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
- **Body**: system-ui, 优先可读性
- **Scale**: 11/13/14/16/18/20/24px (紧凑)
- **Table**: 13px 正文，最小行高 36px

### Spacing
- **Grid**: 4px base（更紧凑）
- **Scale**: 4, 8, 12, 16, 20, 24, 32px
- **Tables**: 单元格 padding 8-12px

### Components
- Rounded corners: 4-6px (较小)
- Shadows: 几乎不用，用边框区分
- Cards: 白色背景，灰色边框
- Forms: 标签在左或上方，紧凑布局
- Tables: 斑马纹，可排序列，固定表头

---

## 4. Creative / Portfolio

**适用场景**: 作品集、创意机构、时尚/艺术相关

**Philosophy**: 打破常规、大胆表达、不对称布局。个性大于一致。

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
- **Display**: 装饰性字体 (Playfair Display, Space Grotesk, etc.)
- **Body**: Inter, -apple-system, sans-serif
- **Scale**: 不规则，强调戏剧性
- **Headings**: 32/48/64/96px (大胆)

### Spacing
- **Grid**: 8px base
- **Scale**: 极端对比 (8px vs 96px)
- **特点**: 不对称边距，文本块可偏移

### Components
- Rounded corners: 0px 或 16-24px (两极化)
- Shadows: 强阴影或无阴影
- Cards: 深色主题，hover 时发光
- Buttons: 描边或全色，鼓励交互
- 动效: 150-300ms ease-out，微妙

---

## 5. Data Dashboard

**适用场景**: 数据可视化、监控面板、Analytics 产品

**Philosophy**: 数据优先、层次清晰、扫描性高。让数据讲故事。

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
- **Display**: Inter 或 DM Sans
- **Body**: Inter, -apple-system, sans-serif
- **Scale**: 11/12/14/16/20/24/32px
- **Numbers**: Tabular nums (font-variant-numeric: tabular-nums)

### Spacing
- **Grid**: 8px base
- **Scale**: 8, 12, 16, 24, 32px
- **Dashboard**: 卡片间 16-24px 间距

### Components
- Rounded corners: 8-12px
- Shadows: 适度，区分层次
- Cards: 深色背景，数据网格布局
- Charts: 16 色盲友好配色
- Tables: 高密度，可排序
- KPI Cards: 数字大，强调趋势

---

## 选择指南

| 场景 | 推荐预设 |
|------|---------|
| B2B SaaS / 管理后台 | Modern SaaS |
| 消费级 App / 工具 | Apple-level Minimal |
| 企业内部系统 | Enterprise / Corporate |
| 作品集 / 创意网站 | Creative / Portfolio |
| 数据平台 / Analytics | Data Dashboard |

**不确定时**: 从 Modern SaaS 开始，它是最安全的选择。

---

## 应用方式

在 `SKILL.md` Phase 0 完成后：
1. 向用户展示 5 种预设
2. 用户选择或描述想要的风格
3. 将选定预设的 CSS variables 注入生成的 HTML
4. 后续所有组件都基于这个预设生成
