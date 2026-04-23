# 安全架构指南 | Security Architecture

## 核心目标

设计安全可靠的系统架构，保护用户数据和系统资源。

## 安全原则

### 1. 最小权限

```
每个模块/用户只获取完成工作所需的最小权限
```

### 2. 纵深防御

```
不依赖单一安全措施，多层防护
```

### 3. 默认安全

```
安全应该是默认配置，不是可选配置
```

## 认证设计

### 密码存储

```markdown
# 错误方式
直接存储密码 → 密码泄露

# 正确方式
密码 + salt → hash → 存储
```

### Token 设计

```markdown
## Access Token
- 有效期：15分钟
- 存储：内存（不持久化）

## Refresh Token
- 有效期：7天
- 存储：HttpOnly Cookie 或安全存储
```

### OAuth 2.0

```
用户 → 授权服务器 → 授权码 → 你的服务器 → 换 Token
```

## 授权设计

### RBAC（基于角色的访问控制）

```markdown
## 角色
- Admin: 所有权限
- Editor: 增删改
- Viewer: 只读

## 用户 ↔ 角色 ↔ 权限
```

### 资源级别权限

```markdown
# 用户只能访问自己的资源
GET /users/{userId}/orders
→ 验证 userId === 当前登录用户
```

## 数据保护

### 传输加密

```
HTTPS (TLS 1.2+) 全部流量
```

### 敏感数据加密

```markdown
## 需要加密
- 密码
- API Key
- 身份证号
- 银行卡号

## 加密方式
- 存储：AES-256
- 传输：TLS
```

### 数据脱敏

```markdown
## 日志脱敏
手机号：138****5678
身份证：320****1234

## API 响应脱敏
返回最小必要数据
```

## 常见攻击防护

### SQL 注入

```markdown
# 错误
query = "SELECT * FROM users WHERE id = " + id

# 正确 - 参数化查询
query = "SELECT * FROM users WHERE id = $1" + [id]
```

### XSS

```markdown
# 输出时转义
用户输入 → 转义 → 存储 → 转义 → 输出
```

### CSRF

```markdown
# 使用 SameSite Cookie
Set-Cookie: session=xxx; SameSite=Strict

# CSRF Token
表单包含 CSRF Token
```

## 安全检查清单

- [ ] HTTPS 强制
- [ ] 密码 hash + salt
- [ ] Token 有过期时间
- [ ] 权限最小化
- [ ] 输入验证
- [ ] SQL 参数化
- [ ] 输出转义
- [ ] 安全 Header（CSP, X-Frame-Options 等）
- [ ] 日志记录异常
- [ ] 定期安全审计

## 何时退出

- 认证方案已定
- 授权模型已设计
- 敏感数据保护方案已定
- 安全检查清单通过
