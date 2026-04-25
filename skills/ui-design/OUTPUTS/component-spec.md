# Component Specification | 组件规格

项目: {{PROJECT_NAME}}
日期: {{DATE}}
设计风格: {{PRESET_NAME}}

---

## 组件列表

{{#each components}}
### {{name}}

**类型**: {{type}} ({{atomic/molecular/organism}})

**用途**: {{purpose}}

**代码示例**:
```html
{{code}}
```

**Props/Attributes**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
{{#each props}}
| {{name}} | {{type}} | {{default}} | {{description}} |
{{/each}}

**状态**:
| State | Visual Treatment |
|-------|------------------|
{{#each states}}
| {{name}} | {{treatment}} |
{{/each}}

**变体**:
{{#each variants}}
- **{{name}}**: {{description}}
{{/each}}

**使用规则**:
{{usage}}

---

{{/each}}

---

## 组件关系图

```
{{componentHierarchy}}
```

---

## 设计令牌

### 颜色
| Token | Value | Usage |
|-------|-------|-------|
{{#each colors}}
| `{{token}}` | {{value}} | {{usage}} |
{{/each}}

### 字体
| Token | Value | Usage |
|-------|-------|-------|
{{#each typography}}
| `{{token}}` | {{value}} | {{usage}} |
{{/each}}

### 间距
| Token | Value |
|-------|-------|
{{#each spacing}}
| `{{token}}` | {{value}} |
{{/each}}

### 圆角
| Token | Value |
|-------|-------|
{{#each radius}}
| `{{token}}` | {{value}} |
{{/each}}

---

## 布局规则

### 页面结构
```
{{pageStructure}}
```

### 响应式断点
| Breakpoint | Width | Layout |
|------------|-------|--------|
{{#each breakpoints}}
| {{name}} | {{width}} | {{layout}} |
{{/each}}
