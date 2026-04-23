# API 设计指南 | API Design

## 核心目标

设计清晰、一致、易用的 API 接口。

## RESTful API 基础

### 资源命名

```
# 好的命名
GET  /users          # 用户列表
GET  /users/{id}     # 单个用户
POST /users          # 创建用户
PUT  /users/{id}     # 更新用户
DELETE /users/{id}   # 删除用户

# 避免
GET /getUsers
GET /fetchUser?id=1
POST /createUser
```

### HTTP 方法对应

| 方法 | 用途 | 幂等 |  Body |
|------|------|------|-------|
| GET | 查询 | 是 | 无 |
| POST | 创建 | 否 | 有 |
| PUT | 全量更新 | 是 | 有 |
| PATCH | 部分更新 | 否 | 有 |
| DELETE | 删除 | 是 | 无 |

## API 设计原则

### 1. 一致性

```markdown
## 用户相关
GET    /users
POST   /users
GET    /users/{id}
PUT    /users/{id}
DELETE /users/{id}

## 订单相关（保持一致）
GET    /orders
POST   /orders
GET    /orders/{id}
PUT    /orders/{id}
DELETE /orders/{id}
```

### 2. 清晰的状态码

| 状态码 | 含义 | 场景 |
|--------|------|------|
| 200 | 成功 | 正常返回 |
| 201 | 创建成功 | POST 创建新资源 |
| 204 | 无内容 | DELETE 成功 |
| 400 | 客户端错误 | 参数错误 |
| 401 | 未认证 | 没登录 |
| 403 | 无权限 | 没权限 |
| 404 | 不存在 | 资源不存在 |
| 500 | 服务端错误 | 服务器异常 |

### 3. 错误响应格式

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "用户不存在",
    "details": {
      "userId": 12345
    }
  }
}
```

## 认证与授权

### Bearer Token

```markdown
Authorization: Bearer <token>
```

### API Key（内部服务）

```markdown
X-API-Key: <api-key>
```

## 版本管理

```markdown
# URL 版本
GET /v1/users
GET /v2/users

# Header 版本（不推荐）
Accept: application/vnd.api+json;version=2
```

## 分页与过滤

### 分页

```markdown
GET /users?page=2&per_page=20

Response:
{
  "data": [...],
  "pagination": {
    "page": 2,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### 过滤

```markdown
GET /users?status=active&role=admin
GET /orders?created_after=2024-01-01
```

## 速率限制

```markdown
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

## API