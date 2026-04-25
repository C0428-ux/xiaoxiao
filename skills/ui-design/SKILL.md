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

## 强制执行协议

**规则**：
- 必须按顺序执行每个 Step，不得跳过
- 每个 Step 必须执行验证（检查点）才能进入下一步
- 使用 `xiaoxiao save-progress <skill> <step>` 标记步骤完成
- CONFIRM 节点必须等待用户确认，不得自动继续

---

## Step 1: 初始化

**动作**：
1. 执行 `xiaoxiao save-progress ui-design step1-complete`
2. 检查 `docs/xiaoxiao/plans/architect-output.md` 是否存在
3. 检查 `./SPEC.md` 是否存在

**验证**：两个文件都存在

**CONFIRM**："Step 1 完成。架构文档和 SPEC.md 都存在。继续？"

---

## Step 2: 设计风格选择

**动作**：
1. 读取 `docs/xiaoxiao/plans/architect-output.md` - 了解子系统边界
2. 读取 `./SPEC.md` - 提取 P0 功能
3. 向用户展示 5 种设计风格预设：

```
┌─────────────────────────────────────────────────────────┐
│  设计风格选择                                            │
├─────────────────────────────────────────────────────────┤
│  [1] Modern SaaS      - B2B 产品、后台管理               │
│  [2] Apple Minimal    - 消费级 App、工具                │
│  [3] Enterprise       - 企业内部系统                    │
│  [4] Creative         - 作品集、创意网站                 │
│  [5] Dashboard        - 数据平台、Analytics              │
└─────────────────────────────────────────────────────────┘
```

4. 询问用户："哪个设计风格最符合你的产品气质？"
5. 加载选中预设（从 `GUIDES/design-presets.md`）

**验证**：设计预设已确认

**CONFIRM**："设计风格：[风格]。这是你喜欢的方向吗？"

---

## Step 3: 信息架构

**动作**：
1. 定义页面层级结构：
   - Primary：最常用页面（Dashboard、首页）
   - Secondary：支持页面（设置、个人中心）
   - Utility：很少访问的页面
2. 设计导航模型：
   - 顶部导航（适合 3-5 项）
   - 侧边栏（适合 5+ 项）
   - 标签页（适合同页面面板切换）
3. 识别每个 P0 功能的用户接触点
4. 询问用户："导航结构：[top nav/sidebar]。这是你熟悉的方式吗？"

**验证**：IA 确认

**CONFIRM**："IA：[结构]。导航：[模型]。继续？"

---

## Step 4: 页面设计

**动作**：
1. 对每个页面：
   - 定义内容结构
   - 从模式库选择适当组件
   - 使用 Tailwind CSS 类编写 HTML
2. 使用 Tailwind CDN 预览（无需构建步骤）
3. 生成预览：`node skills/ui-design/preview/generate.js --data <page-data.json> --output docs/xiaoxiao/plans/ui-design/preview.html`
4. 询问用户："页面 [X] 设计完成。预览效果如何？需要调整吗？"

**验证**：所有页面设计完成

**CONFIRM**："页面设计完成。共 [N] 个页面。继续？"

---

## Step 5: 预览与迭代

**动作**：
1. 运行预览生成
2. 打开预览文件给用户
3. 对每个页面询问：
   - "这个页面的设计是否表达了正确的信息层次？"
   - "颜色、间距、组件是否合适？"
   - "有什么需要调整的吗？"
4. 如果用户要求修改：
   - 修改 HTML
   - 重新生成预览
   - 重复直到满意
5. 确认每个页面后再继续下一个

**验证**：所有页面用户已审批

**CONFIRM**："所有页面已审批。继续？"

---

## Step 6: 组件定义

**动作**：
1. 定义跨页面可复用组件：
   - Atomic：Button、Input、Badge、Icon
   - Molecular：Card、Form Group、Modal
   - Organism：Navigation、Data Table、Filter Panel
2. 记录组件状态（默认、悬停、禁用、错误）
3. 参考 `GUIDES/component-patterns.md`
4. 询问用户："组件库定义完成。需要补充哪些组件规格吗？"

**验证**：组件库已定义

**CONFIRM**："组件库定义完成。继续？"

---

## Step 7: 最终审查

**动作**：
1. 与用户一起审查完整设计
2. 对照原始需求检查：
   - 所有 P0 功能有页面？
   - 导航支持用户流程？
   - 组件模式应用一致？
3. 询问用户："设计整体审批通过了吗？"

**验证**：设计整体审批通过

**CONFIRM**："UI Design 整体审批通过了吗？确认后进入 Task Planning。"

---

## Step 8: 输出文件

**动作**：
1. 创建输出目录结构：
```
docs/xiaoxiao/plans/ui-design/
├── preview.html              # 完整预览
├── pages/
│   ├── dashboard.html
│   ├── settings.html
│   └── ...
├── components/
│   └── component-spec.md    # 组件规格
└── design-tokens.json        # 设计令牌
```
2. 执行 `xiaoxiao complete ui-design docs/xiaoxiao/plans/ui-design/`

**验证**：所有文件已创建

**CONFIRM**："UI Design 完成。文件已保存。确认进入 Task Planning 阶段？"

---

## 状态更新命令

每个 Step 完成后必须执行：
```bash
xiaoxiao save-progress ui-design step[N]-complete
```

最终完成必须执行：
```bash
xiaoxiao complete ui-design docs/xiaoxiao/plans/ui-design/
```