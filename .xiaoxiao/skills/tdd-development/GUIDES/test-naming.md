# 测试命名指南 | Test Naming

## 核心目标

写出清晰、可读的测试名称，让人一眼就知道测试在验证什么。

## 命名结构

### 描述行为，不描述实现

```javascript
// ❌ 不好 - 描述实现
test('UserService.createUser returns user object')

// ✅ 好 - 描述行为
test('should create user with valid email')
test('creates a new user record in database')
```

### 格式模板

```markdown
[测试对象] [条件/场景] [预期行为]
```

## 常用模式

### Given-When-Then 风格

```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('given valid email, when creating user, then returns user with id')

    it('given duplicate email, when creating user, then throws DuplicateEmailError')
  })
})
```

### Should 风格

```javascript
it('should return 201 when resource is created')
it('should throw ValidationError when email is invalid')
it('should update user profile successfully')
```

### Behavior 风格

```javascript
it('creates a new session when user logs in')
it('returns empty list when no results found')
it('sends confirmation email after registration')
```

## 测试名称示例

| 场景 | ❌ 不好 | ✅ 好 |
|------|---------|------|
| 登录成功 | test('login success') | it('should redirect to dashboard on successful login') |
| 登录失败 | test('login fail') | it('should show error message when password is incorrect') |
| 创建订单 | test('create order') | it('should create order with pending status and return order id') |
| 删除用户 | test('delete user') | it('should soft delete user and revoke all active sessions') |

## 分层命名

```javascript
// 描述类/模块
describe('ShoppingCart', () => {
  // 描述方法
  describe('addItem', () => {
    // 描述场景
    it('should increase item quantity when same item added again')

    it('should add new item when cart is empty')

    it('should throw error when product is out of stock')
  })

  describe('checkout', () => {
    it('should calculate total with discount applied')
  })
})
```

## 常见前缀

| 前缀 | 用途 | 示例 |
|------|------|------|
| should | 期望行为 | it('should return 404 when not found') |
| given | 条件设置 | it('given valid token, should allow access') |
| when | 触发动作 | it('when user clicks submit, should validate form') |
| expect | 期望结果 | it('expect to receive confirmation email') |

## 何时退出

- 所有测试名称清晰描述行为
- 测试失败时，名称能帮助定位问题
- 团队对命名风格有共识
