# Subagent Patterns | Subagent Usage Patterns

This guide explains how to use subagents in TDD development for parallel task distribution.

---

## When to Use Subagents

### Tasks Suitable for Parallel Execution

| Task Type | Characteristics | Example |
|-----------|---------------|---------|
| **Independent backend tasks** | No shared state, different files | Create User API, Project API |
| **Independent frontend tasks** | No shared state, different components | Button component, Card component |
| **Testing tasks** | Tests for independent modules | Service unit tests |

### Tasks Not Suitable for Parallel Execution

| Task Type | Reason |
|-----------|--------|
| **Tasks with dependencies** | Must wait for prerequisites to complete |
| **Modifying the same file** | Requires file locking, potential conflicts |
| **Integration tests** | Requires all modules to complete before running |

---

## Subagent Types

### 1. Parallel Dispatcher

**Responsibility**: Read task dependency graph, distribute parallel tasks to workers

**Input**:
- task-planning output
- ui-design directory path

**Output**:
- Initialize Message Bus
- Distribute multiple task-workers
- Return execution results

### 2. Task Worker

**Responsibility**: Execute a single task, following TDD

**Input**:
```javascript
{
  taskId: string,
  taskName: string,
  taskType: 'backend' | 'frontend',
  files: string[],
  acceptance: string,
  uiDesignPath: string,  // Required for frontend tasks
  busPath: string,
  workerId: string
}
```

**Output**:
- Completed code files
- Test results
- Message Bus events

---

## Message Bus Coordination

### File Structure

```
docs/xiaoxiao/plans/tdd/.message-bus/
├── worker-status.json    # All worker statuses
├── locks.json            # File locks
└── events/
    ├── TASK_COMPLETE_{taskId}.event
    └── TASK_FAILED_{taskId}.event
```

### worker-status.json Format

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

### events/ Event Format

**TASK_COMPLETE_{taskId}.event**:
```
task-1-1234567890
```
(Content is commit SHA or taskId)

**TASK_FAILED_{taskId}.event**:
```
Error: Cannot find module '../auth'
```

### locks.json Format

```javascript
{
  "src/services/UserService.ts": "worker-task-1-timestamp",
  "src/components/Button.tsx": "worker-task-2-timestamp"
}
```

---

## DAG Task Dependency Analysis

### Dependency Graph Example

```
Task A (no dependencies) ──┬──> Task C (depends on A) ───> Task E (depends on C)
                            └──> Task D (depends on A)
Task B (no dependencies) ──────────────────────────────> Task F (depends on B)
```

### Parallel Groups

```javascript
// First group (can run in parallel)
['Task A', 'Task B']

// Second group (depends on A, B completing)
['Task C', 'Task D', 'Task F']

// Third group (depends on C completing)
['Task E']
```

### Frontend Tasks Depending on Backend Tasks

```javascript
// Frontend tasks usually depend on backend API completion
const dependencyMap = {
  'LoginPage': ['LoginAPI', 'AuthService'],
  'UserList': ['UserAPI', 'UserService'],
  'ProjectCard': ['ProjectAPI', 'ProjectService']
};
```

---

## Worker Coordination Flow

### 1. Dispatcher Initialization

```javascript
// Initialize Message Bus
mkdir -p `${busPath}/events`;
Write(`${busPath}/worker-status.json`, '{}');
Write(`${busPath}/locks.json`, '{}');
```

### 2. Dispatcher Distributes Tasks

```javascript
// Distribute first group of tasks in parallel
const taskWorkerPrompt = await Read('skills/tdd-development/agents/task-worker.md');

const workers = await Promise.all(
  parallelGroup.map(task => Agent({
    description: `Task Worker: ${task.name}`,
    prompt: `${taskWorkerPrompt}

## Task Assignment

Task ID: ${task.id}
Task Name: ${task.name}
Task Type: ${task.type}
Files to create: ${task.files.join(', ')}
Acceptance Criteria: ${task.acceptance}
UI Design Path: docs/xiaoxiao/plans/ui-design/
Message Bus: docs/xiaoxiao/plans/tdd/.message-bus/
Worker ID: worker-${task.id}-${Date.now()}`,
    agent_type: 'general-purpose',
    run_in_background: true
  }))
);
```

### 3. Worker Registration

```javascript
// Each worker registers on startup
status[workerId] = {
  worker_id: workerId,
  task_id: taskId,
  status: 'RUNNING',
  started_at: new Date().toISOString(),
  last_heartbeat: new Date().toISOString()
};
Write(`${busPath}/worker-status.json`, JSON.stringify(status));
```

### 4. Worker Executes TDD

```javascript
// RED - write failing test
Write(testFile, testCode);
Bash('npm test -- --test ' + testFile);
// Verify failure

// GREEN - write minimal implementation
Write(implFile, implCode);
Bash('npm test -- --test ' + testFile);
// Verify pass

// REFACTOR - cleanup
```

### 5. Worker Completes Task

```javascript
// Send completion event
Write(`${busPath}/events/TASK_COMPLETE_${taskId}.event`, taskId);

// Update status
status[workerId].status = 'COMPLETED';
status[workerId].last_heartbeat = new Date().toISOString();
Write(`${busPath}/worker-status.json`, JSON.stringify(status));
```

### 6. Dispatcher Polls for Completion

```javascript
// Poll for completion events
while (completed < expected) {
  const events = await Glob(`${busPath}/events/*.event`);
  // Process completion/failure events
  // Check if any tasks are now ready to execute
  await sleep(5000);
}
```

---

## File Lock Mechanism

### Acquiring Lock

```javascript
async function acquireLock(filePath) {
  const locks = JSON.parse(await Read(`${busPath}/locks.json`));

  if (locks[filePath]) {
    return false; // Lock is held
  }

  locks[filePath] = workerId;
  await Write(`${busPath}/locks.json`, JSON.stringify(locks));
  return true;
}
```

### Releasing Lock

```javascript
async function releaseLock(filePath) {
  const locks = JSON.parse(await Read(`${busPath}/locks.json`));
  delete locks[filePath];
  await Write(`${busPath}/locks.json`, JSON.stringify(locks));
}
```

### Using Lock

```javascript
// Before modifying shared files
while (!(await acquireLock(filePath))) {
  await sleep(1000); // Wait for lock release
}

try {
  await Edit(filePath, oldString, newString);
} finally {
  await releaseLock(filePath);
}
```

---

## Parallel Limits

| Limit | Value | Reason |
|-------|-------|--------|
| Max concurrent workers | 5 | Avoid resource contention |
| Worker timeout | 30 minutes | Prevent zombie processes |
| Heartbeat interval | 5 minutes | Monitor worker存活 |
| Polling interval | 5 seconds | Detect completion events promptly |

---

## Error Handling

### Worker Failure

```javascript
// Isolate failed task
const failedTaskId = parseFailedEvent(event);

// Mark dependent tasks as BLOCKED
dag.nodes.forEach(node => {
  if (node.dependsOn.includes(failedTaskId)) {
    node.status = 'BLOCKED';
    node.blockedReason = failedTaskId;
  }
});

// Continue executing tasks without dependencies
```

### Timeout Handling

```javascript
// Check if worker has timed out
const now = Date.now();
const heartbeatAge = now - new Date(status.last_heartbeat).getTime();

if (heartbeatAge > 30 * 60 * 1000) { // 30 minutes
  // Mark as FAILED
  // Continue other tasks
}
```

---

## Result Summary

### Dispatcher Final Output

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

## Quick Reference

| Scenario | Pattern |
|----------|---------|
| Parallel distribution of backend tasks | Claude + task-worker agents |
| Frontend task parallelization | Claude + task-worker agents |
| Tasks with dependencies | Wait for dependencies to complete before distributing |
| Modifying the same file | File lock mechanism |
| Worker timeout | Heartbeat monitoring + timeout handling |
| Task failure | Isolation + continue tasks without dependencies |
