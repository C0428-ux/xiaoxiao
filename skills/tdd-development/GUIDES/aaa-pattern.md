# AAA Pattern | Arrange-Act-Assert

## Core Objective

Standardize test structure to make tests easy to read and maintain.

## AAA Structure

```javascript
describe('LoginForm', () => {
  it('should submit credentials to server', () => {
    // Arrange - prepare test data
    const email = 'test@example.com'
    const password = 'password123'
    const expectedEndpoint = '/api/login'

    // Act - execute the operation under test
    const result = submitLogin(email, password)

    // Assert - verify the result
    expect(result.endpoint).toBe(expectedEndpoint)
  })
})
```

## Detailed Explanation

### 1. Arrange (Preparation)

**Purpose**: Set up preconditions required for the test

```javascript
// Prepare data
const user = { name: 'Test User', email: 'test@example.com' }

// Create mocks
const mockDatabase = createMockDatabase()

// Set initial state
await mockDatabase.seed(user)
```

### 2. Act (Execute)

**Purpose**: Call the code under test

```javascript
// Single operation
const result = await UserService.create(user)

// Or chained operations
const order = await OrderService
  .create({ userId: 1, items: [...] })
  .then(order => OrderService.calculateTotal(order.id))
```

### 3. Assert (Verify)

**Purpose**: Verify expected results

```javascript
// Single assertion
expect(result).toBeDefined()

// Multiple assertions (but keep tests focused)
expect(result.id).toBeDefined()
expect(result.email).toBe(user.email)
expect(result.createdAt).toBeInstanceOf(Date)
```

## Simplification Rules

### Rule 1: Keep It Simple

```javascript
// Bad - excessive preparation
beforeEach(async () => {
  const users = await createTestUsers(10)
  const products = await createTestProducts(50)
  const orders = await createTestOrders(users, products)
  // ...
})

// Good - only prepare what you need
beforeEach(async () => {
  testUser = await createUser({ email: 'test@example.com' })
})
```

### Rule 2: Act Does One Thing

```javascript
// Bad - multiple operations in Act
it('should create and return user', async () => {
  // ...
  const user = await UserService.create(userData)
  const session = await SessionService.create(user.id) // Second operation in Act
  // ...
})

// Good - separate tests
it('should create user', async () => {
  const user = await UserService.create(userData)
  expect(user).toBeDefined()
})

it('should create session for user', async () => {
  const session = await SessionService.create(user.id)
  expect(session).toBeDefined()
})
```

### Rule 3: Assertions Must Be Clear

```javascript
// Bad - vague assertion
expect(result).toBeTruthy()

// Good - explicit assertion
expect(result.success).toBe(true)
expect(result.userId).toBe(123)
```

## Common Mistakes

### Mistake 1: Confusing Arrange and Act

```javascript
// Bad - putting Act in Arrange
beforeEach(() => {
  user = UserService.create() // This is actually Act!
})

// Good - correct
beforeEach(() => {
  userData = { name: 'Test', email: 'test@test.com' } // Arrange
})

it('should create user', () => {
  const user = UserService.create(userData) // Act
  expect(user).toBeDefined() // Assert
})
```

### Mistake 2: Assertions in Act

```javascript
// Bad
it('should login', () => {
  const result = UserService.login(credentials)
  expect(result.token).toBeDefined() // This should be in Assert
})
```

## When to Stop

- Tests strictly follow Arrange-Act-Assert structure
- Act contains only the operation being tested
- Assertions are clear and explicit
- When tests fail, you can quickly identify which phase is problematic
