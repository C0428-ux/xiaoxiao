# Test Naming Guide | Test Naming

## Core Objective

Write clear, readable test names so that anyone can immediately understand what the test is verifying.

## Naming Structure

### Describe Behavior, Not Implementation

```javascript
// Bad - describes implementation
test('UserService.createUser returns user object')

// Good - describes behavior
test('should create user with valid email')
test('creates a new user record in database')
```

### Format Template

```markdown
[Test Subject] [Condition/Scenario] [Expected Behavior]
```

## Common Patterns

### Given-When-Then Style

```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('given valid email, when creating user, then returns user with id')

    it('given duplicate email, when creating user, then throws DuplicateEmailError')
  })
})
```

### Should Style

```javascript
it('should return 201 when resource is created')
it('should throw ValidationError when email is invalid')
it('should update user profile successfully')
```

### Behavior Style

```javascript
it('creates a new session when user logs in')
it('returns empty list when no results found')
it('sends confirmation email after registration')
```

## Test Name Examples

| Scenario | Bad | Good |
|----------|-----|------|
| Login success | test('login success') | it('should redirect to dashboard on successful login') |
| Login failure | test('login fail') | it('should show error message when password is incorrect') |
| Create order | test('create order') | it('should create order with pending status and return order id') |
| Delete user | test('delete user') | it('should soft delete user and revoke all active sessions') |

## Hierarchical Naming

```javascript
// Describe class/module
describe('ShoppingCart', () => {
  // Describe method
  describe('addItem', () => {
    // Describe scenario
    it('should increase item quantity when same item added again')

    it('should add new item when cart is empty')

    it('should throw error when product is out of stock')
  })

  describe('checkout', () => {
    it('should calculate total with discount applied')
  })
})
```

## Common Prefixes

| Prefix | Purpose | Example |
|--------|---------|---------|
| should | Expected behavior | it('should return 404 when not found') |
| given | Condition setup | it('given valid token, should allow access') |
| when | Trigger action | it('when user clicks submit, should validate form') |
| expect | Expected result | it('expect to receive confirmation email') |

## When to Stop

- All test names clearly describe behavior
- When tests fail, names help locate the problem
- Team has consensus on naming style
