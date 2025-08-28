# Coshub API 服务

## 环境配置

### 1. 环境变量设置

复制 `env.sample` 为 `.env` 并配置相应的环境变量：

```bash
cp env.sample .env
```

### 2. 环境变量说明

#### 基础配置
- `NODE_ENV`: 应用环境 (development/production)
- `PORT`: API 服务端口 (默认: 3001)

#### 数据库配置
- `DATABASE_URL`: PostgreSQL 连接字符串
  ```
  postgresql://用户名:密码@主机:端口/数据库名
  ```

#### 对象存储配置 (MinIO)
- `MINIO_ENDPOINT`: MinIO 服务地址
- `MINIO_ACCESS_KEY`: MinIO 访问密钥
- `MINIO_SECRET_KEY`: MinIO 密钥
- `MINIO_BUCKET`: 存储桶名称

#### 上传限制配置
- `UPLOAD_MAX_FILE_SIZE`: 单文件最大大小 (字节)
- `UPLOAD_ALLOWED_IMAGES`: 允许的图片格式 (逗号分隔)
- `UPLOAD_MAX_FILES`: 单次最大上传文件数
- `UPLOAD_PRESIGN_EXPIRES`: 预签名URL有效期 (秒)

## 本地开发

### 1. 启动基础设施

确保 Docker 服务已启动，然后运行：

```bash
# 在项目根目录
cd ../../
bash scripts/docker-start.sh
```

这将启动：
- PostgreSQL (端口: 5432)
- Redis (端口: 6379)  
- MinIO (端口: 9000)
- 管理界面 (PgAdmin: 5050, Redis Commander: 8081, MinIO Console: 9001)

### 2. 数据库初始化

```bash
# 生成 Prisma 客户端
npm run db:generate

# 运行数据库迁移
npm run db:migrate

# 填充种子数据
npm run db:seed
```

### 3. 启动 API 服务

```bash
npm run dev
```

API 服务将在 http://localhost:3001 启动。

## API 端点

### 技能帖管理
- `GET /api/skill-posts` - 获取技能帖列表
- `POST /api/skill-posts` - 创建技能帖
- `GET /api/skill-posts/:id` - 获取技能帖详情
- `GET /api/skill-posts/meta/cities` - 获取城市列表
- `GET /api/skill-posts/meta/tags` - 获取热门标签

### 文件上传
- `POST /api/upload/presign` - 获取单文件上传预签名URL
- `POST /api/upload/presign/batch` - 获取批量上传预签名URL
- `DELETE /api/upload/file` - 删除文件
- `GET /api/upload/file/info` - 获取文件信息
- `GET /api/upload/config` - 获取上传配置
- `GET /api/upload/health` - 上传服务健康检查

### 系统健康检查
- `GET /api/healthz` - 系统健康检查

## 上传流程

### 1. 获取上传预签名URL

```http
POST /api/upload/presign
Content-Type: application/json

{
  "filename": "avatar.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 102400
}
```

响应：
```json
{
  "success": true,
  "data": {
    "uploadUrl": "http://localhost:9000/coshub-uploads/...",
    "fields": {...},
    "fileUrl": "http://localhost:9000/coshub-uploads/...",
    "filename": "1234567890-abc123.jpg",
    "expires": 1640995200000
  }
}
```

### 2. 使用预签名URL上传文件

```http
PUT {uploadUrl}
Content-Type: {mimeType}
Content-Length: {fileSize}

{文件二进制数据}
```

### 3. 使用返回的fileUrl

上传成功后，使用返回的 `fileUrl` 保存到技能帖或其他业务数据中。

## 数据库管理

### 常用命令

```bash
# 查看数据库状态
npm run db:studio

# 重置数据库
npm run db:reset

# 创建新迁移
npx prisma migrate dev --name 迁移名称

# 手动运行种子数据
npm run db:seed
```

### 访问管理界面

- **PgAdmin**: http://localhost:5050
  - 邮箱: admin@coshub.com
  - 密码: admin123

- **MinIO Console**: http://localhost:9001
  - 用户名: minioadmin
  - 密码: minioadmin

- **Redis Commander**: http://localhost:8081

## 故障排除

### 1. 数据库连接失败
- 检查 PostgreSQL 容器是否正常运行
- 确认 `DATABASE_URL` 配置正确
- 检查防火墙和网络连接

### 2. MinIO 连接失败
- 检查 MinIO 容器是否正常运行
- 确认 MinIO 配置参数正确
- 检查存储桶是否已创建

### 3. 上传失败
- 检查文件大小和类型限制
- 确认预签名URL未过期
- 检查 MinIO 存储桶权限

### 4. 种子数据问题
- 确保数据库已正确迁移
- 检查用户表是否存在数据
- 手动运行种子脚本并查看错误信息

## 开发注意事项

1. **类型安全**: 所有API都使用 `@coshub/types` 包的类型定义
2. **错误处理**: 统一使用 `ApiResponse` 格式返回
3. **验证**: 使用 `class-validator` 进行请求验证
4. **数据库**: 使用 Prisma ORM，避免直接SQL查询
5. **文件存储**: 使用预签名URL，避免服务器中转文件
6. **权限**: 当前使用临时用户ID，后续需集成JWT认证
