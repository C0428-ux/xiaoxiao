# Deployment Scripts Guide | Deployment Scripts

## Core Objective

Provide standardized deployment scripts to ensure reliable, repeatable deployment processes.

## Deployment Phases

```markdown
1. Build
2. Test
3. Package
4. Deploy
5. Verify
```

## Deployment Script Templates

### 1. Build Script

```bash
#!/bin/bash
# build.sh

set -e

echo "=== Build Started ==="

# Install dependencies
npm ci

# Build
npm run build

# Unit tests
npm run test:unit

echo "=== Build Complete ==="
```

### 2. Deploy Script

```bash
#!/bin/bash
# deploy.sh

set -e

ENV=$1  # staging / production
VERSION=$2

echo "=== Deployment Started ==="
echo "Environment: $ENV"
echo "Version: $VERSION"

# Pull latest code
git pull origin main

# Install dependencies
npm ci

# Build
npm run build:$ENV

# Run database migrations
npm run migrate:$ENV

# Restart service
pm2 restart app --update-env

# Verify deployment
curl -f https://api.example.com/health || exit 1

echo "=== Deployment Complete ==="
```

### 3. Rollback Script

```bash
#!/bin/bash
# rollback.sh

set -e

VERSION=$1  # version to rollback to

echo "=== Rollback Started ==="
echo "Target version: $VERSION"

# Switch to target version
git checkout $VERSION

# Rebuild
npm ci
npm run build

# Restart service
pm2 restart app

# Verify
curl -f https://api.example.com/health || exit 1

echo "=== Rollback Complete ==="
```

## Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

```bash
# docker-build.sh
docker build -t myapp:$VERSION .
docker push myapp:$VERSION
```

## Kubernetes Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
```

## Deployment Checklist

- [ ] Build succeeded
- [ ] All tests passed
- [ ] Migration scripts executed
- [ ] Configuration correct
- [ ] Health check passed
- [ ] Monitoring enabled

## When to Exit

- Deployment scripts are repeatable
- Rollback plan exists
- Deployment process is monitored
- Deployment logs are available
