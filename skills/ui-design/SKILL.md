---
name: ui-design
description: >-
  Designs user interfaces by producing actual visual output (HTML pages) that users
  can see and judge directly. Supports iteration based on user feedback before
  proceeding. Use after architect when the product needs screen designs.
  NOT for: backend design, task planning, or implementation.
version: 2.0
domain: design
role: designer
triggers:
  - /ui-design
  - 界面设计
  - UI设计
  - 画原型
  - 交互设计
prerequisites:
  - architect
output-format: HTML preview files in docs/xiaoxiao/plans/ui-design/
related-skills:
  - architect
  - task-planning
---

# UI Design | 界面设计

## What Changed in v2

- **Output**: Markdown 文档 → HTML 预览文件（可直接在浏览器打开）
- **Iteration**: 用户可在视觉上判定设计，不满意则修改
- **Presets**: 5 种设计风格预设供选择
- **Preview Tool**: 内置 HTML 生成器，双击即可预览

---

## When to Use

- After architect when screens need visual design
- When designing new screens or flows
- When redesigning existing interfaces
- When component libraries need definition

## When NOT to Use

- Backend or API design (use architect)
- Task breakdown or estimation (use task-planning)
- Implementation (use tdd-development)
- Just asking for code snippets without design context

---

## EXECUTION PROTOCOL

本 skill 的执行协议在 `PROTOCOL.json` 中定义，框架将验证每步执行。使用 `xiaoxiao continue` 启动交互式引导。

## ENTRY CHECK（必须首先执行）

1. 运行 `xiaoxiao save-progress ui-design phase0-start`
2. 才能开始 Phase 0

---

## Core Workflow

### Phase 0: Design Style Selection

**Entry**: Architecture document exists
**Actions**:
1. Read `docs/xiaoxiao/plans/architect-output.md` - understand subsystem boundaries
2. Read `./SPEC.md` - extract P0 features and UX structure
3. Present 5 design style presets to user:

```
┌─────────────────────────────────────────────────────────┐
│  设计风格选择                                            │
├─────────────────────────────────────────────────────────┤
│  [1] Modern SaaS      - B2B 产品、后台管理              │
│  [2] Apple Minimal    - 消费级 App、工具                │
│  [3] Enterprise       - 企业内部系统                    │
│  [4] Creative         - 作品集、创意网站                │
│  [5] Dashboard        - 数据平台、Analytics             │
└─────────────────────────────────────────────────────────┘
```

4. Ask: "哪个设计风格最符合你的产品气质？"
5. Load selected preset from `GUIDES/design-presets.md`
**Exit**: Design preset confirmed

---

### Phase 1: Information Architecture

**Entry**: Design preset confirmed
**Prerequisites Check**:
- If no architecture document found → **BLOCKED**: "Cannot start ui-design. Run architect first."
**Actions**:
1. Define page hierarchy and structure:
   - **Primary**: Most used screens (Dashboard, Home)
   - **Secondary**: Supporting screens (Settings, Profile)
   - **Utility**: Rarely accessed screens
2. Design navigation model:
   - Top nav (适合 3-5 项)
   - Sidebar (适合 5+ 项)
   - Tabs (适合同页面面板切换)
3. Identify user touchpoints for each P0 feature
4. Ask: "导航结构：[top nav/sidebar]。这是你熟悉的方式吗？"
**Exit**: IA confirmed

---

### Phase 2: Screen Design

**Entry**: IA confirmed
**Actions**:
1. For each screen:
   - Define content structure (see `GUIDES/component-patterns.md`)
   - Select appropriate components from pattern library
   - Write HTML using Tailwind CSS classes
2. Use Tailwind CDN in preview - no build step needed
3. Generate preview using `preview/generate.js`
4. Ask: "页面 [X] 设计完成。预览效果如何？需要调整吗？"
**Exit**: All screens designed and preview generated

**Screen Template**:
```html
<!-- Page: [Name] -->
<div class="page-container">
  <!-- Header -->
  <header class="page-header">
    <h1>[Page Title]</h1>
    <button class="btn btn-primary">[Primary Action]</button>
  </header>

  <!-- Content -->
  <main class="page-content">
    <!-- Components based on content type -->
  </main>
</div>
```

---

### Phase 3: Preview & Iteration (NEW)

**Entry**: Screens designed
**Iteration Loop**:
```
┌──────────────────────────────────────────────┐
│  生成预览 → 用户预览 → [不满意? 修改]        │
│       ↓                                      │
│  [满意? 继续下一个]                           │
└──────────────────────────────────────────────┘
```

**Actions**:
1. Run: `node skills/ui-design/preview/generate.js --data <page-data.json> --output docs/xiaoxiao/plans/ui-design/preview.html`
2. Open preview file for user
3. For each screen, ask:
   - "这个页面的设计是否表达了正确的信息层次？"
   - "颜色、间距、组件是否合适？"
   - "有什么需要调整的吗？"
4. If user requests changes:
   - Modify the HTML
   - Regenerate preview
   - Repeat until satisfied
5. Confirm each screen before moving on
**Exit**: All screens approved by user

---

### Phase 4: Component Definition

**Entry**: All screens approved
**Actions**:
1. Define reusable components used across screens:
   - Atomic: Button, Input, Badge, Icon
   - Molecular: Card, Form Group, Modal
   - Organism: Navigation, Data Table, Filter Panel
2. Document component states (default, hover, disabled, error)
3. Reference `GUIDES/component-patterns.md` for best practices
4. Ask: "组件库定义完成。需要补充哪些组件规格吗？"
**Exit**: Component library documented

---

### Phase 5: Final Review

**Entry**: Component library defined
**Actions**:
1. Review complete design with user
2. Check against original requirements:
   - All P0 features have screens?
   - Navigation supports user flows?
   - Component patterns applied consistently?
3. Ask: "设计整体审批通过了吗？"
4. If yes, save output and proceed

**Output Structure**:
```
docs/xiaoxiao/plans/ui-design/
├── preview.html              # 完整预览（多页面）
├── pages/
│   ├── dashboard.html        # 各页面单独 HTML
│   ├── settings.html
│   └── ...
├── components/
│   └── component-spec.md    # 组件规格文档
└── design-tokens.json        # 设计令牌（颜色、字体、间距）
```

**Run on completion**:
```bash
xiaoxiao complete ui-design docs/xiaoxiao/plans/ui-design/
```
This updates `xiaoxiao-state.json` and records the skill output path.

**IMPORTANT**: Without running `xiaoxiao complete`, the skill is not marked as done and next skills will be blocked.

---

## Design Preset Reference

Choose from 5 presets defined in `GUIDES/design-presets.md`:

| Preset | Key Characteristics |
|--------|---------------------|
| **Modern SaaS** | Blue accent, 8px grid, subtle shadows, generous white space |
| **Apple Minimal** | Near-monochrome, large type hierarchy, 12px rounded corners |
| **Enterprise** | Information-dense, small radius, borders not shadows |
| **Creative** | Dark theme, orange accent, asymmetric layouts, bold typography |
| **Dashboard** | Dark slate background, chart colors, data-optimized spacing |

---

## Component Patterns

Reference `GUIDES/component-patterns.md` for:
- Button, Input, Card, Modal, Navigation
- Table, Form, Toast, Alert, Badge
- Empty State, Loading, Dropdown, Tabs, Drawer, Avatar, Tooltip
- Layout patterns (single column, two column, grid)

---

## Constraints

### MUST DO

- Generate actual HTML that renders correctly
- Run preview and let user visually judge each screen
- Iterate based on user feedback before proceeding
- Use consistent component patterns across screens
- Consider responsive behavior (mobile-first)
- Design for empty states, loading states, error states

### MUST NOT DO

- Output markdown documents as "design"
- Skip the preview/iteration step
- Use purple-on-white gradients or Inter/Roboto defaults
- Generate generic AI aesthetics
- Overcomplicate with animations or interactions
- Skip validation states on forms

---

## CONFIRM Nodes

| Phase | Prompt |
|-------|--------|
| Phase 0 | "设计风格: **[X]**。这是你喜欢的方向吗？" |
| Phase 1 | "IA: [structure]。导航: [model]。继续？" |
| Phase 2 Screen N | "页面 **[Name]** 完成。预览效果如何？需要调整吗？" |
| Phase 3 | "所有页面已审批。组件定义完成。继续？" |
| Final | "UI Design 整体审批通过了吗？确认后进入 Task Planning。" |

---

## Reference Guide

| Topic | File |
|-------|------|
| Design Presets (5 styles) | `GUIDES/design-presets.md` |
| Component Patterns | `GUIDES/component-patterns.md` |
| Preview Generator | `preview/generate.js` |
| Design Tokens Template | `OUTPUTS/design-tokens.json` |
