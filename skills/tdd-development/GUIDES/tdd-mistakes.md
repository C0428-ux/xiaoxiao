# TDD 常见错误 | Common TDD Mistakes

## 核心目标

识别并避免 TDD 实践中的常见错误。

## 错误 1: 先写实现后补测试

```markdown
❌ 错误做法
写代码 → 写测试 → 通过

✅ 正确做法
写测试（RED）→ 写实现（GREEN）→ 重构（REFACTOR）
```

**后果**：测试无效，测试只是验证已完成的代码

## 错误 2: 测试太多细节

```javascript
// ❌ 测试实现细节
it('should call validateEmail and hashPassword in order', () => {
  expect(validateEmail).toHaveBeenCalledBefore(hashPassword)
})

// ✅ 测试行为
it('should create user with valid email and hashed password', () => {
  const user = await UserService.create(validUser)
  expect(user.email).toBe(validUser.email)
  expect(user.passwordHash).not.toBe(validUser.password)
})
```

## 错误 3: 测试太复杂

```javascript
// ❌ 一个测试测太多
it('should do everything correctly', async () => {
  // 100 行测试代码
  // 测试了创建、更新、删除、查询...
})

// ✅ 一个测试一个行为
it('should create user')
it('should update user email')
it('should delete user')
```

## 错误 4: 不测试边界

```javascript
// ❌ 只测 happy path
it('should return user when found', () => {
  expect(service.findById(1)).toBe(user)
})

// ✅ 测试边界情况
it('should throw NotFoundError when user does not exist', () => {
  expect(() => service.findById(999)).toThrow(NotFoundError)
})

it('should throw ValidationError for invalid email format', () => {
  expect(() => service.create({ email: 'invalid' })).toThrow(ValidationError)
})
```

## 错误 5: 测试有顺序依赖

```javascript
// ❌ 测试间有依赖
it('test 1', () => {
  const id = service.create(user) // 创建用户
})

it('test 2', () => {
  const user = service.findById(id) // 依赖 test 1 创建的用户
})

// ✅ 每个测试独立
beforeEach(() => {
  service.clear() // 清理数据
})

it('should create user', () => { /* ... */ })
it('should find user by id', () => {
  service.create(user) // 在本测试内创建
})
```

## 错误 6: Mock 所有东西

```javascript
// ❌ Mock 过度
it('should calculate sum', () => {
  const mockMath = { add: (a, b) => a + b }
  const calculator = new Calculator(mockMath)
  expect(calculator.add(1, 2)).toBe(3)
})

// ✅ 使用真实逻辑
it('should calculate sum', () => {
  const calculator = new Calculator()
  expect(calculator.add(1, 2)).toBe(3)
})
```

## 错误 7: 测试命名模糊

```javascript
// ❌
it('test1')
it('should work')

// ✅
it('should return 404 when resource not found')
it('should create user with valid data')
```

## 错误 8: 忽略测试失败

```markdown
# 红色测试？别忽略！

❌ "测试失败了，但我们知道代码是对的"
✅ "测试失败说明我的假设或代码有问题"
```

## 错误 9: 不测试错误路径

```javascript
// ❌ 只测成功
it('should create user', () => { /* ... */ })

// ✅ 也要测失败
it('should throw error for invalid email')
it('should throw error for duplicate email')
it('should throw error when database is down')
```

## 错误 10: 过度的断言

```javascript
// ❌ 断言太多
expect(result.id).toBeDefined()
expect(result.name).toBe('John')
expect(result.email).toBe('john@example.com')
expect(result.createdAt).toBeInstanceOf(Date)
expect(result.updatedAt).toBeInstanceOf(Date)
// ...

// ✅ 聚焦关键断言
expect(result).toMatchObject({
  name: 'John',
  email: 'john@example.com'
})
```

## 何时退出

- 测试驱动开发（不是测试滞后）
- 测试行为而非实现
- 每个测试独立
- 边界情况有覆盖
- 测试失败时及时修复
