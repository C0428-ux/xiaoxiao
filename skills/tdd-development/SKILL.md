---
name: tdd-development
description: >-
  Implements features using test-driven development: RED (write failing test) →
  GREEN (minimal code pass) → REFACTOR (improve without breaking).
  Distributes independent tasks to parallel workers via Message Bus.
  Frontend tasks read UI design files for visual reference.
  Use after task-planning when implementing the planned tasks.
version: 2.0
domain: development
role: developer
triggers:
  - /tdd-development
  - TDD开发
  - 开始开发
  - 写代码
  - 开发
  - 修复
  - 修bug
  - bug
  - 修复bug
  - 迭代
  - 优化
  - 重构
prerequisites:
  - task-planning
output-format: code + tests + docs/xiaoxiao/plans/tdd/
related-skills:
  - task-planning
  - ship
---

# TDD Development | TDD 开发

## 强制执行协议

**规则**：
- 必须按顺序执行每个 Step，不得跳过
- 每个 Step 必须执行验证（检查点）才能进入下一步
- 使用 `xiaoxiao save-progress <skill> <step>` 标记步骤完成
- CONFIRM 节点必须等待用户确认，不得自动继续

---

## Step 1: 初始化

**动作**：
1. 执行 `xiaoxiao save-progress tdd-development step1-complete`
2. 检查 `docs/xiaoxiao/plans/task-planning-output.md` 是否存在
3. 检查 `docs/xiaoxiao/plans/ui-design/` 是否存在（前端任务需要）

**验证**：任务列表和 UI 设计都存在

**CONFIRM**："Step 1 完成。任务列表和 UI 设计都存在。继续？"

---

## Step 2: 读取需求

**动作**：
1. 读取 `docs/xiaoxiao/plans/task-planning-output.md` - 审查优先级任务列表
2. 读取 `./SPEC.md` - 获取需求
3. 读取 `docs/xiaoxiao/plans/architect-output.md` - 获取 API 契约

**验证**：需求和 API 契约已读取

**CONFIRM**："需求读取完成。继续？"

---

## Step 3: 读取 UI 设计（前端任务必须执行）

**动作**：
1. 读取 `docs/xiaoxiao/plans/ui-design/preview.html` - 主预览
2. 读取 `docs/xiaoxiao/plans/ui-design/pages/*.html` - 各页面
3. 提取组件结构
4. **重要**：前端实现遵循 UI 设计，不遵循任务描述

**验证**：UI 设计已读取

**CONFIRM**："UI 设计读取完成。发现 [N] 个页面。继续？"

---

## Step 4: 任务分析

**动作**：
1. 分析任务依赖（DAG）：
   - Backend 任务：API、数据库、认证
   - Frontend 任务：组件、页面（依赖 backend）
   - 识别并行组
2. 识别第一个并行组（无阻塞）
3. 向用户确认："发现 [N] 个后端任务，[N] 个前端任务。[N] 个可以并行。开始？"

**验证**：并行组已识别

**CONFIRM**："找到 [N] 个后端任务，[N] 个前端任务。[N] 个可以并行。继续？"

---

## Step 5: 任务分发（必须使用 Agent）

**⚠️ 关键：不能自己写代码，必须派遣 agents 执行**

**动作**：
1. 初始化 Message Bus：
   ```bash
   mkdir -p docs/xiaoxiao/plans/tdd/.message-bus/events
   ```
2. 读取 agent 定义文件：
   - 读取 `skills/tdd-development/agents/task-worker.md` 获取 worker prompt 模板
3. 从 `docs/xiaoxiao/plans/task-planning-output.md` 读取任务列表
4. 分析 DAG 依赖，确定第一个并行组（无依赖的任务）
5. **派遣 agents 执行每个任务**：
   ```javascript
   // 示例：用 Agent 工具派遣 task-worker
   const workers = await Promise.all(
     readyTasks.slice(0, 5).map(task => {
       const taskType = task.type === 'frontend' ? 'frontend' : 'backend';

       return Agent({
         subagent_type: 'general-purpose',
         description: `Task Worker: ${task.name}`,
         prompt: `你是 Task Worker Agent。执行以下任务：

任务 ID: ${task.id}
任务名称: ${task.name}
任务类型: ${taskType}
需要创建的文件: ${task.files.join(', ')}
验收标准: ${task.acceptance}
UI 设计路径: docs/xiaoxiao/plans/ui-design/
Message Bus: docs/xiaoxiao/plans/tdd/.message-bus/
Worker ID: worker-${task.id}-${Date.now()}

请严格按照 TDD RED-GREEN-REFACTOR 流程执行：
1. 先写失败的测试
2. 运行测试验证 RED
3. 写最小实现通过测试
4. 运行测试验证 GREEN
5. 重构优化代码
6. 通过 Message Bus 报告完成或失败`,
         run_in_background: true
       });
     })
   );
   ```
6. **Backend workers**：处理 API、数据库、认证等服务端任务
7. **Frontend workers**：处理 UI 组件、页面等前端任务（需读取 UI 设计文件）
8. 最多 5 个并发 workers
9. 通过 Message Bus 监控：
   - `docs/xiaoxiao/plans/tdd/.message-bus/worker-status.json` - worker 心跳
   - `docs/xiaoxiao/plans/tdd/.message-bus/events/TASK_COMPLETE_*.event` - 完成事件
   - `docs/xiaoxiao/plans/tdd/.message-bus/events/TASK_FAILED_*.event` - 失败事件

**验证**：Workers 已分发（你不能自己写代码，必须派遣 agents）

**CONFIRM**："Workers 已分发：[N] 个并行任务。等待完成..."

---

## Step 6: TDD 循环（每个任务执行）

对每个任务执行 RED-GREEN-REFACTOR：

### 6.1 RED - 写失败测试

**动作**：
1. 写一个最小的测试描述预期行为
2. 测试必须：
   - Arrange：设置测试数据
   - Act：调用函数/端点
   - Assert：验证预期结果
3. **关键：运行测试验证失败**
   ```bash
   npm test -- --testPathPattern="path/to/test.test.ts"
   ```
4. 验证失败是预期的（不是由于拼写错误/错误）

**验证**：测试失败（已验证）

**CONFIRM**："测试失败（已验证）。继续到 GREEN？"

---

### 6.2 GREEN - 最小实现

**动作**：
1. 写**最小代码**使测试通过
2. **YAGNI**：不要添加测试以外的特性
3. **关键：运行测试验证通过**
   ```bash
   npm test -- --testPathPattern="path/to/test.test.ts"
   ```
4. 验证：
   - 测试通过
   - 没有其他测试被破坏
   - 没有 TODO 注释
5. 询问用户："测试通过。继续到 REFACTOR？"

**验证**：测试通过（已验证）

**CONFIRM**："测试通过（已验证）。继续到 REFACTOR？"

---

### 6.3 REFACTOR - 改进代码

**动作**：
1. 改进代码结构不改变行为：
   - 提取重复逻辑
   - 重命名变量以提高清晰度
   - 改进函数组织
2. **保持测试绿色** - 每次重构后运行测试
3. 寻找：
   - 代码味道（长函数、魔法数字）
   - 提取机会
   - 清晰的命名
4. 询问用户："代码改进，测试仍然绿色。下一个测试用例？"

**验证**：代码改进，测试通过（已验证）

**CONFIRM**："代码改进，测试绿色（已验证）。继续到下一个用例？"

---

### 6.4 循环直到任务完成

**动作**：
1. 询问："这个任务有更多测试用例吗？"
2. 如果是，回到 6.1
3. 如果不是，任务完成
4. 报告完成到 Message Bus：
   - 写入 `TASK_COMPLETE_{taskId}.event`
   - 更新 `worker-status.json`

**验证**：任务完成

**CONFIRM**："任务 [N] 完成：[N] 个测试，全部通过。等待并行任务..."

---

## Step 7: 集成与完成

**动作**：
1. 运行完整测试套件
2. 验证没有回归
3. 需要时运行集成测试
4. 向用户确认后继续

**验证**：完整测试套件通过

**CONFIRM**："开发完成。[N] 个任务完成。运行完整测试套件？"

---

## Step 8: 输出文档

**动作**：
1. 创建输出目录：
```
docs/xiaoxiao/plans/tdd/
├── .message-bus/
│   ├── worker-status.json
│   ├── locks.json
│   └── events/
│       ├── TASK_COMPLETE_*.event
│       └── TASK_FAILED_*.event
├── completed-tasks.md
└── test-results.md
```
2. 执行 `xiaoxiao complete tdd-development docs/xiaoxiao/plans/tdd/`

**验证**：输出已创建

**CONFIRM**："TDD Development 完成。文档已保存。确认进入 Ship 阶段？"

---

## TDD 铁律

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

**规则**：
1. RED：写一个最小的失败测试
2. **必须运行测试验证失败**（不能跳过）
3. GREEN：写最小代码通过测试（YAGNI）
4. **必须运行测试验证通过**（不能跳过）
5. REFACTOR：仅在测试通过后清理代码

---

## 状态更新命令

每个 Step 完成后必须执行：
```bash
xiaoxiao save-progress tdd-development step[N]-complete
```

最终完成必须执行：
```bash
xiaoxiao complete tdd-development docs/xiaoxiao/plans/tdd/
```