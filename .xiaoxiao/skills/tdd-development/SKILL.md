---
name: tdd-development
description: >-
  Implements features using test-driven development: RED (write failing test) →
  GREEN (minimal code pass) → REFACTOR (improve without breaking). Follows strict
  anti-patterns to ensure tests serve their purpose. Use after task-planning to
  implement the planned tasks.
  NOT for: architecture design, UI design, or quick prototyping.
version: 1.0
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
output-format: code + tests
related-skills:
  - task-planning
  - ship
---

# TDD Development | TDD 开发

## When to Use

- After task-planning when implementing features
- When code quality and testability are priorities
- When refactoring legacy code safely
- When working with multiple developers
- When building for long-term maintainability

## When NOT to Use

- Architecture decisions (use architect skill)
- UI design (use ui-design skill)
- Quick prototypes with no test requirements
- One-off scripts or automation
- When time pressure prohibits proper TDD
- Exploring unfamiliar domains (use spikes first)

---

## Core Workflow

### Phase 1: Task Selection

**Entry**: Task list from task-planning
**Prerequisites Check**:
- If no task list found in `docs/xiaoxiao/plans/` → **BLOCKED**: "Cannot start tdd-development. Run task-planning first."
**Actions**:
1. Read `docs/xiaoxiao/plans/task-planning-output.md` - review prioritized task list
2. Select next task (highest priority, no blockers)
3. Read related specs:
   - Read `./SPEC.md` - for requirements
   - Read `docs/xiaoxiao/plans/ui-design-output.md` - for UI components
   - Read `docs/xiaoxiao/plans/architect-output.md` - for API contracts
4. Ask: "What is the simplest test case for this?"
**Exit**: Task selected, requirements understood

---

### Phase 2: RED - Write Failing Test

**Entry**: Task selected
**Actions**:
1. Write the smallest possible test that describes expected behavior
2. Test should fail (RED) - confirming it tests what we want
3. Include:
   - **Arrange**: Set up test data
   - **Act**: Call the function/endpoint
   - **Assert**: Verify expected outcome
4. Ask: "Is this test describing behavior or implementation?"
**Exit**: Test written and failing

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

---

### Phase 3: GREEN - Minimal Implementation

**Entry**: Test failing (RED)
**Actions**:
1. Write the minimum code to make the test pass
2. Don't optimize - just make it work
3. Hardcode values if needed, then refactor
4. Focus on getting to GREEN quickly
5. Ask: "Am I writing code to pass the test, or adding features?"
**Exit**: Test passes (GREEN)

** GREEN Checklist**:
- [ ] Test passes
- [ ] No other tests broken
- [ ] Implementation is minimal
- [ ] No TODO comments in code

---

### Phase 4: REFACTOR - Improve Code

**Entry**: Test passing (GREEN)
**Actions**:
1. Improve code structure without changing behavior:
   - Extract duplicated logic
   - Rename variables for clarity
   - Improve function organization
2. Ensure tests still pass after refactoring
3. Look for:
   - Code smells (long functions, magic numbers)
   - Opportunities for extraction
   - Clear naming
4. Ask: "Is this code clean? Can I explain it in one sentence?"
**Exit**: Code improved, tests still passing

**Refactor Checklist**:
- [ ] No duplicate logic
- [ ] Meaningful names
- [ ] Single responsibility per function
- [ ] No magic numbers/constants
- [ ] Tests still pass

---

### Phase 5: Loop Until Task Complete

**Entry**: One cycle complete
**Actions**:
1. Ask: "Does this task have more test cases?"
2. If yes, go to Phase 2 with next test case
3. If no, task is complete
4. Move to next task
5. Ask user: "Task [N] complete. Continue to next?"
**Exit**: All test cases for task pass

**Loop Limit**: Max 10 RED-GREEN-REFACTOR cycles per task. If exceeded, escalate to user.

---

### Phase 6: Task Completion

**Entry**: All tests for task pass
**Actions**:
1. Run full test suite
2. Verify no regressions
3. Update task list status
4. Confirm with user before moving on
**Exit**: Task marked complete

**Run on completion**:
```bash
xiaoxiao complete tdd-development docs/xiaoxiao/plans/tdd-development-output.md
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

---

## Constraints

### MUST DO

- Follow RED → GREEN → REFACTOR strictly in order
- Write test before implementation
- Keep tests small and focused
- Use descriptive test names (behavior, not method names)
- Test both happy path and error paths
- Run full test suite before completing

### MUST NOT DO

- Skip tests when under time pressure
- Write implementation before test (violates TDD)
- Use test coverage as a metric (leads to useless tests)
- Mock internal dependencies (only external boundaries)
- Leave failing tests in the codebase
- Refactor without running tests

---

## Reference Guide

| Topic | File | Load When |
|-------|------|-----------|
| Test Naming Conventions | GUIDES/test-naming.md | Writing descriptive test names |
| Arrange-Act-Assert Pattern | GUIDES/aaa-pattern.md | Structuring tests properly |
| Mocking Guidelines | GUIDES/mocking.md | When and how to mock |
| Testable Code Patterns | GUIDES/testable-code.md | Writing testable code |
| Common TDD Mistakes | GUIDES/tdd-mistakes.md | Avoiding anti-patterns |

---

## Output Example

```markdown
## Completed Task: User Login

### Tests Added
- `UserService.createUser` - valid/invalid email
- `UserService.createUser` - password strength validation
- `AuthService.login` - correct credentials
- `AuthService.login` - incorrect credentials
- `AuthService.login` - account locked

### Code Changes
- Added `src/services/UserService.js`
- Added `src/services/AuthService.js`
- Added `src/middleware/auth.js`

### Test Results
```
PASS  src/services/UserService.test.js
PASS  src/services/AuthService.test.js
PASS  src/middleware/auth.test.js

Test Suites: 3 passed, 3 total
Tests: 12 passed, 12 total
```
```

---

## CONFIRM Nodes

| Phase | Confirmation Prompt |
|-------|---------------------|
| Task Selected | "Starting: [Task name]. Simplest test case: [X]. Ready?" |
| RED Complete | "Test failing as expected. Proceed to GREEN?" |
| GREEN Complete | "Test passes. Proceed to REFACTOR?" |
| REFACTOR Complete | "Code improved, tests pass. Continue to next case?" |
| Task Complete | "Task [N] done: [N] tests, all passing. Next task?" |
| All Complete | "Development