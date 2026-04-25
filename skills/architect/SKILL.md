---
name: architect
description: >-
  Designs system architecture by translating product requirements into technical
  blueprints. Defines subsystems, modules, interfaces, data flows, and technology
  choices. Use after strategy-review when technical implementation planning is needed.
  NOT for: UI design decisions, task breakdown, or coding implementation.
version: 1.0
domain: architecture
role: architect
triggers:
  - /architect
  - 架构设计
  - 设计架构
  - 技术方案
  - 系统设计
  - 优化架构
  - 重构
  - 调整架构
prerequisites:
  - strategy-review
output-format: docs/xiaoxiao/plans/architect-output.md
related-skills:
  - strategy-review
  - ui-design
  - task-planning
---

# Architect | 架构师

## 强制执行协议

**规则**：
- 必须按顺序执行每个 Step，不得跳过
- 每个 Step 必须执行验证（检查点）才能进入下一步
- 使用 `xiaoxiao save-progress <skill> <step>` 标记步骤完成
- CONFIRM 节点必须等待用户确认，不得自动继续

---

## Step 1: 初始化

**动作**：
1. 执行 `xiaoxiao save-progress architect step1-complete`
2. 检查 `./SPEC.md` 是否存在
3. 检查 `docs/xiaoxiao/plans/strategy-review-output.md` 是否存在

**验证**：两个文件都存在

**CONFIRM**："Step 1 完成。SPEC.md 和 strategy-review-output.md 都存在。继续？"

---

## Step 2: 需求提取

**动作**：
1. 读取 `./SPEC.md` - 提取功能需求
2. 读取 `docs/xiaoxiao/plans/strategy-review-output.md` - 记录约束和决策
3. 识别非功能需求：
   - 性能：延迟、吞吐量、扩展性
   - 可靠性：正常运行时间、恢复、冗余
   - 安全性：认证、授权、数据保护
   - 可观测性：日志、指标、追踪

**验证**：需求已按类别组织

**CONFIRM**："需求提取完成。识别到 [N] 个功能需求，[N] 个非功能约束。继续？"

---

## Step 3: 架构模式选择

**动作**：
1. 向用户提问："团队规模多大？"（<10人 / 10-50人 / 50+人）
2. 向用户提问："最看重什么？"（快速迭代 / 稳定性 / 扩展性 / 成本）
3. 根据回答推荐架构模式：
   - <10人 + 快速迭代 → Monolith 或 Modular Monolith
   - 10-50人 + 扩展性 → Modular Monolith 或 Microservices
   - 50+人 + 独立部署 → Microservices
4. 记录选择的模式和理由

**验证**：架构模式已选择并记录理由

**CONFIRM**："架构模式：[模式]。理由：[理由]。继续？"

---

## Step 4: 子系统分解

**动作**：
1. 识别bounded contexts / 主要领域
2. 定义子系统，每个子系统有单一职责
3. 为每个子系统命名（统一语言）
4. 记录子系统职责
5. 识别横切关注点（认证、日志、配置）

**验证**：子系统列表已创建

**CONFIRM**："子系统：[列表]。共 [N] 个。继续？"

---

## Step 5: 接口与数据流设计

**动作**：
1. 定义子系统之间的接口
2. 明确：
   - API 契约（请求/响应格式）
   - 事件模式（异步通信）
   - 数据所有权（谁是数据源）
3. 设计数据流：同步 vs 异步路径
4. 记录错误处理和回退路径

**验证**：关键接口已定义

**CONFIRM**："接口设计完成。定义了 [N] 个 API。继续？"

---

## Step 6: 技术决策

**动作**：
1. 为每个子系统做出关键技术选择：
   - 语言/框架
   - 数据库（SQL vs NoSQL，具体技术）
   - 基础设施（云、容器、serverless）
2. 为每个重大决策创建 ADR（架构决策记录）
3. 向用户确认："有什么技术是你已有 expertise 想继续用的？"

**验证**：技术栈已定义，每个重大决策有 ADR

**CONFIRM**："技术栈：[栈]。ADR：[N] 个。继续？"

---

## Step 7: 风险与缓解

**动作**：
1. 识别 3-5 个主要技术风险
2. 对每个风险评估：
   - 概率：高/中/低
   - 影响：高/中/低
   - 缓解策略
3. 向用户确认："有什么风险会导致架构失败？"

**验证**：风险列表已创建

**CONFIRM**："主要风险：[列表]。继续？"

---

## Step 8: 输出文档

**动作**：
1. 创建 `docs/xiaoxiao/plans/architect-output.md`
2. 包含以下章节：
   - Overview（系统目的和范围）
   - Architecture Pattern（选择的模式及理由）
   - Subsystem Decomposition（子系统及职责）
   - Interface Design（关键 API 和数据流）
   - Technology Stack（每个子系统的技术选择及理由）
   - ADRs（重大决策记录）
   - Architecture Diagram（Mermaid 图）
   - Cross-Cutting Concerns（认证、日志、配置）
3. 执行 `xiaoxiao complete architect docs/xiaoxiao/plans/architect-output.md`

**验证**：文档已创建且包含所有章节

**CONFIRM**："Architect 完成。文档已保存。确认进入 UI Design 阶段？"

---

## 状态更新命令

每个 Step 完成后必须执行：
```bash
xiaoxiao save-progress architect step[N]-complete
```

最终完成必须执行：
```bash
xiaoxiao complete architect docs/xiaoxiao/plans/architect-output.md
```