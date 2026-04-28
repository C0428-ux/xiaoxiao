# XiaoXiao Framework | 框架规格

> **给 Claude 看**：这是框架的执行规格，不是说明文档。
> 所有内容必须是强制执行的指令。

---

## 核心原则（MUST FOLLOW）

1. **做少**：窄比宽好，YAGNI
2. **做精**：完整做完，RED-GREEN-REFACTOR
3. **有证据**：interest ≠ demand
4. **用系统**：系统化调试
5. **会收尾**：no half-done projects

---

## 架构

```
全局框架（~/.claude/skills/xiaoxiao/） + 项目本地（每个项目独立）
```

| 层级 | 位置 | 说明 |
|------|------|------|
| 全局框架 | `~/.claude/skills/xiaoxiao/` | 框架代码，一次安装 |
| 项目本地 | `./xiaoxiao-state.json` | 状态文件 |
| 项目本地 | `./.SPEC.md` | 产品规格 |
| 项目本地 | `./docs/xiaoxiao/plans/` | 阶段输出 |

---

## 流程（MUST EXECUTE IN ORDER）

```
product-consult → strategy-review → architect → ui-design → task-planning → tdd-development → ship
```

### Skill 依赖链（MUST RESPECT）

| Skill | 前置要求 |
|-------|---------|
| product-consult | 无 |
| strategy-review | product-consult 完成 |
| architect | strategy-review 完成 |
| ui-design | architect 完成 |
| task-planning | ui-design 完成 |
| tdd-development | task-planning 完成 |
| ship | tdd-development 完成 |

---

## Skill 状态（MUST TRACK）

| 状态 | 含义 | 操作 |
|------|------|------|
| `pending` | 待执行 | 等待激活 |
| `ready` | 可执行 | 前置已完成 |
| `active` | 执行中 | 正在执行 |
| `completed` | 已完成 | 输出已生成 |
| `blocked` | 被阻塞 | 前置未完成 |

---

## 状态管理命令

```bash
xiaoxiao init-project [name]    # 初始化项目
xiaoxiao status                  # 显示状态
xiaoxiao save-progress <skill> <phase>  # 保存进度
xiaoxiao complete <skill>        # 标记完成
xiaoxiao goto <skill>            # 跳转
xiaoxiao interrupt [note]        # 中断
xiaoxiao resume                  # 恢复
xiaoxiao continue                # 继续
```

---

## 更新系统（MUST CHECK）

每次执行框架时：
1. 执行 `node xiaoxiao.js update-check`
2. 根据输出处理：

| 输出 | 含义 | 操作 |
|------|------|------|
| `STATUS: UP_TO_DATE` | 无新版本 | 继续 |
| `STATUS: UPDATE_AVAILABLE` | 有新版本 | 询问用户 |
| `STATUS: SKIP_FOREVER` | 已跳过 | 继续 |

---

## 渐进式披露（PROGRESSION）

每个 Skill 分三层：

1. **Layer 1（SKILL.md）**：触发词 + 前置 + 核心步骤
2. **Layer 2（GUIDES/）**：详细流程 + 判断标准
3. **Layer 3（OUTPUTS/）**：模板 + 示例

---

## 交接协议（HANDOVER MUST FOLLOW）

Skill 完成后：
1. 更新当前 Skill 状态为 `completed`
2. 设置下一个 Skill 状态为 `ready`
3. 记录 `handover` 上下文
4. 激活下一个 Skill

---

## 文件结构

### 全局（安装一次）

```
~/.claude/skills/xiaoxiao/
├── xiaoxiao.js             # CLI 入口
├── update-checker.js       # 更新检查
├── state-manager.js        # 状态管理
├── skill-loader.js         # Skill 加载
├── handover.js            # 交接协议
├── constants.js           # 单一真实来源
├── SKILL.md               # 框架入口
├── FRAMEWORK.md           # 本文件
├── README.md              # 用户手册
└── skills/                # 7 个 Skill
    └── {skill}/
        ├── SKILL.md       # 执行脚本
        ├── PROTOCOL.json  # 机器可读协议
        ├── GUIDES/        # 参考文档
        └── OUTPUTS/       # 输出模板
```

### 项目本地

```
项目根/
├── xiaoxiao-state.json     # 状态
├── .SPEC.md                # 产品规格
└── docs/xiaoxiao/plans/    # 阶段输出
```

---

## 安装指令

```bash
mkdir -p ~/.claude/skills/xiaoxiao
git clone https://github.com/C0428-ux/xiaoxiao.git ~/.claude/skills/xiaoxiao
```
