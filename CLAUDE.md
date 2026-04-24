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
产品咨询 → 战略评审 → 架构师 → 界面设计 → 任务规划 → TDD开发 → 发布上线
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
- 用户说"开始开发"、"写代码"、"TDD"、"修bug"、"迭代" → `/tdd-development`
- 用户说"发布"、"上线"、"部署" → `/ship`

**维护场景**：
- 用户说"修bug"、"修复"、"优化" → `/tdd-development`
- 用户说"加功能"、"添加"、"迭代" → `/task-planning`
- 用户说"重构"、"调整架构" → `/architect`

## 状态管理

- 状态文件：`.xiaoxiao/state.json`
- 项目规格：`.SPEC.md`（product-consult 输出，位于项目根目录）
- 阶段输出：`docs/xiaoxiao/plans/`（其他 Skill 输出）

## 框架文件位置

```
.xiaoxiao/
├── FRAMEWORK.md      # 框架规格（框架自身）
├── state.json        # 状态管理器
├── state-manager.js  # 状态读写
├── skill-loader.js   # Skill 加载
├── handover.js       # 交接协议
└── skills/           # 7 个 Skill 定义
    └── {skill}/
        ├── SKILL.md  # Skill 入口（渐进式）
        ├── GUIDES/   # 细节文档
        └── OUTPUTS/  # 输出模板
```

## 使用方式

1. 用户表达意图 → Claude 识别 Skill
2. Claude 读取 `SKILL.md` → 执行
3. CONFIRM 节点 → 暂停，等用户确认
4. Skill 完成 → 自动交接下一个 Skill

## 注意事项

- `docs/xiaoxiao/plans/` 是 Skill 阶段输出目录
- `.SPEC.md` 是**项目规格**（product-consult 专用输出），`.xiaoxiao/FRAMEWORK.md` 是**框架规格**，不要混淆
- 遵循渐进式披露：先读 SKILL.md 入口，不够再读 GUIDES/