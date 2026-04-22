# XiaoXiao

> AI Agent 开发框架：通过 7 个有序的 Skill 引导完成项目从概念到上线的完整流程。

## 核心理念

- **做少**：窄比宽好，YAGNI
- **做精**：完整做完，RED-GREEN-REFACTOR
- **有证据**：interest ≠ demand
- **用系统**：系统化调试
- **会收尾**：no half-done projects

## 开发流程

```
产品咨询 → 战略评审 → 架构师 → 界面设计 → 任务规划 → TDD开发 → 代码审查 → 发布上线
```

## 安装

```bash
# 克隆到全局 skills 目录
git clone https://github.com/C0428-ux/xiaoxiao.git ~/.claude/skills/xiaoxiao

# 运行安装脚本
cd ~/.claude/skills/xiaoxiao && bash setup
```

## 使用

```bash
# 对 Claude 说 /xiaoxiao 开始流程
# 或手动初始化
node ~/.claude/skills/xiaoxiao/xiaoxiao.js start
```

## Skills

| Skill | 说明 |
|-------|------|
| product-consult | 产品咨询 - 明确需求，输出 .SPEC.md |
| strategy-review | 战略评审 - 评估方向，判断是否值得做 |
| architect | 架构师 - 设计系统架构 |
| ui-design | 界面设计 - 设计界面和交互 |
| task-planning | 任务规划 - 拆解任务列表 |
| tdd-development | TDD开发 - 测试驱动开发 |
| ship | 发布上线 - 部署和上线 |

## 架构

```
~/.claude/skills/xiaoxiao/    ← 全局框架（一次安装）
~/.claude/CLAUDE.md           ← 全局配置
~/your-project/                ← 项目目录
├── .SPEC.md                  ← 项目规格
├── .xiaoxiao/state.json       ← 项目状态
└── docs/xiaoxiao/plans/      ← 阶段输出
```

## 目录结构

```
xiaoxiao/
├── SKILL.md          ← 执行入口 (/xiaoxiao)
├── setup             ← 安装脚本
├── CLAUDE.md         ← 配置内容
├── FRAMEWORK.md      ← 框架规格
├── README.md         ← 本文件
├── xiaoxiao.js       ← CLI 入口
├── state-manager.js   ← 状态管理
├── skill-loader.js   ← Skill 加载
├── handover.js       ← 交接协议
└── skills/          ← 7 个阶段
    ├── product-consult/
    ├── strategy-review/
    ├── architect/
    ├── ui-design/
    ├── task-planning/
    ├── tdd-development/
    └── ship/
```

## License

MIT