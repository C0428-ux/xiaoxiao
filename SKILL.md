---
name: xiaoxiao
description: |
  XiaoXiao 是一个 AI Agent 开发框架，通过 7 个有序的 Skill 引导完成项目从概念到上线的完整流程。
  产品咨询 → 战略评审 → 架构师 → 界面设计 → 任务规划 → TDD开发 → 发布上线。
when_to_use: 用户说"/xiaoxiao"、"/xiao"、或"开始开发流程"、"走一遍xiao"
version: 0.7
---

# XiaoXiao | AI 开发流程框架

## 强制执行协议

**规则**：
- 必须按顺序执行每个 Step，不得跳过
- 每个 Step 必须执行验证（检查点）才能进入下一步
- 使用 `xiaoxiao save-progress xiaoxiao <step>` 标记步骤完成
- CONFIRM 节点必须等待用户确认，不得自动继续

---

## Step 0: 检查更新

**动作**：
1. 执行 `node xiaoxiao.js update-check`

**验证**：根据输出决定下一步

| 输出包含 | 含义 | 操作 |
|---------|------|------|
| `STATUS: UP_TO_DATE` | 无新版本 | 直接继续 Step 1 |
| `STATUS: UPDATE_AVAILABLE` | 有新版本 | 询问用户是否更新 |
| `STATUS: SKIP_FOREVER` | 已永久跳过 | 直接继续 Step 1 |

**询问用户**（当发现新版本时）：
> 检测到新版本！是否下载更新？
> - 是：运行 `node xiaoxiao.js update`
> - 否：继续 Step 1
> - 永久跳过：运行 `node xiaoxiao.js skip-update`

**CONFIRM**："版本检查完成。继续？"

---

## Step 1: 检查项目状态 + API 配置检查

**动作**：
1. 执行 `node xiaoxiao.js status`
2. 读取 `xiaoxiao-state.json`（如果存在）

**⚠️ API 配置检查（搜索功能必需）**：

检查环境变量 `SERPER_API_KEY` 是否已配置：
```bash
# Windows
echo %SERPER_API_KEY%
# Mac/Linux
echo $SERPER_API_KEY
```

如果**未配置**，提示用户：
> ⚠️ 搜索功能需要配置 API Key
>
> XiaoXiao 的战略评审（strategy-review）需要搜索能力来做市场分析和竞品分析。
>
> **配置步骤**：
> 1. 访问 https://serper.dev 注册（免费 2500 次/月）
> 2. 获取 API Key
> 3. 配置环境变量：
>    - Windows CMD: `set SERPER_API_KEY=你的密钥`
>    - Windows PowerShell: `$env:SERPER_API_KEY="你的密钥"`
>    - Mac/Linux: `export SERPER_API_KEY=你的密钥`
>
> 配置完成后继续。

**验证**：状态已获取，API 已配置或用户选择跳过

**CONFIRM**：
- 如果没有 state.json："未检测到项目。是要新建项目还是现有项目添加功能？"
- 如果有 state.json："检测到已有项目：[项目名]。从当前阶段继续还是重新开始？"

---

## Step 2: 项目初始化

**根据用户回答执行**：

### 情况 A：新建项目

**动作**：
1. 执行 `node xiaoxiao.js init-project [项目名]`
2. 向用户询问项目名称（如果未提供）
3. 创建项目目录和初始状态

**验证**：项目已初始化

**CONFIRM**："项目 [名称] 已创建。继续进入产品咨询阶段？"

### 情况 B：现有项目添加功能

**动作**：
1. 读取项目结构（package.json, README, 主要源码文件）
2. 询问用户要添加什么功能
3. 基于现有代码开始 product-consult
4. 执行 `node xiaoxiao.js init-project` 初始化状态（如尚未初始化）

**验证**：现有项目已理解，功能需求已明确

**CONFIRM**："现有项目：[项目名]。要添加：[功能]。继续进入产品咨询？"

---

## Step 3: 读取并执行 product-consult

**动作**：
1. 读取 `skills/product-consult/SKILL.md`
2. **同时读取** `skills/product-consult/PROTOCOL.json`（机器可读协议，供框架验证执行）
3. 执行 product-consult skill（按 SKILL.md 的 Step 顺序）

**验证**：product-consult 阶段完成

**CONFIRM**："product-consult 完成。确认进入战略评审阶段？"

---

## Step 4: 自动进入下一个 Skill

**每个 Skill 完成后**：
1. 读取下一个 Skill 的 `SKILL.md`
2. **同时读取**对应的 `PROTOCOL.json`
3. 按 Step 顺序执行

| 完成 | 读取 |
|------|------|
| product-consult | `skills/strategy-review/SKILL.md` + `PROTOCOL.json` |
| strategy-review | `skills/architect/SKILL.md` + `PROTOCOL.json` |
| architect | `skills/ui-design/SKILL.md` + `PROTOCOL.json` |
| ui-design | `skills/task-planning/SKILL.md` + `PROTOCOL.json` |
| task-planning | `skills/tdd-development/SKILL.md` + `PROTOCOL.json` |
| tdd-development | `skills/ship/SKILL.md` + `PROTOCOL.json` |
| ship | 完成 |

**CONFIRM**：每个阶段完成后询问确认才能进入下一个

---

## 状态更新命令

每个 Step 完成后必须执行：
```bash
node xiaoxiao.js save-progress xiaoxiao step[N]-complete
```

---

## 渐进式披露说明

**三层结构**：

1. **入口层**（本文件）：框架入口，硬性执行脚本
2. **Skill 层**（`skills/*/SKILL.md` + `PROTOCOL.json`）：执行脚本 + 机器可读协议
3. **参考层**（`skills/*/GUIDES/*`）：详细文档，按需读取

**读取顺序**：
```
用户触发 → 读取根 SKILL.md → 执行 Step → 读取 skill SKILL.md + PROTOCOL.json → 执行 → 下一个 skill
```

**PROTOCOL.json 作用**：
- 供 `xiaoxiao.js continue` 命令读取并逐步引导执行
- 框架验证每个 Step 是否按顺序执行
- 每个 Phase 的 entry/exit 命令由框架自动执行

---

## 架构

```
D:\XiaoXiao\
├── SKILL.md                  ← 入口文件（本文件）
├── xiaoxiao.js               ← CLI
├── state-manager.js          ← 状态管理
├── skill-loader.js           ← Skill 加载
├── handover.js               ← 交接协议
├── skills/                   ← 7 个阶段
│   ├── product-consult/
│   │   ├── SKILL.md         ← 执行脚本
│   │   ├── PROTOCOL.json    ← 机器可读协议
│   │   └── GUIDES/          ← 参考文档
│   ├── strategy-review/
│   ├── architect/
│   ├── ui-design/
│   ├── task-planning/
│   ├── tdd-development/
│   ├── ship/
│   └── search/              ← 内置搜索工具
└── docs/xiaoxiao/plans/     ← 阶段输出目录
```

---

## 核心原则

- **做少**：窄比宽好，YAGNI
- **做精**：完整做完，RED-GREEN-REFACTOR
- **有证据**：interest ≠ demand
- **用系统**：系统化调试
- **会收尾**：no half-done projects

**关键**：每个 CONFIRM 节点必须等待用户确认，不得自动继续。