# 部署脚本指南 | Deployment Scripts

## 核心目标

提供标准化的部署脚本，确保部署过程可靠、可重复。

## 部署阶段

```markdown
1. 构建 (Build)
2. 测试 (Test)
3. 打包 (Package)
4. 部署 (Deploy)
5. 验证 (Verify)
```

## 部署脚本模板

### 1. 构建脚本

```bash
#!/bin/bash
# build.sh

set -e

echo "=== 构建开始 ==="

# 安装依赖
npm ci

# 构建
npm run build

# 单元测试
npm run test:unit

echo "=== 构建完成 ==="
```

### 2. 部署脚本

```bash
#!/bin/bash
# deploy.sh

set -e

ENV=$1  # staging / production
VERSION=$2

echo "=== 部署开始 ==="
echo "环境: $ENV"
echo "版本: $VERSION"

# 拉取最新代码
git pull origin main

# 安装依赖
npm ci

# 构建
npm run build:$ENV

# 运行数据库迁移
npm run migrate:$ENV

# 重启服务
pm2 restart app --update-env

# 验证部署
curl -f https://api.example.com/health || exit 1

echo "=== 部署完成 ==="
```

### 3. 回滚脚本

```bash
#!/bin/bash
# rollback.sh

set -e

VERSION=$1  # 要回滚到的版本

echo "=== 回滚开始 ==="
echo "目标版本: $VERSION"

# 切换到目标版本
git checkout $VERSION

# 重新构建
npm ci
npm run build

# 重启服务
pm2 restart app

# 验证
curl -f https://api.example.com/health || exit 1

echo "=== 回滚完成 ==="
```

## Docker 部署

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

## Kubernetes 部署

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

## 部署检查清单

- [ ] 构建成功
- [ ] 测试全部通过
- [ ] 迁移脚本已执行
- [ ] 配置正确
- [ ] 健康检查通过
- [ ] 监控已启用

## 何时退出

- 部署脚本可重复执行
- 有回滚方案
- 部署过程被监控
- 有部署日志
