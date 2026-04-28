# Testable Code Patterns | Testable Code Patterns

## Core Objective

Write code that is easy to test, improving code quality and testability.

## Testability Principles

### 1. Dependency Injection

```javascript
// Bad - hard dependency, hard to test
class UserService {
  private db = new Database()

  async create(user) {
    return this.db.insert('users', user)
  }
}

// Good - dependency injection, testable
class UserService {
  constructor(database) {
    this.db = database
  }

  async create(user) {
    return this.db.insert('users', user)
  }
}

// Can inject mock during testing
const mockDb = { insert: jest.fn() }
const service = new UserService(mockDb)
```

### 2. Single Responsibility

```javascript
// Bad - too many responsibilities
async function createUserAndSendEmail(user) {
  const db = new Database()
  await db.insert('users', user)
  const email = new EmailService()
  await email.send(user.email, 'Welcome!')
}

// Good - single responsibility, can be tested separately
async function createUser(user, db) {
  return db.insert('users', user)
}

async function sendWelcomeEmail(email, emailService) {
  return emailService.send(email, 'Welcome!')
}
```

### 3. Avoid Side Effects

```javascript
// Bad - has side effects
let counter = 0
function increment() {
  counter++
  return counter
}

// Good - no side effects
function increment(value) {
  return value + 1
}
```

## Common Anti-Patterns

### Global State

```javascript
// Bad
global.currentUser = { id: 1 }

// Good
function getUser(req) {
  return req.user // Pass via request, not global
}
```

### Static Methods

```javascript
// Bad - hard to mock
const user = await User.findById(id)

// Good
const user = await this.userRepository.findById(id)
```

### Constructor Doing Too Much

```javascript
// Bad - side effects in constructor
class Service {
  constructor() {
    this.connect() // Connecting to database!
    this.setupLogger() // Initializing logger!
  }
}

// Good - explicit initialization
class Service {
  constructor(db, logger) {
    this.db = db
    this.logger = logger
  }
}
```

## Test-Friendly Function Signatures

### Good Function Characteristics

```javascript
// Clear inputs
function calculateTax(amount, rate, region) {
  return amount * rate * region.multiplier
}

// Clear outputs
function parseEmail(input) {
  // Returns { valid: boolean, email: string } or throws exception
}

// No hidden dependencies
function validateEmail(email, emailValidator) {
  return emailValidator.isValid(email)
}
```

## Test-Friendly Structure

```
src/
├── services/        # Business logic (testable)
├── repositories/    # Data access (mockable)
├── utils/           # Pure functions (easy to test)
└── handlers/        # HTTP handlers (integration tests)
```

## When to Stop

- Dependencies are injected
- Functions have clear inputs and outputs
- Side effects are minimized
- Each module can be tested in isolation
