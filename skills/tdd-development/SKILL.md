---
name: tdd-development
description: >-
  Implements features using test-driven development: RED (write failing test) →
  GREEN (minimal code pass) → REFACTOR (improve without breaking).
  Distributes independent tasks to parallel workers via Message Bus.
  Frontend tasks read UI design files for visual reference.
  Use after task-planning to implement the planned tasks.
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

## What Changed in v2

- **Task Distribution**: 使用 parallel-dispatcher 并行分发任务给 workers
- **UI Design Alignment**: 前端任务必须读取 UI 设计文件
- **TDD Iron Law**: 强化 RED/GREEN 必须运行测试验证
- **Message Bus**: 通过文件协调并行 workers

---

## When to Use

- After task-planning when implementing features
- When code quality and testability are priorities
- When parallel execution can speed up development
- When refactoring legacy code safely

## When NOT to Use

- Architecture decisions (use architect skill)
- UI design (use ui-design skill)
- Quick prototypes with no test requirements
- When time pressure prohibits proper TDD

---

## TDD Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

**Rules:**
1. RED: 写一个最小的失败测试
2. **必须运行测试验证失败**（不能跳过）
3. GREEN: 写最小代码通过测试（YAGNI）
4. **必须运行测试验证通过**（不能跳过）
5. REFACTOR: 仅在测试通过后清理代码

**Violating the letter of the rules is violating the spirit of the rules.**

---

## Core Workflow

### Phase 1: Read UI Design & Task Analysis

**Entry**: Task list from task-planning
**Prerequisites Check**:
- If no task list found in `docs/xiaoxiao/plans/` → **BLOCKED**: "Cannot start tdd-development. Run task-planning first."
**Actions**:
1. Read `docs/xiaoxiao/plans/task-planning-output.md` - review prioritized task list
2. Read related specs:
   - `./SPEC.md` - for requirements
   - `docs/xiaoxiao/plans/architect-output.md` - for API contracts
3. **Read UI Design (Frontend tasks must read)**:
   - `docs/xiaoxiao/plans/ui-design/preview.html` - main preview
   - `docs/xiaoxiao/plans/ui-design/pages/*.html` - individual pages
   - Extract component structures for frontend tasks
4. Analyze task dependencies (DAG):
   - Backend tasks: API, database, auth
   - Frontend tasks: components, pages (depend on backend)
   - Identify parallel groups
5. Ask: "Found [N] backend tasks, [N] frontend tasks. [N] can run in parallel. Proceed?"
**Exit**: Task analysis complete, parallel groups identified

---

### Phase 2: Task Distribution

**Entry**: Task analysis complete
**Actions**:
1. Initialize Message Bus:
   ```bash
   mkdir -p docs/xiaoxiao/plans/tdd/.message-bus/events
   ```
2. Use **parallel-dispatcher** pattern:
   - Read task dependencies from task-planning output
   - Identify first parallel group (no blockers)
   - Dispatch workers using Agent tool:
     - **Backend workers**: receive API/DB tasks
     - **Frontend workers**: receive component tasks + UI design path
3. Maximum 5 concurrent workers
4. Monitor via Message Bus:
   - `worker-status.json` - worker heartbeats
   - `events/TASK_COMPLETE_*.event` - completion events
   - `events/TASK_FAILED_*.event` - failure events
5. When tasks complete, dispatch next parallel group
6. Blocked tasks auto-dispatch when dependencies complete
**Exit**: All tasks distributed and monitored

**Reference**: `agents/parallel-dispatcher.md`, `agents/task-worker.md`

---

### Phase 3: RED - Write Failing Test

**Entry**: Task selected by worker
**Actions**:
1. Write the smallest possible test that describes expected behavior
2. Test must:
   - **Arrange**: Set up test data
   - **Act**: Call the function/endpoint
   - **Assert**: Verify expected outcome
3. **CRITICAL: Run test to verify it fails**
   ```bash
   npm test -- --testPathPattern="path/to/test.test.ts"
   ```
4. Verify failure is expected (not due to typos/errors)
5. Ask: "Test failing correctly. Proceed to GREEN?"

**Test Structure**:
```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid email', () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'SecurePass123!';

      // Act
      const user = UserService.createUser({ email, password });

      // Assert
      expect(user.email).toBe(email);
      expect(user.id).toBeDefined();
      expect(user.passwordHash).not.toBe(password);
    });
  });
});
```

**Exit**: Test written and failing (verified)

---

### Phase 4: GREEN - Minimal Implementation

**Entry**: Test failing (RED)
**Actions**:
1. Write the **minimum code** to make the test pass
2. **YAGNI**: Don't add features beyond the test
3. **CRITICAL: Run test to verify it passes**
   ```bash
   npm test -- --testPathPattern="path/to/test.test.ts"
   ```
4. Verify:
   - Test passes
   - No other tests broken
   - No TODO comments in code
5. Ask: "Test passes. Proceed to REFACTOR?"

**GREEN Checklist**:
- [ ] Test passes (verified by running)
- [ ] No other tests broken
- [ ] Implementation is minimal
- [ ] No TODO comments in code
- [ ] No YAGNI features

**Exit**: Test passes (verified)

---

### Phase 5: REFACTOR - Improve Code

**Entry**: Test passing (GREEN)
**Actions**:
1. Improve code structure without changing behavior:
   - Extract duplicated logic
   - Rename variables for clarity
   - Improve function organization
2. **Keep tests green** - run tests after each refactor
3. Look for:
   - Code smells (long functions, magic numbers)
   - Opportunities for extraction
   - Clear naming
4. Ask: "Code improved, tests still green. Next test case?"

**Refactor Checklist**:
- [ ] No duplicate logic
- [ ] Meaningful names
- [ ] Single responsibility per function
- [ ] No magic numbers/constants
- [ ] Tests still pass (verified by running)

**Exit**: Code improved, tests still passing

---

### Phase 6: Loop Until Task Complete

**Entry**: One cycle complete
**Actions**:
1. Ask: "Does this task have more test cases?"
2. If yes, go to Phase 3 with next test case
3. If no, task is complete
4. Report completion to Message Bus:
   - Write `TASK_COMPLETE_{taskId}.event`
   - Update `worker-status.json`

**Loop Limit**: Max 10 RED-GREEN-REFACTOR cycles per task. If exceeded, escalate to user.

---

### Phase 7: Integration & Completion

**Entry**: All parallel tasks complete
**Actions**:
1. Run full test suite
2. Verify no regressions
3. Integration test if needed
4. Confirm with user before moving on

**Run on completion**:
```bash
xiaoxiao complete tdd-development docs/xiaoxiao/plans/tdd/
```

---

## Test Anti-Patterns (Iron Rules)

### MUST NOT

1. **Never test mock behavior**
   - ❌ `expect(mock.fetch).toHaveBeenCalled()`
   - ✅ Test actual observable outcomes

2. **Don't add production methods only for testing**
   - ❌ Adding `getBalance()` method just to test internal state
   - ✅ Test through public API

3. **Don't use mocks without understanding dependencies**
   - ❌ Mocking everything without knowing what the dependency does
   - ✅ Mock only external boundaries (HTTP, DB)

4. **Don't test implementation details**
   - ❌ Testing that a private method is called
   - ✅ Testing that the public behavior is correct

5. **Don't create order-dependent tests**
   - Each test must be independently runnable

6. **Don't skip RED/GREEN verification**
   - ❌ Writing test but not running it
   - ✅ Always run `npm test` to verify RED fails and GREEN passes

---

## Task Distribution Pattern

### Backend Group
- API endpoints
- Database schemas
- Authentication/authorization
- Service layer

### Frontend Group
- UI components (read `docs/xiaoxiao/plans/ui-design/preview.html`)
- Pages
- State management
- API integration

### Dependency Rules
- Frontend tasks depend on their corresponding backend API
- Workers use file-based Message Bus coordination
- Maximum 5 parallel workers

---

## Constraints

### MUST DO

- Follow RED → GREEN → REFACTOR strictly in order
- **Run tests to verify RED fails** (mandatory)
- **Run tests to verify GREEN passes** (mandatory)
- Keep tests small and focused
- Use descriptive test names (behavior, not method names)
- Test both happy path and error paths
- Frontend workers read UI design files
- Run full test suite before completing

### MUST NOT DO

- Skip tests when under time pressure
- Write implementation before test (violates TDD Iron Law)
- Use test coverage as a metric
- Mock internal dependencies
- Leave failing tests in the codebase
- Refactor without running tests
- Skip RED/GREEN verification
- Add features beyond what the test requires

---

## Reference Guide

| Topic | File |
|-------|------|
| Parallel Dispatcher | `agents/parallel-dispatcher.md` |
| Task Worker | `agents/task-worker.md` |
| Subagent Patterns | `GUIDES/subagent-patterns.md` |
| Test Naming Conventions | `GUIDES/test-naming.md` |
| TDD Mistakes | `GUIDES/tdd-mistakes.md` |

---

## Output

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

---

## CONFIRM Nodes

| Phase | Prompt |
|-------|--------|
| Phase 1 | "Found [N] backend, [N] frontend tasks. [N] parallel groups. Proceed?" |
| Phase 2 | "Workers dispatched: [N]. Monitoring for completions..." |
| RED | "Test failing as expected (verified by running). Proceed to GREEN?" |
| GREEN | "Test passes (verified by running). Proceed to REFACTOR?" |
| REFACTOR | "Code improved, tests green. Continue to next case?" |
| Task Complete | "Task [N] done: [N] tests, all passing. Waiting for parallel tasks..." |
| All Complete | "Development complete. [N] tasks done. Run full test suite?" |
