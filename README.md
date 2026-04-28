# XiaoXiao Framework

> AI Agent 开发框架：通过 7 个有序的 Skill 引导完成项目从概念到上线的完整流程。

[English](README-en.md) | 简体中文

---

## 安装配置

### 第一步：让 Claude 下载框架

在 Claude Code 中直接说：

```
请帮我下载并安装 xiaoxiao 框架
仓库地址：https://github.com/C0428-ux/xiaoxiao
安装到 ~/.claude/skills/xiaoxiao
```

### 或手动安装

在终端（git bash / WSL / Mac/Linux）执行：

```bash
git clone https://github.com/C0428-ux/xiaoxiao.git ~/.claude/skills/xiaoxiao
```

### 安装目录结构

```
~/.claude/skills/xiaoxiao/
├── xiaoxiao.js              # CLI 入口
├── update-checker.js        # 更新检查
├── state-manager.js         # 状态管理
├── skill-loader.js          # Skill 加载
├── handover.js             # 交接协议
├── constants.js            # 共享常量
├── SKILL.md                # 框架入口（给 Claude 看）
├── FRAMEWORK.md            # 框架规格
├── README.md               # 本文件
└── skills/                 # 7 个 Skill 定义
    ├── product-consult/
    ├── strategy-review/
    ├── architect/
    ├── ui-design/
    ├── task-planning/
    ├── tdd-development/
    └── ship/
```

---

## 快速开始

安装完成后，告诉 Claude：

```
我要做一个外卖配送平台
```

Claude 会自动加载产品咨询流程，引导你完成整个开发。

---

## 开发流程

```
产品咨询 → 战略评审 → 架构师 → 界面设计 → 任务规划 → TDD开发 → 发布上线
```

### 7 个 Skill

| Skill | 触发方式 | 做什么 |
|-------|----------|--------|
| product-consult | "我要做产品"、"新项目" | 定义产品类型、功能、用户流程 |
| strategy-review | "评估一下"、"值不值得做" | 市场分析、竞争分析、可行性评估 |
| architect | "设计架构"、"技术方案" | 系统设计、子系统划分、技术选型 |
| ui-design | "界面设计"、"画原型" | 界面布局、交互设计、组件定义 |
| task-planning | "任务规划"、"排期" | 任务拆解、工时估算、优先级排序 |
| tdd-development | "开始开发"、"写代码"、"修bug"、"迭代" | 测试驱动开发 |
| ship | "发布"、"上线" | 部署、验证、上线后监控 |

---

## 维护场景

| 你说 | Claude 做的 |
|------|------------|
| "修一个 bug" | 调用 TDD 开发流程 |
| "加一个功能" | 调用任务规划流程 |
| "优化性能" | 调用架构设计流程 |
| "产品升级" | 调用产品咨询流程 |

---

## 常用命令

在项目目录（不是框架目录）执行：

```bash
# 初始化项目
xiaoxiao init-project [项目名]

# 查看状态
xiaoxiao status

# 检查框架更新
xiaoxiao update-check

# 更新框架
xiaoxiao update

# 跳过更新检查（永久）
xiaoxiao skip-update

# 查看版本
xiaoxiao version

# 保存进度
xiaoxiao save-progress <skill> <phase>

# 继续开发
xiaoxiao continue

# 恢复中断
xiaoxiao resume

# 标记完成
xiaoxiao complete <skill> [输出文件路径]
```

---

## 核心原则

- **做少**：窄比宽好，YAGNI
- **做精**：完整做完，RED-GREEN-REFACTOR
- **有证据**：interest ≠ demand
- **用系统**：系统化调试
- **会收尾**：no half-done projects

---

## 状态管理

每个项目独立的状态文件 `xiaoxiao-state.json`：

- 追踪所有 Skill 的完成状态
- 支持中断和恢复
- 支持多轮迭代

---

## 迭代管理

每次开发周期是一个**迭代（Iteration）**：

- 迭代命名：`v1`, `v2`, `v3` ...
- 新迭代自动重置所有 Skill 状态
- 产出物路径固定，不覆盖旧版本

---

## 更新框架

XiaoXiao 会自动检查更新，也支持手动更新：

```bash
xiaoxiao update-check   # 检查更新
xiaoxiao update         # 下载最新版本
xiaoxiao skip-update    # 永久跳过更新检查
xiaoxiao unskip-update  # 恢复更新检查
```

---

## License

MIT
