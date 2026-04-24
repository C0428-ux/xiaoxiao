# XiaoXiao Framework

> AI Agent 开发框架：通过 7 个有序的 Skill 引导完成项目从概念到上线的完整流程。

## 快速开始

### 1. 让 Claude 下载并安装框架

在 Claude Code 中输入以下指令即可：

```
请下载并安装 xiaoxiao 框架：https://github.com/C0428-ux/xiaoxiao
安装到 ~/.claude/skills/xiaoxiao
```

Claude 会自动执行：
```bash
git clone https://github.com/C0428-ux/xiaoxiao.git ~/.claude/skills/xiaoxiao
cd ~/.claude/skills/xiaoxiao && bash setup
```

### 2. 开始项目

安装完成后，告诉 Claude：

```
我要做一个 [产品类型]，核心用户是 [用户群体]，主要解决 [核心问题]
```

例如：
```
我要做一个外卖配送平台，核心用户是商家和骑手，主要解决订单配送效率问题
```

Claude 会自动加载 `/product-consult` skill 开始产品咨询流程。

---

## 开发流程

```
产品咨询 → 战略评审 → 架构师 → 界面设计 → 任务规划 → TDD开发 → 发布上线
```

| Skill | 触发方式 | 说明 |
|-------|----------|------|
| product-consult | 说"我要做产品"、"新项目" | 明确需求，输出 .SPEC.md |
| strategy-review | 说"评估一下"、"值不值得做" | 判断方向，搜索市场数据 |
| architect | 说"设计架构"、"技术方案" | 系统设计，输出架构图 |
| ui-design | 说"界面设计"、"画原型" | 界面设计，输出线框图 |
| task-planning | 说"任务规划"、"排期" | 拆解任务，输出任务列表 |
| tdd-development | 说"开始开发"、"写代码"、"修bug"、"迭代" | 测试驱动开发 |
| ship | 说"发布"、"上线"、"部署" | 部署上线，输出部署报告 |

---

## 维护场景

除了完整流程，框架也支持中途介入：

| 用户说 | Claude 行为 |
|--------|------------|
| "修一个 bug" | 调用 tdd-development |
| "加一个功能" | 调用 task-planning |
| "优化性能" | 调用 architect |
| "重构代码" | 调用 tdd-development |
| "产品升级" | 调用 product-consult |

---

## 常用命令

```bash
# 查看当前状态
xiaoxiao status

# 检查更新
xiaoxiao update-check

# 下载最新版本
xiaoxiao update

# 保存进度（每个 Phase 完成后）
xiaoxiao save-progress <skill> <phase>

# 恢复中断
xiaoxiao resume

# 查看版本
xiaoxiao version

# 跳过更新检查（本次）
xiaoxiao skip-update

# 永久跳过更新检查
xiaoxiao skip-update --permanent
```

---

## 核心理念

- **做少**：窄比宽好，YAGNI
- **做精**：完整做完，RED-GREEN-REFACTOR
- **有证据**：interest ≠ demand
- **用系统**：系统化调试
- **会收尾**：no half-done projects

---

## 框架文件结构

```
~/.claude/skills/xiaoxiao/          ← 全局框架（安装一次）
├── SKILL.md                        ← 执行入口（说 /xiaoxiao）
├── CLAUDE.md                       ← Claude 配置
├── FRAMEWORK.md                    ← 框架规格
├── README.md                       ← 本文件
├── setup                           ← 安装脚本
├── xiaoxiao.js                     ← CLI 入口
├── update-checker.js               ← 更新检查
├── state-manager.js                ← 状态管理
├── skill-loader.js                 ← Skill 加载
├── handover.js                     ← 交接协议
└── .xiaoxiao/                      ← Skill 定义目录
    ├── README.md                   ← 框架内部说明
    └── skills/                     ← 7 个 Skill 定义
        ├── architect/
        ├── product-consult/
        ├── strategy-review/
        ├── ui-design/
        ├── task-planning/
        ├── tdd-development/
        └── ship/
```

---

## 状态管理

| 文件 | 作用 |
|------|------|
| `.xiaoxiao/state.json` | 项目状态（自动生成，不上传） |
| `.SPEC.md` | 产品规格（product-consult 输出） |
| `docs/xiaoxiao/plans/` | 各阶段输出文档 |

---

## 文件不上传

这些文件保存在本地，不上传 GitHub：
- `.xiaoxiao/state.json` - 每个项目独立的状态
- `.xiaoxiao/backups/` - 备份文件
- `node_modules/` - 依赖
- `.claude/settings.json` - 用户个性化设置

---

## License

MIT