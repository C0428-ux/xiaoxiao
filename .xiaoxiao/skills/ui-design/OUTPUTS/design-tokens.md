# 设计令牌 | Design Tokens

> 设计的原子单位，确保设计系统的一致性

---

## 颜色

### 主色系

```css
:root {
  /* 主色 */
  --color-primary: #0066cc;
  --color-primary-hover: #0052a3;
  --color-primary-active: #003d7a;

  /* 辅助色 */
  --color-secondary: #6c757d;
  --color-secondary-hover: #5a6268;
  --color-secondary-active: #4a5359;

  /* 功能色 */
  --color-success: #28a745;
  --color-warning: #ffc107;
  --color-error: #dc3545;
  --color-info: #17a2b8;
}
```

### 中性色系

```css
:root {
  --gray-900: #212529;
  --gray-800: #343a40;
  --gray-700: #495057;
  --gray-600: #6c757d;
  --gray-500: #adb5bd;
  --gray-400: #ced4da;
  --gray-300: #dee2e6;
  --gray-200: #e9ecef;
  --gray-100: #f8f9fa;
}
```

### 背景与文字

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;

  --text-primary: #212529;
  --text-secondary: #6c757d;
  --text-disabled: #adb5bd;

  --border-color: #dee2e6;
}
```

## 字体

```css
:root {
  /* 字体家族 */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SF Mono", Monaco, "Cascadia Code", monospace;

  /* 字号 */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 30px;
  --text-4xl: 36px;

  /* 行高 */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* 字重 */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

## 间距

```css
:root {
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}
```

## 圆角

```css
:root {
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;
}
```

## 阴影

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
}
```

## 动画

```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;

  --ease-in: ease-in;
  --ease-out: ease-out;
  --ease-in-out: ease-in-out;
}
```

## 断点

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

## 使用示例

```css
.button {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  background-color: var(--color-primary);
  color: white;
  transition: all var(--duration-fast) var(--ease-out);
}

.button:hover {
  background-color: var(--color-primary-hover);
}

.button:active {
  background-color: var(--color-primary-active);
}
```
