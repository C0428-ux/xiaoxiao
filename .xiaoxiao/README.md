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
产品咨询 → 战略评审 → 架构师 → 界面设计 → 任务规划 → TDD开发 → 发布上线
```

## Skills

| Skill | 触发词 | 说明 |
|-------|--------|------|
| product-consult | `/product-consult`, `产品咨询` | 明确需求，输出 .SPEC.md |
| strategy-review | `/strategy-review`, `战略评审` | 评估方向，判断是否值得做 |
| architect | `/architect`, `架构设计` | 设计系统架构 |
| ui-design | `/ui-design`, `界面设计` | 设计界面和交互 |
| task-planning | `/task-planning`, `任务规划` | 拆解任务列表 |
| tdd-development | `/tdd-development`, `TDD开发` | 测试驱动开发 |
| ship | `/ship`, `发布上线` | 部署和上线 |

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

## 常用命令

```bash
xiaoxiao status        # 查看状态
xiaoxiao update-check  # 检查更新
xiaoxiao update        # 下载更新
xiaoxiao version       # 显示版本
xiaoxiao resume        # 恢复中断
```

## 目录结构

```
xiaoxiao/
├── SKILL.md              ← 执行入口 (/xiaoxiao)
├── FRAMEWORK.md          ← 框架规格
├── README.md             ← 本文件
├── setup                 ← 安装脚本
├── xiaoxiao.js           ← CLI 入口
├── update-checker.js     ← 更新检查
├── state-manager.js      ← 状态管理
├── skill-loader.js       ← Skill 加载
├── handover.js           ← 交接协议
├── .xiaoxiao/
│   └── version.json      ← 版本信息
└── skills/              ← 7 个阶段
    └── {skill}/
        ├── SKILL.md      ← 入口（渐进式三层）
        ├── GUIDES/       ← 细节文档
        └── OUTPUTS/     ← 输出模板
```

## 渐进式披露

每个 Skill 分三层：

1. **Layer 1（入口）**：触发词 + 前置 + 核心步骤，< 20 行
2. **Layer 2（上下文）**：完整流程 + 判断标准 + 失败处理
3. **Layer 3（细节）**：GUIDES/ 目录下的详细文档

## License

MIT
