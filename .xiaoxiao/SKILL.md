---
name: xiaoxiao
description: |
  XiaoXiao 是一个 AI Agent 开发框架，通过 7 个有序的 Skill 引导完成项目从概念到上线的完整流程。
  产品咨询 → 战略评审 → 架构师 → 界面设计 → 任务规划 → TDD开发 → 代码审查 → 发布上线。
  当用户说"安装 xiaoxiao"、"初始化 xiaoxiao" 时执行此安装流程。
when_to_use: 用户要求安装或初始化 xiaoxiao 开发框架
version: 0.6
---

# xiaoxiao 安装脚本

## 安装步骤

### 1. 克隆仓库到全局 skills 目录

```bash
git clone https://github.com/YOUR_USERNAME/xiaoxiao.git ~/.claude/skills/xiaoxiao
```

### 2. 追加 CLAUDE.md 配置

将以下内容追加到 `~/.claude/CLAUDE.md`：

```markdown
# XiaoXiao 开发框架

XiaoXiao 是一个 AI Agent 开发框架，通过 7 个有序的 Skill 引导完成项目从概念到上线的完整流程。

## 核心原则

- **做少**：窄比宽好，YAGNI
- **做精**：完整做完，RED-GREEN-REFACTOR
- **有证据**：interest ≠ demand
- **用系统**：系统化调试
- **会收尾**：no half-done projects

## 开发流程

```
产品咨询 → 战略评审 → 架构师 → 界面设计 → 任务规划 → TDD开发 → 代码审查 → 发布上线
```

## Skill 清单

| Skill | 触发词 | 说明 |
|-------|--------|------|
| product-consult | `/product-consult`, `产品咨询` | 明确需求，输出 .SPEC.md |
| strategy-review | `/strategy-review`, `战略评审` | 评估方向，输出战略建议 |
| architect | `/architect`, `架构设计` | 设计系统架构 |
| ui-design | `/ui-design`, `界面设计` | 设计界面和交互 |
| task-planning | `/task-planning`, `任务规划` | 拆解任务列表 |
| tdd-development | `/tdd-development`, `TDD开发` | 测试驱动开发 |
| ship | `/ship`, `发布上线` | 部署和上线 |

## Skill 路由规则

当用户表达以下意图时，自动加载对应 Skill：

- 用户说"我要做产品"、"做个功能"、"开始新项目" → `/product-consult`
- 用户说"评估一下"、"看看值不值得做"、"战略" → `/strategy-review`
- 用户说"设计架构"、"技术方案" → `/architect`
- 用户说"界面设计"、"UI"、"画原型" → `/ui-design`
- 用户说"任务规划"、"排期"、"拆解任务" → `/task-planning`
- 用户说"开始开发"、"写代码"、"TDD" → `/tdd-development`
- 用户说"发布"、"上线"、"部署" → `/ship`

## 状态管理

- 状态文件：`.xiaoxiao/state.json`
- 项目规格：`.SPEC.md`（product-consult 输出）
- 阶段输出：`docs/xiaoxiao/plans/`（各 Skill 输出）

## 使用方式

1. 用户表达意图 → Claude 识别 Skill
2. Claude 读取 skill 定义 → 执行
3. CONFIRM 节点 → 暂停，等用户确认
4. Skill 完成 → 自动交接下一个 Skill

## 框架文件位置

```
~/.claude/skills/xiaoxiao/
├── xiaoxiao.js       # CLI 入口
├── FRAMEWORK.md      # 框架规格
├── skills/           # 7 个 Skill 定义
└── ...
```

## 注意事项

- 所有 Skill 输出写入 `docs/xiaoxiao/plans/` 目录
- `.SPEC.md` 是**项目规格**（product-consult 输出）
- `.xiaoxiao/FRAMEWORK.md` 是**框架规格**
- 遵循渐进式披露：先读 SKILL.md 入口，不够再读 GUIDES/
```

### 3. 验证安装

```bash
node ~/.claude/skills/xiaoxiao/xiaoxiao.js help
```

预期输出：`🔧 XiaoXiao CLI` 帮助信息

### 4. 初始化第一个项目

```bash
# 进入项目目录
cd ~/your-project

# 初始化项目
node ~/.claude/skills/xiaoxiao/xiaoxiao.js start

# 开始产品咨询
/product-consult
```

---

## 架构说明

```
~/.claude/skills/xiaoxiao/    ← 全局框架（一次安装）
    ├── SKILL.md              ← 安装脚本
    ├── CLAUDE.md             ← 配置内容（需追加到 ~/.claude/CLAUDE.md）
    ├── FRAMEWORK.md          ← 框架规格
    ├── xiaoxiao.js           ← CLI 入口
    ├── state-manager.js       ← 状态管理
    ├── skill-loader.js        ← Skill 加载
    ├── handover.js            ← 交接协议
    └── skills/                ← 7 个 Skill
        ├── product-consult/
        ├── strategy-review/
        ├── architect/
        ├── ui-design/
        ├── task-planning/
        ├── tdd-development/
        └── ship/

~/your-project/                ← 项目目录
    ├── .SPEC.md              ← 项目规格（product-consult 输出）
    ├── .xiaoxiao/
    │   └── state.json        ← 项目状态
    └── docs/xiaoxiao/plans/  ← 阶段输出
```

---

## 确认安装完成

安装完成后，回答：

```
✅ xiaoxiao 安装完成！

可用命令：
  node ~/.claude/skills/xiaoxiao/xiaoxiao.js start      # 初始化项目
  node ~/.claude/skills/xiaoxiao/xiaoxiao.js status     # 查看状态
  node ~/.claude/skills/xiaoxiao/xiaoxiao.js skills     # 列出 Skills

开始使用：
  1. cd 到你的项目目录
  2. 运行 xiaoxiao start 初始化
  3. 说"/product-consult"开始产品咨询
```