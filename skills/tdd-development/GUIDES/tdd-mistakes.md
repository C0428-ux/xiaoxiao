# TDD Common Mistakes | Common TDD Mistakes

## Core Objective

Identify and avoid common mistakes in TDD practice.

## Mistake 1: Writing Implementation Before Tests

```markdown
Wrong Approach
Write code → Write tests → Pass

Correct Approach
Write tests (RED) → Write implementation (GREEN) → Refactor (REFACTOR)
```

**Consequence**: Tests are ineffective, they only verify code that is already complete

## Mistake 2: Testing Too Many Details

```javascript
// Bad - testing implementation details
it('should call validateEmail and hashPassword in order', () => {
  expect(validateEmail).toHaveBeenCalledBefore(hashPassword)
})

// Good - testing behavior
it('should create user with valid email and hashed password', () => {
  const user = await UserService.create(validUser)
  expect(user.email).toBe(validUser.email)
  expect(user.passwordHash).not.toBe(validUser.password)
})
```

## Mistake 3: Tests Too Complex

```javascript
// Bad - one test does too much
it('should do everything correctly', async () => {
  // 100 lines of test code
  // Tests create, update, delete, query...
})

// Good - one test, one behavior
it('should create user')
it('should update user email')
it('should delete user')
```

## Mistake 4: Not Testing Boundaries

```javascript
// Bad - only testing happy path
it('should return user when found', () => {
  expect(service.findById(1)).toBe(user)
})

// Good - testing edge cases
it('should throw NotFoundError when user does not exist', () => {
  expect(() => service.findById(999)).toThrow(NotFoundError)
})

it('should throw ValidationError for invalid email format', () => {
  expect(() => service.create({ email: 'invalid' })).toThrow(ValidationError)
})
```

## Mistake 5: Tests Having Order Dependencies

```javascript
// Bad - dependencies between tests
it('test 1', () => {
  const id = service.create(user) // Creates user
})

it('test 2', () => {
  const user = service.findById(id) // Depends on test 1 creating the user
})

// Good - each test is independent
beforeEach(() => {
  service.clear() // Clear data
})

it('should create user', () => { /* ... */ })
it('should find user by id', () => {
  service.create(user) // Create within this test
})
```

## Mistake 6: Mocking Everything

```javascript
// Bad - excessive mocking
it('should calculate sum', () => {
  const mockMath = { add: (a, b) => a + b }
  const calculator = new Calculator(mockMath)
  expect(calculator.add(1, 2)).toBe(3)
})

// Good - use real logic
it('should calculate sum', () => {
  const calculator = new Calculator()
  expect(calculator.add(1, 2)).toBe(3)
})
```

## Mistake 7: Vague Test Names

```javascript
// Bad
it('test1')
it('should work')

// Good
it('should return 404 when resource not found')
it('should create user with valid data')
```

## Mistake 8: Ignoring Test Failures

```markdown
# Red Tests? Don't Ignore!

Wrong: "The test failed, but we know the code is correct"
Right: "A failing test means there's a problem with my assumptions or code"
```

## Mistake 9: Not Testing Error Paths

```javascript
// Bad - only testing success
it('should create user', () => { /* ... */ })

// Good - also test failures
it('should throw error for invalid email')
it('should throw error for duplicate email')
it('should throw error when database is down')
```

## Mistake 10: Excessive Assertions

```javascript
// Bad - too many assertions
expect(result.id).toBeDefined()
expect(result.name).toBe('John')
expect(result.email).toBe('john@example.com')
expect(result.createdAt).toBeInstanceOf(Date)
expect(result.updatedAt).toBeInstanceOf(Date)
// ...

// Good - focus on key assertions
expect(result).toMatchObject({
  name: 'John',
  email: 'john@example.com'
})
```

## When to Stop

- Test-driven development (not test-lagging)
- Testing behavior, not implementation
- Each test is independent
- Edge cases are covered
- Test failures are fixed promptly
