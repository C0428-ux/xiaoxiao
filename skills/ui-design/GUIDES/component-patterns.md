# Component Patterns | 组件模式库

20+ 核心组件的最佳实践。参考 [component.gallery](https://component.gallery) 和行业标准。

---

## Button | 按钮

**何时使用**: 触发操作的主入口

**最佳实践**:
- 标签用动词开头：「Save changes」而非「Submit」
- 每个区域只用一个主要按钮（Primary）
- 同一行按钮不超过 3 个
- 图标按钮需有 tooltip 说明

**状态**:
| State | 样式 |
|-------|------|
| Default | 基础色 |
| Hover | 加深 10% |
| Active | 加深 20%，轻微缩小 |
| Disabled | 50% 透明度 |
| Loading | 文字替换为 spinner |

**变体**:
- **Primary**: 填充背景，主色调
- **Secondary**: 边框，背景透明
- **Ghost**: 仅文字，无边框
- **Danger**: 红色，用于删除等危险操作

**反模式**:
- 「Click here」或「Submit」作为标签
- 同一行 4+ 个按钮
- 多个 Primary 按钮

---

## Input | 输入框

**何时使用**: 收集用户文本输入

**最佳实践**:
- 标签在输入框上方（垂直表单更快扫描）
- 占位符仅作为格式提示，不替代标签
- 实时验证（on blur），不要逐字验证
- 必填标记用 asterisk (*) 而非「Required」

**状态**:
| State | 样式 |
|-------|------|
| Default | 灰色边框 |
| Focus | 强调色边框，ring |
| Error | 红色边框 + 错误消息 |
| Disabled | 灰色背景 |

**变体**:
- Text input（单行）
- Textarea（多行）
- Search input（带搜索图标）
- Password（带显示/隐藏切换）

**反模式**:
- 占位符替代标签
- 边框颜色与背景无对比
- 标签在输入框右侧（移动端）

---

## Card | 卡片

**何时使用**: 展示独立的实体内容块

**最佳实践**:
- 内容层次: Media → Title → Meta → Action
- 卡片有边框 OR 阴影，不要同时有
- 卡片之间保持一致间距
- 点击区域要明确（整个卡片可点击？还是有明确 CTA？）

**结构**:
```html
<article class="card">
  <img src="..." alt="..." />  <!-- 可选 -->
  <h3>Title</h3>
  <p class="meta">2 hours ago</p>  <!-- 可选 -->
  <button>Action</button>
</article>
```

**反模式**:
- 多个 Primary 按钮
- 边框和阴影同时使用
- 卡片内容不对齐

---

## Modal | 模态框

**何时使用**: 需要用户专注处理一件事

**最佳实践**:
- 右上角 X 关闭
- 提供 Cancel 按钮
- 支持 Escape 键关闭
- 打开时 trap focus，关闭时恢复 focus
- 点击遮罩层可关闭（可选）

**结构**:
```html
<div class="modal-overlay">
  <div class="modal" role="dialog">
    <header>
      <h2>Title</h2>
      <button aria-label="Close">×</button>
    </header>
    <div class="modal-body">
      <!-- 内容 -->
    </div>
    <footer>
      <button>Cancel</button>
      <button class="primary">Confirm</button>
    </footer>
  </div>
</div>
```

**反模式**:
- Modal 嵌套（用 Drawer 替代）
- 没有关闭方式
- 阻塞用户但不提供信息

---

## Navigation | 导航

**何时使用**: 页面间或区域间切换

**最佳实践**:
- 最多 5-7 个主要项目
- 当前页面/区域要有 active 状态
- Logo 链接到首页
- 移动端用汉堡菜单或底部 Tab

**变体**:
- Top nav（适合 3-5 项）
- Sidebar（适合 5+ 项）
- Tabs（适合同页面不同面板）
- Breadcrumbs（适合层级深的页面）

**反模式**:
- 桌面端用汉堡菜单
- 导航项超过 7 个无组织
- 无 active 状态指示

---

## Table | 表格

**何时使用**: 展示结构化数据，需要比较和排序

**最佳实践**:
- 表头固定（sticky）
- 数字右对齐
- 支持排序列
- 每行 hover 高亮
- 可选: 分页或无限滚动

**结构**:
```html
<table>
  <thead>
    <tr>
      <th>Name <sort-indicator /></th>
      <th class="num">Amount</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Project A</td>
      <td class="num">$12,400</td>
      <td><badge>Active</badge></td>
    </tr>
  </tbody>
</table>
```

**反模式**:
- 无 sticky header，滚动后不知道列名
- 纯文本无格式化
- 单元格内容无省略

---

## Form | 表单

**何时使用**: 收集用户输入并提交

**最佳实践**:
- 单列布局更快扫描
- 必填字段用 asterisk (*) 标记
- 错误信息 inline 显示
- 提交按钮禁用时显示原因
- 成功/失败反馈要明确

**流程**:
1. 显示表单
2. 用户填写
3. 验证（on blur）
4. 提交
5. 反馈结果

**反模式**:
- 多列布局（让视线跳跃）
- 提交后无反馈
- 验证信息位置不一致

---

## Toast | 提示

**何时使用**: 操作成功后的简短确认

**最佳实践**:
- 自动消失 4-6 秒
- 允许手动关闭
- -destructive 操作提供 Undo
- 新消息在上方堆叠
- 位置: 右上角或底部

**结构**:
```html
<div class="toast" role="alert">
  <icon />
  <span>Project saved</span>
  <button aria-label="Dismiss">×</button>
</div>
```

**反模式**:
- 停留超过 10 秒
- 无法手动关闭
- 危险操作无 Undo
- 遮盖重要内容

---

## Alert | 警告提示

**何时使用**: 向用户展示重要状态信息

**最佳实践**:
- 使用语义化颜色（success/error/warning/info）
- 最多 1-2 句话
- 配合图标增强识别
- 可选带操作按钮

**变体**:
- **Success**: 绿色，用于操作成功
- **Error**: 红色，用于错误提示，需要解决
- **Warning**: 黄色/橙色，用于警告
- **Info**: 蓝色，用于一般信息

**反模式**:
- 语义化颜色用于装饰
- 超过 3 行文字
- 堆叠多个 Alert

---

## Badge | 徽章

**何时使用**: 状态标签、元数据

**最佳实践**:
- 1-2 个词
- pill 形状用于状态
- 颜色不超过 3 种（区分不同状态）
- 与上下文对比度足够

**变体**:
- **Status badges**: Active, Pending, Archived
- **Count badges**: 数字计数
- **Tag badges**: 分类标签

**反模式**:
- 彩虹配色（每个状态一个鲜艳颜色）
- 超过 3 个词
- 边框与背景无对比

---

## Empty State | 空状态

**何时使用**: 列表/数据为空时

**最佳实践**:
- 提供插图或图标
- 用正向语言（「还没有项目，创建第一个吧」而非「暂无数据」）
- 提供 CTA 按钮引导用户行动

**结构**:
```html
<div class="empty-state">
  <icon illustration />
  <h3>No projects yet</h3>
  <p>Create your first project to get started</p>
  <button>New Project</button>
</div>
```

**反模式**:
- 「No data」纯文字
- 无引导用户下一步
- 负面语气

---

## Loading | 加载状态

**何时使用**: 内容加载中

**最佳实践**:
- Skeleton 优于 Spinner（300ms 延迟后显示）
- Skeleton 要与实际布局匹配
- Spinner 用于按钮内或小区域
- 提供加载进度百分比（如果可计算）

**Skeleton 示例**:
```html
<div class="skeleton">
  <div class="skeleton-line" style="width: 60%"></div>
  <div class="skeleton-line" style="width: 80%"></div>
  <div class="skeleton-line" style="width: 40%"></div>
</div>
```

**反模式**:
- Spinner 用于可预知布局的内容
- 骨架屏与实际内容布局不符
- 无加载状态（内容闪烁）

---

## Dropdown | 下拉菜单

**何时使用**: 选择列表、操作菜单

**最佳实践**:
- 菜单项 7±2 个（符合认知）
- 危险操作放在最后，用红色
- 支持键盘导航（上下箭头 + Enter）
- 点击外部或 Escape 关闭

**结构**:
```html
<div class="dropdown">
  <button aria-haspopup="true">Options</button>
  <ul class="dropdown-menu" role="menu">
    <li><button role="menuitem">Edit</button></li>
    <li><button role="menuitem">Duplicate</button></li>
    <li class="divider"></li>
    <li><button role="menuitem" class="danger">Delete</button></li>
  </ul>
</div>
```

**反模式**:
- 菜单项超过 10 个（用分组或搜索替代）
- 无键盘导航
- 危险操作在列表顶部

---

## Tabs | 标签页

**何时使用**: 同页面切换不同面板

**最佳实践**:
- 2-7 个 Tab
- Active 状态有视觉指示（底线或背景）
- 移动端折叠为 Accordion 或 Scroll
- Tab 内容懒加载

**反模式**:
- 超过 7 个 Tab
- 无 active 状态指示
- Tab 间内容无关联

---

## Drawer | 抽屉

**何时使用**: 次要面板、详情侧边栏

**最佳实践**:
- 右滑打开（详情面板）
- 左滑打开（辅助导航）
- 宽度 320-480px（桌面）
- 点击外部或 X 关闭

**反模式**:
- 遮罩整个页面
- 与 Modal 混淆使用

---

## Avatar | 头像

**何时使用**: 用户标识

**最佳实践**:
- 圆形或圆角方形
- 提供 fallback（首字母或默认图）
- 多个头像堆叠显示
- 支持在线/离线状态指示

**尺寸**:
- sm: 24-32px（列表内）
- md: 40-48px（默认）
- lg: 64-80px（个人页）

---

## Tooltip | 工具提示

**何时使用**: 图标按钮的说明

**最佳实践**:
- 延迟显示 200-300ms
- 悬浮在触发元素上方
- 文字简短（1-2 句）
- 不用于关键信息

**反模式**:
- 关键信息只用 Tooltip
- 无延迟，频繁触发
- 文字超过 3 行

---

## 布局模式

### 单列布局
适用于: 表单、详情页、注册/登录

### 两栏布局
适用于: Dashboard、列表+详情

```
[Sidebar 240px] [Content fluid]
```

### 三栏布局
适用于: 邮件、复杂 Dashboard

```
[Nav 240px] [Content fluid] [Detail 320px]
```

### 网格布局
适用于: 卡片列表、相册、产品列表

```
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
```

---

## 组件组合规则

### 表单 + 卡片
```
Card
  Header: 标题 + 操作按钮
  Body: Form
    Input groups
    Validation messages
  Footer: Cancel + Submit
```

### 列表 + 分页
```
Container
  Header: 标题 + New 按钮
  Filter bar (optional)
  Table / Card list
  Pagination / Load more
```

### Dashboard 布局
```
Dashboard
  KPI Cards row
  Chart row
  Table / List row
```

---

## 快速查询表

| 需求 | 组件 |
|------|------|
| 触发操作 | Button |
| 收集输入 | Input, Form, Select |
| 展示内容 | Card, Table, Badge, Avatar |
| 导航 | Navigation, Tabs, Breadcrumbs |
| 反馈 | Toast, Alert, Modal |
| 状态 | Empty State, Loading, Skeleton |
| 组织 | Drawer, Dropdown, Tooltip |
