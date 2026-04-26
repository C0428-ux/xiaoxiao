---
name: strategy-review
description: >-
  Evaluates product strategic value through market analysis, competitive research,
  feasibility assessment, and risk identification. Determines whether to proceed,
  pivot, or terminate. Use after product-consult when decisions about direction,
  investment, or priority need validation.
  NOT for: technical architecture decisions, UI design choices, or implementation planning.
version: 1.0
domain: strategy
role: advisor
triggers:
  - /strategy-review
  - 战略评审
  - 审查策略
  - 值不值得做
  - 评估方向
  - 投资回报
output-format: docs/xiaoxiao/plans/strategy-review-output.md
related-skills:
  - product-consult
  - architect
prerequisites:
  - product-consult
---

# Strategy Review | 战略评审

## 强制执行协议

**规则**：
- 必须按顺序执行每个 Step，不得跳过
- 每个 Step 必须执行验证（检查点）才能进入下一步
- 使用 `xiaoxiao save-progress <skill> <step>` 标记步骤完成
- CONFIRM 节点必须等待用户确认，不得自动继续

---

## ⚠️ API 配置检查（首次使用必须执行）

**在执行此 Skill 之前，必须配置搜索 API**：

1. 访问 https://serper.dev 注册账户（免费 2500 次/月）
2. 获取 API Key
3. 配置环境变量：
   ```bash
   # Windows (CMD)
   set SERPER_API_KEY=你的API密钥

   # Windows (PowerShell)
   $env:SERPER_API_KEY="你的API密钥"

   # Mac/Linux
   export SERPER_API_KEY=你的API密钥
   ```
4. 配置完成后，继续执行 Step 1

**重要提示**：
- 如果不配置 API Key，Step 3（市场分析）和 Step 4（竞品分析）将无法使用搜索功能
- 配置一次即可，后续使用无需重复配置

---

## Step 1: 初始化

**动作**：
1. 执行 `xiaoxiao save-progress strategy-review step1-complete`
2. 读取 `./SPEC.md` 获取产品信息
3. 确认产品类型、核心场景、P0 功能

**验证**：SPEC.md 存在且包含产品信息

**CONFIRM**："Step 1 完成。产品：[类型]，核心场景：[场景]。继续？"

---

## Step 2: 方向验证

**动作**：
1. 向用户提问：
   - "这个问题现在值得解决吗？"
   - "做这个会得到什么？不做会失去什么？"
   - "项目的战略目标是什么？"
   - "有哪些资源可用？"
2. 记录方向验证结论

**验证**：用户回答了所有问题

**CONFIRM**："方向验证完成。战略匹配：[结论]。继续？"

---

## Step 3: 市场分析

**前置条件**：需要设置 `SERPER_API_KEY` 环境变量（用于国内搜索）
- 访问 https://serper.dev 免费注册获取 API Key
- Windows: `set SERPER_API_KEY=your_key`
- Mac/Linux: `export SERPER_API_KEY=your_key`

**动作**：
1. 执行搜索命令获取市场规模数据：
   ```bash
   node search.js "[产品类别] market size 2024 TAM" --engine serper
   node search.js "[产品类型] industry growth trend" --engine serper
   ```
2. 记录发现（来源必须可验证）
3. 如果搜索失败：
   - 标记为 "Unverified - requires user input"
   - 询问用户是否有内部数据

**验证**：市场数据已记录（即使标记为 Unverified）

**CONFIRM**："市场分析完成。TAM：[数据]，趋势：[趋势]。继续？"

---

## Step 4: 竞品分析

**动作**：
1. 执行搜索命令查找竞品：
   ```bash
   node search.js "[产品类别] competitors" --engine serper
   node search.js "[核心需求] solutions" --engine serper
   ```
2. 记录竞品信息（名称、功能、定价、来源）
3. 如果找不到竞品：
   - 标记 "No direct competitors found"
   - 询问用户是否了解竞品

**验证**：竞品信息已记录

**CONFIRM**："竞品分析完成。发现 [N] 个竞品。继续？"

---

## Step 5: 可行性评估

**动作**：
1. 技术可行性：
   - 技术是否成熟？
   - 最大技术风险是什么？
2. 资源可行性：
   - 需要什么团队？
   - 预计时间？
3. 经济可行性：
   - 开发成本估算？
   - ROI 预期？

**验证**：三个维度的评估都已完成

**CONFIRM**："可行性评估完成。最大风险：[风险]。继续？"

---

## Step 6: 风险识别

**动作**：
1. 识别 3-5 个主要风险
2. 对每个风险评估：
   - 概率：高/中/低
   - 影响：高/中/低
   - 缓解策略
3. 向用户确认：
   - "什么风险可能导致项目失败？"
   - "什么会让你改变主意？"

**验证**：风险列表已创建并评估

**CONFIRM**："风险识别完成。主要风险：[列表]。继续？"

---

## Step 7: 决策

**动作**：
1. 综合所有分析，形成建议：
   - **Go**：全面投入
   - **Pivot**：调整范围/方向
   - **No-Go**：终止或重新评估
2. 如果 Go：说明成功条件
3. 如果 No-Go：说明需要什么改变

**验证**：决策已形成

**CONFIRM**："建议：[Go/Pivot/No-Go]。确认决策？"

---

## Step 8: 输出文档

**动作**：
1. 创建 `docs/xiaoxiao/plans/strategy-review-output.md`
2. 包含以下章节：
   - Executive Summary
   - Market Analysis（带来源）
   - Competitive Landscape（带来源）
   - Feasibility Summary
   - Risk Assessment
   - Recommendation
   - Conditions for Success
   - Research Notes
3. 执行 `xiaoxiao complete strategy-review docs/xiaoxiao/plans/strategy-review-output.md`

**验证**：文档已创建且包含所有章节

**CONFIRM**："Strategy Review 完成。文档已保存。确认进入 Architect 阶段？"

---

## 状态更新命令

每个 Step 完成后必须执行：
```bash
xiaoxiao save-progress strategy-review step[N]-complete
```

最终完成必须执行：
```bash
xiaoxiao complete strategy-review docs/xiaoxiao/plans/strategy-review-output.md
```
