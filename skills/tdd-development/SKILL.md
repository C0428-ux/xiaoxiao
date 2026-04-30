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
  - TDD development
  - start development
  - write code
  - develop
  - fix
  - fix bug
  - bug
  - iterate
  - optimize
  - refactor
prerequisites:
  - task-planning
output-format: code + tests + docs/xiaoxiao/plans/tdd/
related-skills:
  - task-planning
  - ship
---

# TDD Development | Test-Driven Development

## Mandatory Execution Protocol

**Rules**:
- MUST execute each Step in order, no skipping
- MUST verify each Step (checkpoint) before proceeding to next
- MUST use `xiaoxiao save-progress <skill> <step>` to mark step completion
- CONFIRM nodes MUST wait for user confirmation, never auto-continue

---

## Step 1: Initialization

**Action**:
1. Execute `xiaoxiao save-progress tdd-development step1-complete`
2. Check if `docs/xiaoxiao/plans/task-planning-output.md` exists
3. Check if `docs/xiaoxiao/plans/ui-design/` exists (frontend tasks need this)

**Verification**: Both task list and UI design exist

**CONFIRM**: "Step 1 complete. Task list and UI design both exist. Continue?"

---

## Step 2: Read Requirements

**Action**:
1. Read `docs/xiaoxiao/plans/task-planning-output.md` - review prioritized task list
2. Read `./SPEC.md` - get requirements
3. Read `docs/xiaoxiao/plans/architect-output.md` - get API contracts

**Verification**: Requirements and API contracts read

**CONFIRM**: "Requirements read. Continue?"

---

## Step 3: Read UI Design (Frontend Tasks MUST Execute)

**Action**:
1. Read `docs/xiaoxiao/plans/ui-design/preview.html` - main preview
2. Read `docs/xiaoxiao/plans/ui-design/pages/*.html` - each page
3. Read `docs/xiaoxiao/plans/ui-design/components/component-spec.md` - component specs
4. Extract component structure and visual specifications
5. **Important**: Frontend implementation follows UI design, not task descriptions

**Verification**: UI design read, component structure extracted

**CONFIRM**: "UI design read. Found [N] pages, [N] components. Continue?"

---

## Step 4: Task Analysis

**Action**:
1. Read `docs/xiaoxiao/plans/task-planning-output.md` - get task list
2. Analyze:
   - Total task count
   - DAG dependencies
   - Identify parallel groups (tasks with no dependencies)

**Verification**: Task list and dependencies analyzed

**CONFIRM**: "Found [N] tasks, [N] parallel group. Continue?"

---

## Step 5: Task Distribution

**⚠️ Critical: CANNOT write code yourself, MUST dispatch agents**

**Action**:
1. Initialize Message Bus:
   ```bash
   mkdir -p docs/xiaoxiao/plans/tdd/.message-bus/events
   ```
2. Read `skills/tdd-development/agents/task-worker.md` for worker prompt template
3. **Dispatch task-worker agents in parallel** (max 5 concurrent):
   ```javascript
   // Read the task-worker prompt template
   const taskWorkerPrompt = await Read('skills/tdd-development/agents/task-worker.md');

   // Dispatch workers
   const workers = await Promise.all(
     readyTasks.slice(0, 5).map(task => {
       const taskType = task.type === 'frontend' ? 'frontend' : 'backend';

       return Agent({
         description: `Task Worker: ${task.name}`,
         prompt: `${taskWorkerPrompt}

## Task Assignment

Task ID: ${task.id}
Task Name: ${task.name}
Task Type: ${taskType}
Files to create: ${task.files.join(', ')}
Acceptance Criteria: ${task.acceptance}
UI Design Path: docs/xiaoxiao/plans/ui-design/
Message Bus: docs/xiaoxiao/plans/tdd/.message-bus/
Worker ID: worker-${task.id}-${Date.now()}`,
         agent_type: 'general-purpose',
         run_in_background: true
       });
     })
   );
   ```
4. Monitor via Message Bus:
   - `docs/xiaoxiao/plans/tdd/.message-bus/worker-status.json` - worker heartbeat
   - `docs/xiaoxiao/plans/tdd/.message-bus/events/TASK_COMPLETE_*.event` - completion events
   - `docs/xiaoxiao/plans/tdd/.message-bus/events/TASK_FAILED_*.event` - failure events

**Verification**: Workers dispatched

**CONFIRM**: "Workers dispatched: [N] parallel tasks. Waiting for completion..."

---

## Step 6: TDD Loop (Execute Per Task)

Execute RED-GREEN-REFACTOR for each task:

### 6.1 RED - Write Failing Test

**Action**:
1. Write a minimal test describing expected behavior
2. Test MUST:
   - Arrange: set up test data
   - Act: call function/endpoint
   - Assert: verify expected result
3. **Critical: Run test to verify failure**
   ```bash
   npm test -- --testPathPattern="path/to/test.test.ts"
   ```
4. Verify failure is expected (not from typos/errors)

**Verification**: Test fails (verified)

**CONFIRM**: "Test fails (verified). Continue to GREEN?"

---

### 6.2 GREEN - Minimal Implementation

**Action**:
1. Write **minimal code** to make test pass
2. **YAGNI**: do not add features beyond the test
3. **Critical: Run test to verify pass**
   ```bash
   npm test -- --testPathPattern="path/to/test.test.ts"
   ```
4. Verify:
   - Test passes
   - No other tests broken
   - No TODO comments
5. Ask user: "Test passes. Continue to REFACTOR?"

**Verification**: Test passes (verified)

**CONFIRM**: "Test passes (verified). Continue to REFACTOR?"

---

### 6.3 REFACTOR - Improve Code

**Action**:
1. Improve code structure without changing behavior:
   - Extract duplicate logic
   - Rename variables for clarity
   - Improve function organization
2. **Keep tests green** - run tests after each refactor
3. Look for:
   - Code smells (long functions, magic numbers)
   - Extraction opportunities
   - Clear naming
4. Ask user: "Code improved, tests still green. Next test case?"

**Verification**: Code improved, tests pass (verified)

**CONFIRM**: "Code improved, tests green (verified). Continue to next case?"

---

### 6.4 Loop Until Task Complete

**Action**:
1. Ask: "Does this task have more test cases?"
2. If yes, go back to 6.1
3. If no, task complete
4. Report completion to Message Bus:
   - Write `TASK_COMPLETE_{taskId}.event`
   - Update `worker-status.json`

**Verification**: Task complete

**CONFIRM**: "Task [N] complete: [N] tests, all pass. Waiting for parallel tasks..."

---

## Step 7: Integration & Completion

**Action**:
1. Run full test suite
2. Verify no regressions
3. Run integration tests if needed
4. Ask user before proceeding

**Verification**: Full test suite passes

**CONFIRM**: "Development complete. [N] tasks complete. Run full test suite?"

---

## Step 8: Output Files

**Action**:
1. Create output directory:
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
2. Execute `xiaoxiao complete tdd-development docs/xiaoxiao/plans/tdd/`

**Verification**: Output created

**CONFIRM**: "TDD Development complete. Document saved. Confirm entry to Ship?"

---

## TDD Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

**Rules**:
1. RED: Write one minimal failing test
2. **MUST run test to verify failure** (cannot skip)
3. GREEN: Write minimal code to pass test (YAGNI)
4. **MUST run test to verify pass** (cannot skip)
5. REFACTOR: Clean up code only after tests pass

---

## State Update Commands

After each Step, MUST execute:
```bash
xiaoxiao save-progress tdd-development step[N]-complete
```

For final completion, MUST execute:
```bash
xiaoxiao complete tdd-development docs/xiaoxiao/plans/tdd/
```
