# Security Architecture Guide | Security Architecture

## Core Objective

Design a secure and reliable system architecture to protect user data and system resources.

## Security Principles

### 1. Least Privilege

```
Each module/user only gets the minimum privileges needed to complete their work
```

### 2. Defense in Depth

```
Don't rely on a single security measure, use multiple layers of protection
```

### 3. Secure by Default

```
Security should be the default configuration, not an optional configuration
```

## Authentication Design

### Password Storage

```markdown
# Wrong way
Store password directly → Password leak

# Correct way
Password + salt → hash → storage
```

### Token Design

```markdown
## Access Token
- Validity: 15 minutes
- Storage: Memory (not persisted)

## Refresh Token
- Validity: 7 days
- Storage: HttpOnly Cookie or secure storage
```

### OAuth 2.0

```
User → Authorization server → Authorization code → Your server → Exchange for Token
```

## Authorization Design

### RBAC (Role-Based Access Control)

```markdown
## Roles
- Admin: All permissions
- Editor: Create, update, delete
- Viewer: Read-only

## User ↔ Role ↔ Permission
```

### Resource-Level Permissions

```markdown
# User can only access their own resources
GET /users/{userId}/orders
→ Verify userId === currently logged-in user
```

## Data Protection

### Transport Encryption

```
HTTPS (TLS 1.2+) for all traffic
```

### Sensitive Data Encryption

```markdown
## Need encryption
- Passwords
- API Keys
- ID card numbers
- Bank card numbers

## Encryption methods
- Storage: AES-256
- Transport: TLS
```

### Data Masking

```markdown
## Log masking
Phone: 138****5678
ID card: 320****1234

## API response masking
Return minimum necessary data
```

## Common Attack Prevention

### SQL Injection

```markdown
# Wrong
query = "SELECT * FROM users WHERE id = " + id

# Correct - Parameterized query
query = "SELECT * FROM users WHERE id = $1" + [id]
```

### XSS

```markdown
# Escape on output
User input → Escape → Store → Escape → Output
```

### CSRF

```markdown
# Use SameSite Cookie
Set-Cookie: session=xxx; SameSite=Strict

# CSRF Token
Form includes CSRF Token
```

## Security Checklist

- [ ] Enforce HTTPS
- [ ] Password hash + salt
- [ ] Token has expiration time
- [ ] Least privilege
- [ ] Input validation
- [ ] SQL parameterized queries
- [ ] Output escaping
- [ ] Security Headers (CSP, X-Frame-Options, etc.)
- [ ] Log exceptions
- [ ] Regular security audits

## When to Exit

- Authentication scheme is finalized
- Authorization model is designed
- Sensitive data protection plan is finalized
- Security checklist passed
