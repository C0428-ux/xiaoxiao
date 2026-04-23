# 可测试代码模式 | Testable Code Patterns

## 核心目标

编写易于测试的代码，提高代码质量和可测试性。

## 可测试性原则

### 1. 依赖注入

```javascript
// ❌ 难以测试 - 硬依赖
class UserService {
  private db = new Database()

  async create(user) {
    return this.db.insert('users', user)
  }
}

// ✅ 可测试 - 依赖注入
class UserService {
  constructor(database) {
    this.db = database
  }

  async create(user) {
    return this.db.insert('users', user)
  }
}

// 测试时可以注入 mock
const mockDb = { insert: jest.fn() }
const service = new UserService(mockDb)
```

### 2. 单一职责

```javascript
// ❌ 职责过多
async function createUserAndSendEmail(user) {
  const db = new Database()
  await db.insert('users', user)
  const email = new EmailService()
  await email.send(user.email, 'Welcome!')
}

// ✅ 单一职责，可分开测试
async function createUser(user, db) {
  return db.insert('users', user)
}

async function sendWelcomeEmail(email, emailService) {
  return emailService.send(email, 'Welcome!')
}
```

### 3. 避免副作用

```javascript
// ❌ 有副作用
let counter = 0
function increment() {
  counter++
  return counter
}

// ✅ 无副作用
function increment(value) {
  return value + 1
}
```

## 常见反模式

### 全局状态

```javascript
// ❌
global.currentUser = { id: 1 }

// ✅
function getUser(req) {
  return req.user // 从请求传递，不是全局
}
```

### 静态方法

```javascript
// ❌ 难以 mock
const user = await User.findById(id)

// ✅
const user = await this.userRepository.findById(id)
```

### 构造函数做太多

```javascript
// ❌ 构造函数里有副作用
class Service {
  constructor() {
    this.connect() // 连接数据库！
    this.setupLogger() // 初始化日志！
  }
}

// ✅ 明确初始化
class Service {
  constructor(db, logger) {
    this.db = db
    this.logger = logger
  }
}
```

## 可测试的函数签名

### 好函数特征

```javascript
// 输入明确
function calculateTax(amount, rate, region) {
  return amount * rate * region.multiplier
}

// 输出明确
function parseEmail(input) {
  // 返回 { valid: boolean, email: string } 或抛出异常
}

// 无隐藏依赖
function validateEmail(email, emailValidator) {
  return emailValidator.isValid(email)
}
```

## 测试友好结构

```
src/
├── services/        # 业务逻辑（可测试）
├── repositories/     # 数据访问（可 mock）
├── utils/           # 纯函数（容易测试）
└── handlers/        # HTTP 处理（集成测试）
```

## 何时退出

- 依赖通过注入获取
- 函数有明确输入输出
- 副作用最小化
- 可以单独测试每个模块
