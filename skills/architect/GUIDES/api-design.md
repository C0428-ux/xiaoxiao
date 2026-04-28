# API Design Guide | API Design

## Core Objective

Design clear, consistent, and easy-to-use API interfaces.

## RESTful API Basics

### Resource Naming

```
# Good naming
GET  /users          # User list
GET  /users/{id}     # Single user
POST /users          # Create user
PUT  /users/{id}     # Update user
DELETE /users/{id}   # Delete user

# Avoid
GET /getUsers
GET /fetchUser?id=1
POST /createUser
```

### HTTP Method Mapping

| Method | Purpose | Idempotent | Body |
|--------|---------|------------|------|
| GET | Query | Yes | No |
| POST | Create | No | Yes |
| PUT | Full update | Yes | Yes |
| PATCH | Partial update | No | Yes |
| DELETE | Delete | Yes | No |

## API Design Principles

### 1. Consistency

```markdown
## User related
GET    /users
POST   /users
GET    /users/{id}
PUT    /users/{id}
DELETE /users/{id}

## Order related (maintain consistency)
GET    /orders
POST   /orders
GET    /orders/{id}
PUT    /orders/{id}
DELETE /orders/{id}
```

### 2. Clear Status Codes

| Status Code | Meaning | Scenario |
|-------------|---------|----------|
| 200 | Success | Normal return |
| 201 | Created | POST creates new resource |
| 204 | No content | DELETE success |
| 400 | Client error | Parameter error |
| 401 | Unauthorized | Not logged in |
| 403 | Forbidden | No permission |
| 404 | Not found | Resource does not exist |
| 500 | Server error | Server exception |

### 3. Error Response Format

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User does not exist",
    "details": {
      "userId": 12345
    }
  }
}
```

## Authentication and Authorization

### Bearer Token

```markdown
Authorization: Bearer <token>
```

### API Key (Internal Services)

```markdown
X-API-Key: <api-key>
```

## Versioning

```markdown
# URL version
GET /v1/users
GET /v2/users

# Header version (not recommended)
Accept: application/vnd.api+json;version=2
```

## Pagination and Filtering

### Pagination

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

### Filtering

```markdown
GET /users?status=active&role=admin
GET /orders?created_after=2024-01-01
```

## Rate Limiting

```markdown
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

## When to Exit

- API structure is finalized
- Naming conventions are consistent
- Error codes are standardized
- Documentation is complete
