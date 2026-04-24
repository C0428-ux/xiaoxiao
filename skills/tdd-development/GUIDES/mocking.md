# Mock 使用指南 | Mocking Guidelines

## 核心目标

正确使用 mock，避免测试Mocks而非真实行为。

## 何时使用 Mock

### 正确场景

| 场景 | 示例 |
|------|------|
| 外部 API 调用 | Stripe、发送邮件 |
| 数据库操作 | 加快测试速度 |
| 时间相关 | 固定时间 |
| 第三方服务 | 日志服务、监控 |

### 错误场景

```javascript
// ❌ Mock 内部实现
it('should calculate total', () => {
  const mockMath = { random: () => 0.5 }
  const result = calculateWithTax(100, mockMath) // 不要这样做
})
```

## Mock 边界原则

### 只 Mock 边界

```javascript
// ✅ 好 - Mock 外部依赖
const mockEmailService = { send: jest.fn() }
UserService.sendWelcomeEmail = mockEmailService.send

// ❌ 坏 - Mock 内部模块
const mockUserModel = { findById: jest.fn() }
UserService.UserModel = mockUserModel // 不要这样做
```

## Mock 示例

### Mock 外部 API

```javascript
// 假设 UserService 依赖外部邮件服务
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

### Mock 时间

```javascript
// 使用 fake timers
it('should expire token after 1 hour', () => {
  jest.useFakeTimers()

  const token = createToken()

  // 快进 1 小时
  jest.advanceTimersByTime(60 * 60 * 1000)

  expect(isTokenExpired(token)).toBe(true)

  jest.useRealTimers()
})
```

### Mock 数据库（谨慎）

```javascript
// 如果必须 Mock 数据库，确保测试真实行为
const mockDb = {
  query: jest.fn().mockResolvedValue([{ id: 1, name: 'Test' }])
}

// 但最好用真实数据库做集成测试
```

## 不要 Mock 的内容

| 不要 Mock | 原因 |
|-----------|------|
| 被测试的代码本身 | 测试会变得无意义 |
| 简单函数 | 直接测试更可靠 |
| 业务逻辑 | Mock 掉就没有测试效果了 |
| 构造函数 | 可能导致奇怪的 bug |

## Mock 清理

```javascript
beforeEach(() => {
  jest.clearAllMocks() // 清理 mock 调用记录
})

afterEach(() => {
  jest.resetAllMocks() // 重置 mock 实现
})
```

## 常见问题

### Q: 什么时候不用 mock？

A: 当测试的是你的代码与数据库/外部系统的交互时，使用真实的集成测试。

### Q: mock 太多怎么办？

A: 说明测试设计可能有问题。考虑重构被测试的代码，降低耦合。

## 何时退出

- 只 mock 外部边界
- 没有 mock 内部实现
- mock 行为与真实服务一致
- 测试能捕获真实环境的问题
