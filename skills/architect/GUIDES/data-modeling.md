# Data Modeling Guide | Data Modeling

## Core Objective

Design reasonable data models that support business requirements while maintaining scalability.

## Database Type Selection

### Relational (SQL)

**Applicable Scenarios**:
- Stable data structure
- High transaction requirements (ACID)
- Many complex queries
- Complex relationships

**Representative Products**: PostgreSQL, MySQL

### Document-Oriented (NoSQL)

**Applicable Scenarios**:
- Flexible data structure
- Read-heavy, write-light
- No complex relationships needed
- Horizontal scaling requirements

**Representative Products**: MongoDB, DynamoDB

### Key-Value (KV)

**Applicable Scenarios**:
- Caching
- Session storage
- Configuration
- Simple queries

**Representative Products**: Redis, Memcached

### Time-Series (TSDB)

**Applicable Scenarios**:
- Monitoring metrics
- IoT data
- Log data

**Representative Products**: InfluxDB, TimescaleDB

## Modeling Steps

### 1. Identify Entities

```
Users, Orders, Products, Reviews...
```

### 2. Determine Relationships

| Relationship | Example |
|--------------|---------|
| One-to-One | User ↔ User Details |
| One-to-Many | User → Orders |
| Many-to-Many | User ←→ Roles |

### 3. Define Attributes

```markdown
## User
- id: UUID (PK)
- email: String (Unique)
- name: String
- created_at: Timestamp
- updated_at: Timestamp

## Order
- id: UUID (PK)
- user_id: UUID (FK → User)
- status: Enum
- total_amount: Decimal
- created_at: Timestamp
```

## Normalization vs Denormalization

### Normalization (3NF)

```
Advantages: No data redundancy, fast updates
Disadvantages: Queries may require multiple table JOINs
```

### Denormalization

```
Advantages: Fast queries, fewer JOINs
Disadvantages: Data redundancy, complex updates
```

**Recommendation**: Start with normalization, denormalize when necessary

## Index Design

### When to Create Indexes

- Fields commonly used in WHERE conditions
- JOIN fields
- ORDER BY fields

### Index Types

| Type | Applicable Scenarios |
|------|---------------------|
| B-tree | Range queries, sorting |
| Hash | Equality queries |
| GIN | Full-text search, JSON |
| GiST | Geospatial data |

## Migration Strategy

### Principles

1. **Backward Compatibility**: New and old code run simultaneously
2. **Small Steps**: Only change one small thing at a time
3. **Rollback Preparation**: Prepare rollback scripts

### Migration Steps

```markdown
1. Add new field (nullable)
2. Deploy new code (write to both old and new fields)
3. Data migration (run script in background)
4. Verify data consistency
5. Remove old field
```

## Data Retention

Plan data retention strategy in advance:

```markdown
## Data Retention Policy

| Data Type | Retention Period | Handling |
|-----------|------------------|----------|
| Behavioral logs | 30 days | Delete |
| Transaction data | Permanent | Archive |
| User uploads | Until user deletes | Cascade delete |
| Session data | 7 days | Redis TTL |
```

## When to Exit

- Data model is finalized
- Relationships are clear and unambiguous
- Indexes are designed
- Migration strategy is planned
