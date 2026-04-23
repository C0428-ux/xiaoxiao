# AAA 模式 | Arrange-Act-Assert

## 核心目标

标准化测试结构，让测试易于阅读和维护。

## AAA 结构

```javascript
describe('LoginForm', () => {
  it('should submit credentials to server', () => {
    // Arrange - 准备测试数据
    const email = 'test@example.com'
    const password = 'password123'
    const expectedEndpoint = '/api/login'

    // Act - 执行被测操作
    const result = submitLogin(email, password)

    // Assert - 验证结果
    expect(result.endpoint).toBe(expectedEndpoint)
  })
})
```

## 详解

### 1. Arrange（准备）

**目的**：设置测试所需的前置条件

```javascript
// 准备数据
const user = { name: 'Test User', email: 'test@example.com' }

// 创建 mock
const mockDatabase = createMockDatabase()

// 设置初始状态
await mockDatabase.seed(user)
```

### 2. Act（执行）

**目的**：调用被测试的代码

```javascript
// 单一操作
const result = await UserService.create(user)

// 或链式操作
const order = await OrderService
  .create({ userId: 1, items: [...] })
  .then(order => OrderService.calculateTotal(order.id))
```

### 3. Assert（断言）

**目的**：验证预期结果

```javascript
// 单个断言
expect(result).toBeDefined()

// 多个断言（但保持测试专注）
expect(result.id).toBeDefined()
expect(result.email).toBe(user.email)
expect(result.createdAt).toBeInstanceOf(Date)
```

## 简化规则

### 规则1：保持简洁

```javascript
// ❌ 过度准备
beforeEach(async () => {
  const users = await createTestUsers(10)
  const products = await createTestProducts(50)
  const orders = await createTestOrders(users, products)
  // ...
})

// ✅ 只准备需要的
beforeEach(async () => {
  testUser = await createUser({ email: 'test@example.com' })
})
```

### 规则2：Act 只做一件事

```javascript
// ❌ Act 中有多个操作
it('should create and return user', async () => {
  // ...
  const user = await UserService.create(userData)
  const session = await SessionService.create(user.id) // Act 里有第二个操作
  // ...
})

// ✅ 分开测试
it('should create user', async () => {
  const user = await UserService.create(userData)
  expect(user).toBeDefined()
})

it('should create session for user', async () => {
  const session = await SessionService.create(user.id)
  expect(session).toBeDefined()
})
```

### 规则3：断言要明确

```javascript
// ❌ 模糊断言
expect(result).toBeTruthy()

// ✅ 明确断言
expect(result.success).toBe(true)
expect(result.userId).toBe(123)
```

## 常见错误

### 错误1：混淆 Arrange 和 Act

```javascript
// ❌ 把 Act 放在 Arrange 里
beforeEach(() => {
  user = UserService.create() // 这其实是 Act！
})

// ✅ 正确
beforeEach(() => {
  userData = { name: 'Test', email: 'test@test.com' } // Arrange
})

it('should create user', () => {
  const user = UserService.create(userData) // Act
  expect(user).toBeDefined() // Assert
})
```

### 错误2：Act 里有断言

```javascript
// ❌
it('should login', () => {
  const result = UserService.login(credentials)
  expect(result.token).toBeDefined() // 这应该在 Assert 里
})
```

## 何时退出

- 测试严格遵循 Arrange-Act-Assert 结构
- Act 只包含要测试的操作
- 断言清晰明确
- 测试失败时能快速定位阶段
