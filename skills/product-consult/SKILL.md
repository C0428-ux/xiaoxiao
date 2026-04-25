---
name: product-consult
description: >-
  Designs product features and functionality through structured conversation.
  Defines what product to build, core features, user flows, and MVP scope.
  Use when starting new projects, adding major features, or pivoting product direction.
  NOT for: bug fixes, minor UI tweaks, performance optimizations, or tasks with
  existing detailed specs.
version: 1.0
domain: product
role: product-designer
triggers:
  - /product-consult
  - 产品咨询
  - 我要做产品
  - 新项目
  - 添加功能
  - 需求不明确
  - 需求不清
  - 做产品
  - 设计产品
  - 产品设计
output-format: .SPEC.md
related-skills:
  - strategy-review
  - architect
prerequisites: []
---

# Product Consult | 产品咨询

## 强制执行协议

**规则**：
- 必须按顺序执行每个 Step，不得跳过
- 每个 Step 必须执行验证（检查点）才能进入下一步
- 使用 `xiaoxiao save-progress <skill> <step>` 标记步骤完成
- CONFIRM 节点必须等待用户确认，不得自动继续

---

## Step 1: 初始化

**动作**：
1. 执行 `xiaoxiao save-progress product-consult step1-complete`
2. 向用户提问：
   - "这是什么类型的产品？"（如：Web应用、移动App、SaaS平台等）
   - "主要用户是谁？"（如：管理员、最终用户、开发者等）
3. 确认产品类型

**验证**：用户回答了产品类型和用户

**CONFIRM**："Step 1 完成。产品类型：[类型]，主要用户：[用户]。继续？"

---

## Step 2: 核心场景

**动作**：
1. 向用户提问：
   - "用户要解决的核心问题是什么？"
   - "用户最重要的一个动作是什么？"
2. 用一句话总结：
   - "这是一个 [产品类型]，帮助 [用户] 完成 [核心动作]"
3. 确认总结是否正确

**验证**：核心场景已确认

**CONFIRM**："核心场景：[一句话总结]。正确？"

---

## Step 3: 功能设计

**动作**：
1. 向用户提问：
   - "第一个版本必须有哪些功能？"（P0）
   - "哪些功能重要但不是关键？"（P1）
   - "哪些功能是锦上添花？"（P2）
2. 对每个 P0 功能定义用户流程：
   - 入口：用户如何开始？
   - 核心步骤：必须发生什么？
   - 出口：用户如何完成？
3. 提问："这个产品**绝对不能**做什么？"（明确范围外）

**验证**：P0/P1/P2 功能已定义，范围外已明确

**CONFIRM**："P0: [功能列表]。范围外：[列表]。继续？"

---

## Step 4: UX 结构

**动作**：
1. 向用户提问：
   - "用户如何在功能之间导航？"
   - "主页面/Dashboard 是什么布局？"
   - "用户如何访问 P0 功能？"
2. 列出需要的页面：
   - 主页/仪表盘
   - P0 功能页面
   - 设置/个人中心（如需要）
3. 提问："有不同权限的用户角色吗？"（如：管理员 vs 普通用户）

**验证**：页面列表和导航结构已确认

**CONFIRM**："页面：[列表]。导航：[模型]。继续？"

---

## Step 5: 成功标准

**动作**：
1. 向用户提问："如何衡量这个产品成功了？"
2. 定义 3-5 个可衡量的标准（不是技术指标，是业务结果）：
   - ❌ "快速" → ✅ "<3秒完成主要操作"
   - ❌ "好用" → ✅ "新用户首次任务 <5分钟"
   - ❌ "受欢迎" → ✅ "第3个月 50% 周活用户"

**验证**：3-5 个可衡量标准已定义

**CONFIRM**："成功标准：[列表]。同意？"

---

## Step 6: MVP 范围

**动作**：
1. 向用户提问："发布的绝对最低要求是什么？"
2. 明确边界：
   - **In（包含）**：MVP 必须有的
   - **Out（不包含）**：明确不做
3. 确认 MVP 范围

**验证**：MVP 边界已明确

**CONFIRM**："MVP：[功能]。范围外：[功能]。继续？"

---

## Step 7: 输出 SPEC.md

**动作**：
1. 在项目根目录创建 `.SPEC.md`
2. 包含以下章节：
   - Product Type & Users
   - Core Scenario
   - Features（P0/P1/P2 + 用户流程）
   - UX Structure（页面 + 导航）
   - Success Criteria（3-5 个可衡量标准）
   - MVP Scope（In/Out 列表）
3. 执行 `xiaoxiao complete product-consult .SPEC.md`

**验证**：.SPEC.md 已创建且包含所有章节

**CONFIRM**："SPEC.md 已完成并保存。确认进入 Strategy Review 阶段？"

---

## 状态更新命令

每个 Step 完成后必须执行：
```bash
xiaoxiao save-progress product-consult step[N]-complete
```

最终完成必须执行：
```bash
xiaoxiao complete product-consult .SPEC.md
```
