# Subagent Patterns | Subagent 使用模式

本指南说明如何在 TDD 开发中使用 subagents 并行分发任务。

---

## 何时使用 Subagent

### 适合并行的任务

| 任务类型 | 特征 | 示例 |
|---------|------|------|
| **独立后端任务** | 无共享状态，不同文件 | 创建 User API、Project API |
| **独立前端任务** | 无共享状态，不同组件 | Button 组件、Card 组件 |
| **测试任务** | 独立模块的测试 | Service unit tests |

### 不适合并行的任务

| 任务类型 | 原因 |
|---------|------|
| **有依赖的任务** | 必须等待前置任务完成 |
| **修改同一文件** | 需要文件锁，可能冲突 |
| **集成测试** | 需要所有模块完成后才能运行 |

---

## Subagent 类型

### 1. Parallel Dispatcher

**职责**: 读取任务依赖图，分发并行任务给 workers

**输入**:
- task-planning 输出
- ui-design 目录路径

**输出**:
- 初始化 Message Bus
- 分发多个 task-worker
- 返回执行结果

### 2. Task Worker

**职责**: 执行单个任务，遵循 TDD

**输入**:
```javascript
{
  taskId: string,
  taskName: string,
  taskType: 'backend' | 'frontend',
  files: string[],
  acceptance: string,
  uiDesignPath: string,  // 前端任务需要
  busPath: string,
  workerId: string
}
```

**输出**:
- 完成的代码文件
- 测试结果
- Message Bus 事件

---

## Message Bus 协调

### 文件结构

```
docs/xiaoxiao/plans/tdd/.message-bus/
├── worker-status.json    # 所有 worker 状态
├── locks.json            # 文件锁
└── events/
    ├── TASK_COMPLETE_{taskId}.event
    └── TASK_FAILED_{taskId}.event
```

### worker-status.json 格式

```javascript
{
  "worker-task-1-timestamp": {
    "worker_id": "worker-task-1-timestamp",
    "task_id": "task-1",
    "task_name": "Create UserService",
    "task_type": "backend",
    "started_at": "2026-04-25T10:00:00Z",
    "last_heartbeat": "2026-04-25T10:05:00Z",
    "status": "RUNNING"
  },
  "worker-task-2-timestamp": {
    "worker_id": "worker-task-2-timestamp",
    "task_id": "task-2",
    "status": "COMPLETED"
  }
}
```

### events/ 事件格式

**TASK_COMPLETE_{taskId}.event**:
```
task-1-1234567890
```
（内容为 commit SHA 或 taskId）

**TASK_FAILED_{taskId}.event**:
```
Error: Cannot find module '../auth'
```

### locks.json 格式

```javascript
{
  "src/services/UserService.ts": "worker-task-1-timestamp",
  "src/components/Button.tsx": "worker-task-2-timestamp"
}
```

---

## DAG 任务依赖分析

### 依赖图示例

```
Task A (无依赖) ──┬──> Task C (依赖 A) ───> Task E (依赖 C)
                  └──> Task D (依赖 A)
Task B (无依赖) ──────────────────────────────> Task F (依赖 B)
```

### 并行组

```javascript
// 第一组（可并行）
['Task A', 'Task B']

// 第二组（依赖 A, B 完成）
['Task C', 'Task D', 'Task F']

// 第三组（依赖 C 完成）
['Task E']
```

### 前端任务依赖后端任务

```javascript
// 前端任务通常依赖后端 API 完成
const dependencyMap = {
  'LoginPage': ['LoginAPI', 'AuthService'],
  'UserList': ['UserAPI', 'UserService'],
  'ProjectCard': ['ProjectAPI', 'ProjectService']
};
```

---

## Worker 协调流程

### 1. Dispatcher 初始化

```javascript
// 初始化 Message Bus
mkdir -p `${busPath}/events`;
Write(`${busPath}/worker-status.json`, '{}');
Write(`${busPath}/locks.json`, '{}');
```

### 2. Dispatcher 分发任务

```javascript
// 并行分发第一组任务
const workers = await Promise.all(
  parallelGroup.map(task => Agent({
    subagent_type: 'task-worker',
    prompt: taskPrompt,
    run_in_background: true
  }))
);
```

### 3. Worker 注册

```javascript
// 每个 worker 启动时注册
status[workerId] = {
  worker_id: workerId,
  task_id: taskId,
  status: 'RUNNING',
  started_at: new Date().toISOString(),
  last_heartbeat: new Date().toISOString()
};
Write(`${busPath}/worker-status.json`, JSON.stringify(status));
```

### 4. Worker 执行 TDD

```javascript
// RED - 写失败测试
Write(testFile, testCode);
Bash('npm test -- --test ' + testFile);
// 验证失败

// GREEN - 写最小实现
Write(implFile, implCode);
Bash('npm test -- --test ' + testFile);
// 验证通过

// REFACTOR - 清理
```

### 5. Worker 完成任务

```javascript
// 发送完成事件
Write(`${busPath}/events/TASK_COMPLETE_${taskId}.event`, taskId);

// 更新状态
status[workerId].status = 'COMPLETED';
status[workerId].last_heartbeat = new Date().toISOString();
Write(`${busPath}/worker-status.json`, JSON.stringify(status));
```

### 6. Dispatcher 轮询完成

```javascript
// 轮询检查完成事件
while (completed < expected) {
  const events = await Glob(`${busPath}/events/*.event`);
  // 处理完成/失败事件
  // 检查是否有任务现在可以执行
  await sleep(5000);
}
```

---

## 文件锁机制

### 获取锁

```javascript
async function acquireLock(filePath) {
  const locks = JSON.parse(await Read(`${busPath}/locks.json`));

  if (locks[filePath]) {
    return false; // 锁被占用
  }

  locks[filePath] = workerId;
  await Write(`${busPath}/locks.json`, JSON.stringify(locks));
  return true;
}
```

### 释放锁

```javascript
async function releaseLock(filePath) {
  const locks = JSON.parse(await Read(`${busPath}/locks.json`));
  delete locks[filePath];
  await Write(`${busPath}/locks.json`, JSON.stringify(locks));
}
```

### 使用锁

```javascript
// 修改共享文件前
while (!(await acquireLock(filePath))) {
  await sleep(1000); // 等待锁释放
}

try {
  await Edit(filePath, oldString, newString);
} finally {
  await releaseLock(filePath);
}
```

---

## 并行限制

| 限制 | 值 | 原因 |
|------|-----|------|
| 最大并发 workers | 5 | 避免资源竞争 |
| Worker 超时 | 30 分钟 | 防止僵尸进程 |
| 心跳间隔 | 5 分钟 | 监控 worker 存活 |
| 轮询间隔 | 5 秒 | 及时发现完成事件 |

---

## 错误处理

### Worker 失败

```javascript
// 隔离失败任务
const failedTaskId = parseFailedEvent(event);

// 标记依赖任务为 BLOCKED
dag.nodes.forEach(node => {
  if (node.dependsOn.includes(failedTaskId)) {
    node.status = 'BLOCKED';
    node.blockedReason = failedTaskId;
  }
});

// 继续执行无依赖任务
```

### 超时处理

```javascript
// 检查 worker 是否超时
const now = Date.now();
const heartbeatAge = now - new Date(status.last_heartbeat).getTime();

if (heartbeatAge > 30 * 60 * 1000) { // 30 分钟
  // 标记为 FAILED
  // 继续其他任务
}
```

---

## 结果汇总

### Dispatcher 最终输出

```javascript
{
  verdict: 'PASS|FAIL',
  summary: 'Completed 8/10 tasks, 2 failed',
  completed_tasks: [
    { taskId: 'task-1', files: ['src/a.ts'] },
    { taskId: 'task-2', files: ['src/b.ts'] }
  ],
  failed_tasks: [
    { taskId: 'task-3', error: 'Module not found' }
  ],
  total_workers_spawned: 5,
  duration_minutes: 45
}
```

---

## 快速查询

| 场景 | 模式 |
|------|------|
| 并行分发后端任务 | parallel-dispatcher + backend task-worker |
| 前端任务并行 | parallel-dispatcher + frontend task-worker |
| 任务有依赖 | 等待依赖完成后再分发 |
| 修改同一文件 | 文件锁机制 |
| Worker 超时 | 心跳监控 + 超时处理 |
| 任务失败 | 隔离 + 继续无依赖任务 |
