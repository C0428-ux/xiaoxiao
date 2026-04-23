# XiaoXiao Framework | 框架规格

## 概述

XiaoXiao 是一个 AI Agent 开发框架，通过 7 个有序的 Skill 引导完成项目从概念到上线的完整流程。

## 核心原则

- **做少**：窄比宽好，YAGNI
- **做精**：完整做完，RED-GREEN-REFACTOR
- **有证据**：interest ≠ demand
- **用系统**：系统化调试
- **会收尾**：no half-done projects

## 架构：全局框架 + 项目本地状态

```
~/.claude/skills/xiaoxiao/          ← 全局（框架代码，一次安装）
~/projects/myapp/                    ← 具体项目（每个项目独立）
├── .SPEC.md                        ← 项目规格
├── .xiaoxiao/
│   └── state.json                  ← 项目状态
└── docs/xiaoxiao/plans/           ← 阶段输出
```

| 层级 | 位置 | 说明 |
|------|------|------|
| 全局框架 | `~/.claude/skills/xiaoxiao/` | 框架代码，一次安装，永久可用 |
| 项目本地 | `./.xiaoxiao/` | state.json，每个项目独立 |
| 项目本地 | `./SPEC.md` | product-consult 输出，每个项目独立 |
| 项目本地 | `./docs/xiaoxiao/plans/` | 阶段输出，每个项目独立 |

## 流程

```
产品咨询 → 战略评审 → 架构师 → 界面设计 → 任务规划 → TDD开发 → 发布上线
```

## Skill 清单

| Skill | 说明 | 前置 |
|-------|------|------|
| product-consult | 产品咨询 | 无 |
| strategy-review | 战略评审 | product-consult |
| architect | 架构师 | strategy-review |
| ui-design | 界面设计 | architect |
| task-planning | 任务规划 | ui-design |
| tdd-development | TDD开发 | task-planning |
| ship | 发布上线 | tdd-development |

## Skill 质量标准

每个 Skill 遵循 Premium 模式：

| 维度 | 要求 |
|------|------|
| Frontmatter | name, version, domain, triggers, output-format, related-skills |
| 流程 | 编号阶段 + 明确的准入/准出标准 |
| 约束 | MUST DO / MUST NOT DO |
| 引用 | Reference Guide lookup 表格 |
| 输出 | 具体模板 + 完整示例 |

## 文件结构

### 全局（安装一次）

```
~/.claude/skills/xiaoxiao/
├── xiaoxiao.js             # CLI 入口
├── update-checker.js       # 更新检查模块
├── state-manager.js        # 状态管理模块
├── skill-loader.js         # Skill 加载模块
├── handover.js            # 交接协议模块
├── FRAMEWORK.md           # 本文件
├── README.md              # 总览
├── SKILL.md               # 入口技能
├── .xiaoxiao/
│   └── version.json       # 版本信息
└── skills/                # 7 个 Skill 定义
    └── {skill}/
        ├── SKILL.md       # 入口（渐进式三层）
        ├── GUIDES/        # 细节文档（4-5个）
        └── OUTPUTS/       # 输出模板（1-2个）
```

### 项目本地（每个项目）

```
项目根/
├── .SPEC.md               # 项目规格
├── .xiaoxiao/
│   └── state.json         # 项目状态
└── docs/xiaoxiao/plans/  # 阶段输出
```

## 状态管理

### 技能状态

- `pending` - 待执行
- `ready` - 可执行
- `active` - 执行中
- `completed` - 已完成
- `blocked` - 被阻塞

### 阶段状态

- `idle` - 空闲
- `active` - 执行中
- `waiting-user` - 等待用户确认
- `completed` - 全部完成

### 中断恢复

任意时刻可中断，状态保存到 `interrupt` 字段，恢复时从断点继续。

## 更新系统

每次执行 `/xiaoxiao` 时自动检查更新：

```bash
node xiaoxiao.js update-check   # 检查更新
node xiaoxiao.js update         # 下载更新
```

版本信息保存在 `.xiaoxiao/version.json`，通过 GitHub API 获取远程最新 commit SHA 进行对比。

## 渐进式披露

每个 Skill 分三层：

1. **Layer 1（入口）**：触发词 + 前置 + 核心步骤，< 20 行
2. **Layer 2（上下文）**：完整流程 + 判断标准 + 失败处理
3. **Layer 3（细节）**：GUIDES/ 目录下的详细文档

## 交接协议

Skill 完成后：
1. 更新当前 Skill 状态为 `completed`
2. 设置下一个 Skill 状态为 `ready`
3. 记录 `handover` 上下文
4. 激活下一个 Skill

## 安装

```bash
# 全局安装（只需一次）
mkdir -p ~/.claude/skills/xiaoxiao
cp -r skills/ ~/.claude/skills/xiaoxiao/
cp *.js ~/.claude/skills/xiaoxiao/
cp FRAMEWORK.md ~/.claude/skills/xiaoxiao/
```