# Coshub 基础设施

本目录包含 Coshub 项目的本地开发基础设施配置，包括数据库、缓存、对象存储等服务。

## 📦 包含的服务

### 🗄️ PostgreSQL 数据库
- **端口**: 5432
- **数据库名**: coshub
- **用户名**: coshub
- **密码**: ${POSTGRES_PASSWORD:-coshub_password} (生产环境请修改)
- **用途**: 主数据库，存储用户、帖子、请求等业务数据

### 🚀 Redis 缓存
- **端口**: 6379
- **密码**: ${REDIS_PASSWORD:-coshub_redis_password} (生产环境请修改)
- **用途**: 缓存、会话存储、消息队列

### 📁 MinIO 对象存储
- **API 端口**: 9000
- **Console 端口**: 9001
- **Access Key**: ${MINIO_ROOT_USER:-coshub_minio_user}
- **Secret Key**: ${MINIO_ROOT_PASSWORD:-coshub_minio_password}
- **用途**: 文件存储（图片、视频、文档等）

### 🔧 管理工具
- **PgAdmin** (端口 5050): PostgreSQL 管理界面
- **Redis Commander** (端口 8081): Redis 管理界面

## 🚀 快速启动

### 启动所有服务
```bash
# 进入 Docker 目录
cd infra/docker

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 开发环境启动
```bash
# 使用开发环境配置（简化密码）
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### 停止服务
```bash
# 停止所有服务
docker-compose down

# 停止并删除数据卷（注意：会丢失所有数据）
docker-compose down -v
```

## 🔗 连接信息

### 应用程序连接字符串

#### PostgreSQL
```bash
# 生产环境
DATABASE_URL="postgresql://coshub:${POSTGRES_PASSWORD:-coshub_password}@localhost:5432/coshub"

# 开发环境
DATABASE_URL="postgresql://coshub:${POSTGRES_PASSWORD:-dev_password}@localhost:5432/coshub"
```

#### Redis
```bash
# 生产环境
REDIS_URL="redis://:${REDIS_PASSWORD:-coshub_redis_password}@localhost:6379"

# 开发环境
REDIS_URL="redis://:${REDIS_PASSWORD:-dev_redis_password}@localhost:6379"
```

#### MinIO
```bash
# 生产环境
MINIO_ENDPOINT="localhost:9000"
MINIO_ACCESS_KEY="${MINIO_ROOT_USER:-coshub_minio_user}"
MINIO_SECRET_KEY="${MINIO_ROOT_PASSWORD:-coshub_minio_password}"

# 开发环境
MINIO_ENDPOINT="localhost:9000"
MINIO_ACCESS_KEY="${MINIO_ROOT_USER:-dev_user}"
MINIO_SECRET_KEY="${MINIO_ROOT_PASSWORD:-dev_password}"
```

## 🌐 Web 管理界面

| 服务 | 地址 | 用户名 | 密码 |
|------|------|--------|------|
| MinIO Console | http://localhost:9001 | ${MINIO_ROOT_USER:-coshub_minio_user} | ${MINIO_ROOT_PASSWORD:-coshub_minio_password} |
| PgAdmin | http://localhost:5050 | admin@coshub.local | ${PGADMIN_PASSWORD:-pgadmin_password} |
| Redis Commander | http://localhost:8081 | - | - |

*开发环境密码请参考 docker-compose.dev.yml 文件*

## 📝 使用说明

### 1. 首次启动
```bash
# 1. 复制环境变量配置
cp .env.example .env

# 2. 修改配置文件（可选）
nano .env

# 3. 启动服务
docker-compose up -d

# 4. 等待服务就绪
docker-compose logs postgres redis minio
```

### 2. 数据库操作
```bash
# 连接到 PostgreSQL
docker-compose exec postgres psql -U coshub -d coshub

# 导入 SQL 文件
docker-compose exec -T postgres psql -U coshub -d coshub < backup.sql

# 创建数据库备份
docker-compose exec postgres pg_dump -U coshub -d coshub > backup.sql
```

### 3. Redis 操作
```bash
# 连接到 Redis
docker-compose exec redis redis-cli -a ${REDIS_PASSWORD:-coshub_redis_password}

# 查看 Redis 信息
docker-compose exec redis redis-cli -a ${REDIS_PASSWORD:-coshub_redis_password} info
```

### 4. MinIO 操作
```bash
# 创建存储桶
curl -X PUT http://localhost:9000/coshub-files \
  -H "Authorization: AWS4-HMAC-SHA256 ..."

# 或者通过 Web 界面管理: http://localhost:9001
```

## 🔧 配置文件说明

- `docker-compose.yml`: 主配置文件
- `docker-compose.dev.yml`: 开发环境覆盖配置
- `redis.conf`: Redis 配置文件
- `.env.example`: 环境变量示例
- `init-scripts/`: 数据库初始化脚本

## ⚠️ 注意事项

1. **生产环境**: 请修改所有默认密码
2. **数据持久化**: 数据存储在 Docker 数据卷中，停止容器不会丢失数据
3. **网络安全**: 生产环境请配置防火墙，不要暴露不必要的端口
4. **备份策略**: 定期备份数据库和重要文件
5. **资源限制**: 根据服务器配置调整内存和 CPU 限制

## 🐛 故障排除

### 端口冲突
```bash
# 检查端口占用
lsof -i :5432
lsof -i :6379
lsof -i :9000

# 修改 docker-compose.yml 中的端口映射
```

### 权限问题
```bash
# 修复数据卷权限
sudo chown -R 999:999 volumes/postgres
sudo chown -R 1000:1000 volumes/minio
```

### 服务无法启动
```bash
# 查看详细日志
docker-compose logs [service_name]

# 重新构建并启动
docker-compose down
docker-compose up -d --force-recreate
```
