---
name: task-planning
description: >-
  Breaks down designs and requirements into actionable task lists with estimates,
  dependencies, and priorities. Creates sprint-ready backlog from epics and stories.
  Use after ui-design when implementation planning is needed.
  NOT for: architecture decisions, UI design, or actual coding.
version: 1.0
domain: planning
role: planner
triggers:
  - /task-planning
  - 任务规划
  - 规划任务
  - 拆解任务
  - 排期
  - 加功能
  - 添加功能
  - 迭代
  - 新功能
prerequisites:
  - ui-design
output-format: docs/xiaoxiao/plans/task-planning-output.md
related-skills:
  - ui-design
  - tdd-development
---

# Task Planning | 任务规划

## 强制执行协议

**规则**：
- 必须按顺序执行每个 Step，不得跳过
- 每个 Step 必须执行验证（检查点）才能进入下一步
- 使用 `xiaoxiao save-progress <skill> <step>` 标记步骤完成
- CONFIRM 节点必须等待用户确认，不得自动继续

---

## Step 1: 初始化

**动作**：
1. 执行 `xiaoxiao save-progress task-planning step1-complete`
2. 检查 `docs/xiaoxiao/plans/architect-output.md` 是否存在
3. 检查 `docs/xiaoxiao/plans/ui-design/` 是否存在
4. 检查 `./SPEC.md` 是否存在

**验证**：三个文件/目录都存在

**CONFIRM**："Step 1 完成。架构文档、UI设计、SPEC.md 都存在。继续？"

---

## Step 2: 读取技术栈

**动作**：
1. 读取 `docs/xiaoxiao/plans/architect-output.md`
2. 提取技术栈信息：
   - 前端：React/Vue/Angular
   - 后端：Node.js/Go/Python
   - 数据库：PostgreSQL/MongoDB
3. **重要**：任务规划不自己做技术决策，技术选型来自架构阶段

**验证**：技术栈已提取

**CONFIRM**："技术栈：前端 [前端框架]，后端 [后端框架]，数据库 [数据库]。继续？"

---

## Step 3: 读取 UI 设计

**动作**：
1. 读取 `docs/xiaoxiao/plans/ui-design/preview.html`（主预览）
2. 读取 `docs/xiaoxiao/plans/ui-design/pages/*.html`（各页面）
3. 提取组件结构供前端任务参考
4. **重要**：前端任务引用 UI 设计文件，不复制 UI 规格到任务描述

**验证**：UI 设计已读取

**CONFIRM**："UI 设计读取完成。发现 [N] 个页面。继续？"

---

## Step 4: Backlog 提取

**动作**：
1. 从 SPEC.md 提取 P0 功能（必须有的）
2. 从 SPEC.md 提取 P1 功能（重要但非关键）
3. 从 SPEC.md 提取 P2 功能（锦上添花）
4. 询问用户："有没有被取消的功能？"

**验证**：Backlog 项已识别

**CONFIRM**："Backlog 提取完成。P0: [N] 个，P1: [N] 个，P2: [N] 个。继续？"

---

## Step 5: 任务分解

**动作**：
1. 对每个 P0 story 拆解为任务：
   - Backend 任务：API 端点、数据库变更
   - Frontend 任务：组件、页面、状态
   - Infra 任务：配置、部署、迁移
2. 每个任务必须：
   - 小：最多 1-3 天
   - 可测试：能验证完成
   - 独立：内部无阻塞依赖
3. 向用户确认："这个任务太大吗？能拆吗？"

**验证**：所有 stories 分解为任务

**CONFIRM**："任务分解完成。共 [N] 个任务。继续？"

---

## Step 6: 依赖关系映射

**动作**：
1. 识别任务之间的依赖：
   - 内部：同一 story 内（前端需要 API）
   - 外部：跨 story（认证先于项目创建）
   - 技术：数据库迁移先于 API 变更
2. 创建依赖图
3. 识别关键路径（最长依赖链）
4. 询问用户："什么在阻塞其他工作？"

**验证**：依赖已映射，关键路径已识别

**CONFIRM**："依赖映射完成。关键路径：[路径]。继续？"

---

## Step 7: 估算

**动作**：
1. 使用相对估算：
   - XS：1-2 小时
   - S：半天
   - M：1-2 天
   - L：3-5 天
   - XL：5+ 天（进一步拆分）
2. 汇总每个 story 的估算
3. 计算总工作量
4. 询问用户："这个估算符合你的直觉吗？"

**验证**：所有任务已估算

**CONFIRM**："估算完成。总计 [N] 天。继续？"

---

## Step 8: 优先级排序

**动作**：
1. 应用优先级规则：
   - P0（MVP）：发布必须有的
   - P1：重要，很快发布
   - P2：锦上添花，未来发布
2. 按以下顺序排列任务：
   - 优先级（P0 优先）
   - 依赖（阻塞任务优先）
   - 效率（尽可能并行）
3. 确认优先级顺序

**验证**：优先级已确认

**CONFIRM**："优先级：P0 [N] 个任务，P1 [N] 个任务。确认顺序？"

---

## Step 9: 输出文档

**动作**：
1. 创建 `docs/xiaoxiao/plans/task-planning-output.md`
2. 包含以下章节：
   - Overview（总任务数、总估算、时间线）
   - Epic Breakdown（按 epic 分组的 stories）
   - Task List（所有任务含估算和依赖）
   - Priority Order（P0/P1/P2 及理由）
   - Sprint Plan（如适用，按 sprint 分组）
   - Assumptions（估算基于的假设）
3. 执行 `xiaoxiao complete task-planning docs/xiaoxiao/plans/task-planning-output.md`

**验证**：文档已创建且包含所有章节

**CONFIRM**："Task Planning 完成。文档已保存。确认进入 TDD Development 阶段？"

---

## 状态更新命令

每个 Step 完成后必须执行：
```bash
xiaoxiao save-progress task-planning step[N]-complete
```

最终完成必须执行：
```bash
xiaoxiao complete task-planning docs/xiaoxiao/plans/task-planning-output.md
```