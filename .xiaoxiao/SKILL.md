---
name: xiaoxiao
description: |
  XiaoXiao 是一个 AI Agent 开发框架，通过 7 个有序的 Skill 引导完成项目从概念到上线的完整流程。
  产品咨询 → 战略评审 → 架构师 → 界面设计 → 任务规划 → TDD开发 → 代码审查 → 发布上线。
when_to_use: 用户说"/xiaoxiao"、"/xiao"、或"开始开发流程"、"走一遍xiao"
version: 0.7
---

# XiaoXiao | AI 开发流程框架

## 概述

XiaoXiao 通过 7 个有序的 Skill，引导项目从概念到上线的完整流程。

## 开发流程

```
产品咨询 → 战略评审 → 架构师 → 界面设计 → 任务规划 → TDD开发 → 代码审查 → 发布上线
```

## 核心原则

- **做少**：窄比宽好，YAGNI
- **做精**：完整做完，RED-GREEN-REFACTOR
- **有证据**：interest ≠ demand
- **用系统**：系统化调试
- **会收尾**：no half-done projects

## 开始流程

### Step 1: 检查项目状态

```bash
node ~/.claude/skills/xiaoxiao/xiaoxiao.js status
```

- 如果没有 state.json → 询问用户是新建项目还是现有项目添加功能
- 如果有 → 从当前阶段继续

### Step 2: 项目判断

**情况 A：没有 state.json（新建项目）**
→ 运行 `node ~/.claude/skills/xiaoxiao/xiaoxiao.js init-project`

**情况 B：没有 state.json，但当前目录已有项目代码**
→ 先了解现有项目：
  1. 读取项目结构（package.json, README, 主要源码文件）
  2. 询问用户要添加什么功能
  3. 基于现有代码开始 product-consult
→ 运行 `node ~/.claude/skills/xiaoxiao/xiaoxiao.js init-project` 初始化状态

### Step 3: 开始 product-consult

读取并执行：

```
~/.claude/skills/xiaoxiao/skills/product-consult/SKILL.md
```

## 7 个阶段

| 阶段 | 说明 | 产出 |
|------|------|------|
| 1. product-consult | 产品咨询，明确需求 | .SPEC.md |
| 2. strategy-review | 战略评审，评估方向 | 战略建议 |
| 3. architect | 架构设计 | 架构文档 |
| 4. ui-design | 界面设计 | 设计文档 |
| 5. task-planning | 任务规划 | 任务列表 |
| 6. tdd-development | TDD开发 | 代码 |
| 7. ship | 发布上线 | 上线 |

## CONFIRM 节点

每个阶段完成后，Claude 会停下来问你确认：

> "阶段完成，确认进入下一阶段？"

你确认后自动进入下一阶段。

## 状态管理

- 项目状态：`.xiaoxiao/state.json`
- 项目规格：`.SPEC.md`
- 阶段输出：`docs/xiaoxiao/plans/`

## 架构

```
~/.claude/skills/xiaoxiao/     ← 全局框架
├── SKILL.md                  ← 本文件
├── xiaoxiao.js               ← CLI
├── skills/                   ← 7 个阶段
│   ├── product-consult/
│   ├── strategy-review/
│   ├── architect/
│   ├── ui-design/
│   ├── task-planning/
│   ├── tdd-development/
│   └── ship/
```

## 使用示例

**新建项目**：
```
用户：/xiaoxiao
Claude：检查项目状态，未初始化
Claude：询问"新建项目还是现有项目添加功能？"
用户：新建项目
Claude：运行 init-project
Claude：开始 product-consult
...
```

**现有项目添加功能**：
```
用户：/xiaoxiao
Claude：检查项目状态，未初始化，但发现现有项目
Claude：询问"检测到现有项目，要添加什么功能？"
用户：想加一个用户登录功能
Claude：读取现有项目结构，了解技术栈
Claude：开始 product-consult（基于现有代码）
...
```

## 中断与恢复

- 说"中断" → 保存当前进度
- 说"继续" → 从断点恢复

## 注意事项

- 每个阶段产出写入项目目录，不是框架目录
- 遵循渐进式披露：先读 SKILL.md，不够再读 GUIDES/
- .SPEC.md 是**项目规格**，FRAMEWORK.md 是**框架规格**