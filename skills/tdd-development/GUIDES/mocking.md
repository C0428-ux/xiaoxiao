# Mock Usage Guide | Mocking Guidelines

## Core Objective

Use mocks correctly to avoid testing mocks instead of real behavior.

## When to Use Mocks

### Correct Scenarios

| Scenario | Example |
|----------|---------|
| External API calls | Stripe, sending emails |
| Database operations | Speed up tests |
| Time-related | Fixed time |
| Third-party services | Logging services, monitoring |

### Incorrect Scenarios

```javascript
// Bad - mocking internal implementation
it('should calculate total', () => {
  const mockMath = { random: () => 0.5 }
  const result = calculateWithTax(100, mockMath) // Don't do this
})
```

## Mock Boundary Principles

### Only Mock Boundaries

```javascript
// Good - mock external dependencies
const mockEmailService = { send: jest.fn() }
UserService.sendWelcomeEmail = mockEmailService.send

// Bad - mock internal modules
const mockUserModel = { findById: jest.fn() }
UserService.UserModel = mockUserModel // Don't do this
```

## Mock Examples

### Mock External API

```javascript
// Assuming UserService depends on external email service
const mockSendEmail = jest.fn().mockResolvedValue({ messageId: '123' })
EmailService.send = mockSendEmail

it('should send welcome email on registration', async () => {
  await UserService.register({ email: 'test@example.com' })

  expect(mockSendEmail).toHaveBeenCalledWith(
    expect.objectContaining({
      to: 'test@example.com',
      template: 'welcome'
    })
  )
})
```

### Mock Time

```javascript
// Use fake timers
it('should expire token after 1 hour', () => {
  jest.useFakeTimers()

  const token = createToken()

  // Fast forward 1 hour
  jest.advanceTimersByTime(60 * 60 * 1000)

  expect(isTokenExpired(token)).toBe(true)

  jest.useRealTimers()
})
```

### Mock Database (Use with Caution)

```javascript
// If you must mock the database, ensure tests cover real behavior
const mockDb = {
  query: jest.fn().mockResolvedValue([{ id: 1, name: 'Test' }])
}

// But it's better to use a real database for integration tests
```

## What Not to Mock

| Don't Mock | Reason |
|------------|--------|
| The code under test itself | Tests become meaningless |
| Simple functions | Direct testing is more reliable |
| Business logic | Mocking it defeats the purpose of testing |
| Constructors | May cause strange bugs |

## Mock Cleanup

```javascript
beforeEach(() => {
  jest.clearAllMocks() // Clear mock call records
})

afterEach(() => {
  jest.resetAllMocks() // Reset mock implementations
})
```

## Common Questions

### Q: When should I not use mocks?

A: When you're testing how your code interacts with a database or external system, use real integration tests instead.

### Q: What if there are too many mocks?

A: This indicates a possible problem with test design. Consider refactoring the code under test to reduce coupling.

## When to Stop

- Only mock external boundaries
- No mocking of internal implementation
- Mock behavior matches real service
- Tests can catch real-world environment issues
