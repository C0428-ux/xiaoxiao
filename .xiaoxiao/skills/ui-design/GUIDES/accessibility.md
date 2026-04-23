# 无障碍设计指南 | Accessibility

## 核心目标

确保产品对所有用户可访问，包括残障人士。

## WCAG 2.1 AA 标准

| 原则 | 说明 |
|------|------|
| 可感知 | 信息和组件对用户可感知 |
| 可操作 | 用户可以操作界面 |
| 可理解 | 信息和界面操作可理解 |
| 健壮性 | 内容可被多种方式解释 |

## 视觉无障碍

### 颜色对比

```markdown
## 文字对比度

| 场景 | 最小对比度 |
|------|-----------|
| 正常文字 | 4.5:1 |
| 大文字(18px+) | 3:1 |
| UI组件和图形 | 3:1 |

## 检查工具
- WebAIM Contrast Checker
- Figma Contrast plugin
```

### 不要只靠颜色传达信息

```markdown
# 错误
状态：红色 = 错误，绿色 = 成功

# 正确
状态：红色 + 图标 + 文字说明
```

## 键盘无障碍

### 焦点可见

```markdown
/* 焦点样式 */
:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

### 焦点顺序

```markdown
Tab键顺序 = 视觉逻辑顺序
1 → 2 → 3 → 4（按阅读顺序）
```

### 快捷键

```markdown
| 快捷键 | 操作 |
|--------|------|
| Tab | 下一个焦点 |
| Shift+Tab | 上一个焦点 |
| Enter | 激活按钮/链接 |
| Escape | 关闭弹窗/取消 |
| Space | 激活按钮 |
```

## 屏幕阅读器支持

### 语义化标签

```markdown
<button> 按钮（自动读出）
<a href> 链接（自动读出）
<h1>-<h6> 标题（层级结构）
<input> 输入框（自动读出标签）
```

### ARIA 属性

```markdown
## 必要属性
aria-label="关闭按钮"
aria-describedby="error-message"
aria-required="true"

## 状态属性
aria-expanded="true/false"
aria-selected="true/false"
aria-disabled="true/false"
aria-hidden="true"
```

### 图片描述

```markdown
<img src="chart.png" alt="12月销售增长20%的图表">
<img src="icon.png" alt=""> (装饰图用alt="")
```

## 表单无障碍

### 标签关联

```markdown
<label for="email">邮箱</label>
<input id="email" type="email">

<!-- 或 -->
<label>
  邮箱
  <input type="email">
</label>
```

### 错误提示

```markdown
<input id="password" aria-describedby="password-hint" aria-invalid="true">
<span id="password-hint">密码至少8位</span>
```

## 动态内容无障碍

### 实时更新

```markdown
<!-- 页面更新时通知屏幕阅读器 -->
<div aria-live="polite" aria-atomic="true">
  新内容已加载
</div>
```

### 加载状态

```markdown
<!-- 告诉屏幕阅读器正在加载 -->
<div role="status" aria-label="加载中">
  加载中...
</div>
```

## 检查清单

### 视觉
- [ ] 颜色对比度达标
- [ ] 不只靠颜色传达信息
- [ ] 支持放大200%

### 键盘
- [ ] 所有功能可键盘操作
- [ ] 焦点样式可见
- [ ] 焦点顺序合理

### 屏幕阅读器
- [ ] 所有图片有alt
- [ ] 表单有label
- [ ] ARIA使用正确
- [ ] 动态内容有通知

### 测试
- [ ] 关闭图像浏览
- [ ] 仅键盘操作测试
- [ ] 屏幕阅读器测试

## 常用工具

| 工具 | 用途 |
|------|------|
| axe DevTools | 自动检测问题 |
| WAVE | 网页无障碍评估 |
| NVDA (Windows) | 屏幕阅读器 |
| VoiceOver (Mac) | 屏幕阅读器 |

## 何时退出

- 通过 axe DevTools 检测无高危问题
- 键盘操作完整流程可走通
- 屏幕阅读器可读取主要内容
- 颜色对比度符合 AA 标准
