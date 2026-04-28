# XiaoXiao 框架维护手册

> **本文件给框架开发者（我们）看**，用于维护框架。
> 用户（客户）看的操作手册是 `README.md`。

## 框架定位

- **框架目的**：把 Claude 变成有纪律有流程的完整开发 Agent
- **用户群体**：需要系统性开发项目的团队/个人
- **核心价值**：7 阶段强制流程，确保每个项目从概念到上线

## 目录结构

```
xiaoxiao/
├── xiaoxiao.js              # CLI 入口，命令路由
├── update-checker.js        # 更新检查 + 下载
├── state-manager.js         # 状态读写
├── skill-loader.js          # Skill 加载
├── handover.js             # 交接协议
├── constants.js            # 单一真实来源（SKILLS, PREREQ_MAP, OUTPUT_MAP）
├── release.sh              # 发布脚本
├── SKILL.md                # 框架入口执行协议（给 Claude 看）
├── FRAMEWORK.md            # 框架规格说明
├── README.md               # 用户操作手册
├── CLAUDE.md               # 本文件，框架维护指南
└── skills/                 # 7 个 Skill 定义
    └── {skill}/
        ├── SKILL.md        # 执行脚本（给 Claude 看）
        ├── PROTOCOL.json   # 机器可读协议
        ├── GUIDES/         # 参考文档
        └── OUTPUTS/        # 输出模板
```

## 单一真实来源原则

所有共享常量必须定义在 `constants.js`：

| 常量 | 用途 |
|-----|------|
| `SKILLS` | 7 个 Skill 名称列表 |
| `PREREQ_MAP` | Skill 依赖关系 |
| `OUTPUT_MAP` | Skill 输出路径 |
| `GITHUB_REPO` | GitHub 仓库名 |

**禁止在其他 JS 文件中硬编码这些值**。

## 文件职责

| 文件 | 职责 |
|-----|------|
| `xiaoxiao.js` | CLI 路由，**只做路由**，不包含业务逻辑 |
| `state-manager.js` | 状态读写，增删改查 |
| `skill-loader.js` | 加载 Skill 内容 |
| `handover.js` | Skill 交接逻辑 |
| `update-checker.js` | 版本检查 + Release 下载 |

## 更新机制

### Releases 发版流程

1. 开发者提交代码到 main
2. 创建 tag：`git tag v0.x.x`
3. 推送到远程：`git push origin v0.x.x`
4. GitHub Actions 自动创建 Release
5. Claude 执行 `update-check` 时检测新版本
6. 用户同意后下载新的 Release .zip 覆盖

### 无 Git 环境支持

当框架通过 .zip 下载（而非 git clone）时：
- 无 `.git` 目录
- 版本信息从 `version.json` 读取
- 更新通过下载新 Release .zip 实现

## 修复清单

### 高优先级
- [x] 消除代码重复，constants.js 作为单一来源
- [x] xiaoxiao.js 只做 CLI 路由
- [x] update-checker.js 支持无 Git 环境

### 中优先级
- [x] findProjectRoot 在 home 目录的边界情况
- [ ] search.js 错误处理改进

### 低优先级
- [ ] skill-loader.js __dirname 潜在问题评估

## Skill 定义规范

每个 Skill 目录必须包含：

```
{skill}/
├── SKILL.md        # 必须：执行脚本（给 Claude 看）
├── PROTOCOL.json   # 必须：机器可读协议
├── GUIDES/         # 可选：参考文档
└── OUTPUTS/        # 可选：输出模板
```

### SKILL.md 格式要求

```markdown
# {Skill Name}

## 强制执行协议

**规则**：
- MUST 规则 1
- MUST 规则 2
- CONFIRM 节点必须等待用户确认

---

## Step 1: {阶段名称}

**动作**：
1. 执行 xxx
2. 读取 xxx

**验证**：必须看到 xxx 才能继续

**CONFIRM**：提示用户确认
```

### PROTOCOL.json 格式

```json
{
  "name": "{skill}",
  "version": "0.1",
  "phases": [
    { "id": "phase1", "name": "名称", "requiresConfirm": true }
  ]
}
```

## 提交规范

- 每次 commit 必须有明确消息
- 重构提交：`refactor: xxx`
- 功能提交：`feat: xxx`
- 修复提交：`fix: xxx`
- 文档提交：`docs: xxx`

## 测试验证

修改后必须验证：

```bash
node --check xiaoxiao.js
node --check state-manager.js
node --check skill-loader.js
node --check handover.js
node --check update-checker.js
```

## Release 检查清单

- [ ] 所有 JS 文件语法正确
- [ ] constants.js 是唯一常量来源
- [ ] 无代码重复
- [ ] GitHub Actions 工作流存在
- [ ] release.sh 可执行
