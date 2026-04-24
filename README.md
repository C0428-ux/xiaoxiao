# XiaoXiao Framework

> AI Agent 开发框架：通过 7 个有序的 Skill 引导完成项目从概念到上线的完整流程。

## 快速开始

### 让 Claude 下载框架

在 Claude Code 中直接说：

```
请帮我下载并安装 xiaoxiao 框架
仓库地址：https://github.com/C0428-ux/xiaoxiao
安装到 ~/.claude/skills/xiaoxiao
```

### 开始开发

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

```bash
xiaoxiao status        # 查看当前状态
xiaoxiao update-check  # 检查框架更新
xiaoxiao update        # 下载最新版本
xiaoxiao version       # 查看版本
xiaoxiao save-progress # 保存当前进度
xiaoxiao resume        # 恢复中断的任务
```

---

## 核心理念

- **做少**：窄比宽好，YAGNI
- **做精**：完整做完，RED-GREEN-REFACTOR
- **有证据**：interest ≠ demand
- **用系统**：系统化调试
- **会收尾**：no half-done projects

---

## License

MIT