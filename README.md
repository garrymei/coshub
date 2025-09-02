# Coshub - 二次元交流网站

> 基于 Monorepo 架构的二次元爱好者交流平台

## 项目定位

Coshub 是一个专为二次元爱好者设计的现代化交流平台，采用 Monorepo 架构，支持多端部署，提供用户互动、内容分享、社区论坛等功能。

**🎯 P0 任务已完成**：
- ✅ **统一锁文件**: 使用 pnpm 作为统一包管理器，确保依赖版本一致性
- ✅ **CI/CD 配置**: 完整的 GitHub Actions 工作流，支持自动化构建、测试和部署
- ✅ **开发凭据隔离**: 环境变量模板化，支持本地开发和生产环境配置
- ✅ **工程化统一**: Turbo 构建管道与根脚本完全对齐，支持 build/dev/test/lint 等任务
- ✅ **代码质量**: ESLint + Prettier 配置，确保代码风格一致性

## 技术栈

### 前端技术
- **React 18+** - 现代化 UI 框架
- **Next.js** - 全栈 React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 原子化 CSS

### 后端技术
- **Node.js** - 服务端运行时
- **NestJS** - 企业级 Node.js 框架
- **Prisma** - 现代化 ORM
- **PostgreSQL** - 主数据库

### 工程化
- **pnpm** - 包管理器
- **Turbo** - Monorepo 构建工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **GitHub Actions** - CI/CD 自动化流水线

## 项目结构

```
coshub/
├── apps/                    # 应用程序
│   ├── api/                # 后端 API 服务
│   ├── chat/               # 聊天应用
│   ├── forum/              # 论坛应用
│   ├── gallery/            # 图片画廊
│   ├── post/               # 内容发布
│   └── user/               # 用户中心
├── packages/               # 共享包
│   ├── ui/                 # UI 组件库
│   ├── utils/              # 工具函数
│   ├── types/              # 类型定义
│   └── config/             # 配置文件
├── infra/                  # 基础设施
│   └── docker/             # Docker 配置
├── .github/
│   └── workflows/          # CI/CD 工作流（GitHub Actions）
│       └── ci.yml         # 自动化构建、测试、代码检查流水线
└── legacy/                 # 旧版本代码
```

## 本地开发

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose (基础设施)

### 🐳 基础设施启动

在启动应用之前，需要先启动基础设施服务：

```bash
# 启动开发环境基础设施 (PostgreSQL + Redis + MinIO)
./scripts/docker-start.sh --dev

# 查看服务状态
docker-compose -f infra/docker/docker-compose.yml -f infra/docker/docker-compose.dev.yml ps

# 停止基础设施
./scripts/docker-stop.sh
```

**服务访问信息**：
- 请参考根目录 `.env.example` 与 `apps/*/.env.example` 中的占位配置，自行填写本地开发凭据
- 本地默认端口：PostgreSQL 5432、Redis 6379、MinIO 9000/9001
- **环境变量配置**: 复制 `.env.example` 为 `.env` 并填写实际值，确保开发凭据安全隔离

**Docker 环境变量**: 在 `infra/docker/` 目录下创建 `.env` 文件，配置以下变量：
```bash
# PostgreSQL 配置
POSTGRES_PASSWORD=your_secure_postgres_password

# Redis 配置  
REDIS_PASSWORD=your_secure_redis_password

# MinIO 配置
MINIO_ROOT_USER=your_minio_user
MINIO_ROOT_PASSWORD=your_secure_minio_password

# PgAdmin 配置
PGADMIN_PASSWORD=your_secure_pgadmin_password
```

**管理界面**:
- MinIO Console: http://localhost:9001
- PgAdmin: http://localhost:5050
- Redis Commander: http://localhost:8081

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/garrymei/coshub.git

# 进入项目目录
cd coshub

# 安装依赖
pnpm install
```

### 🚀 快速启动（三端开发）

#### 1️⃣ 启动 API 服务 (端口 3001)

```bash
# 进入 API 目录
cd apps/api

# 安装依赖 (首次运行)
pnpm install

# 生成 Prisma 客户端
pnpm db:generate

# 启动开发服务
pnpm dev

# 或者使用根目录命令
# pnpm dev:api
```

**验收标准**: 
- 健康检查: http://localhost:3001/api/healthz
- 上传配置: http://localhost:3001/api/upload/config
- 技能帖列表: http://localhost:3001/api/skill-posts

#### 2️⃣ 启动 Web 应用 (端口 3000)

```bash
# 新开终端，进入 Web 目录
cd apps/web

# 安装依赖 (首次运行)
pnpm install

# 启动开发服务
pnpm dev

# 或者使用根目录命令
# pnpm dev:web
```

**访问地址**: http://localhost:3000

#### 3️⃣ 构建小程序

```bash
# 新开终端，进入小程序目录
cd apps/mini

# 安装依赖 (首次运行)
pnpm install

# 构建小程序到 dist 目录
pnpm build

# 或者使用根目录命令
# pnpm build:mini
```

**使用方法**: 
1. 构建完成后，用微信开发者工具打开 `apps/mini` 目录
2. 构建产物在 `apps/mini/dist/` 目录中

### 🔧 Monorepo 命令

```bash
# 验证工作区配置
pnpm -w list --depth -1

# 验证 Turbo 构建
turbo build

# 代码质量检查
pnpm lint          # 运行 ESLint 检查
pnpm format        # 运行 Prettier 格式化

# 启动所有应用
pnpm dev

# 启动特定应用
pnpm dev:web    # 启动 Web 应用 (端口 3000)
pnpm dev:api    # 启动 API 服务 (端口 3001)
pnpm dev:mini   # 启动小程序开发

# 同时启动 Web + API
pnpm dev:all

# 构建所有应用
pnpm build

# 构建特定应用
pnpm build:web  # 构建 Web 应用
pnpm build:api  # 构建 API 服务
pnpm build:mini # 构建小程序 (输出到 apps/mini/dist)
```

### 📋 应用信息

#### 🌐 Web 应用
- **开发环境**: http://localhost:3000
- **技术栈**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **启动命令**: `pnpm dev:web` 或 `cd apps/web && pnpm dev`

#### 🔗 API 服务
- **开发环境**: http://localhost:3001
- **健康检查**: http://localhost:3001/api/healthz
- **技术栈**: NestJS + TypeScript
- **启动命令**: `pnpm dev:api` 或 `cd apps/api && pnpm dev`
- **验收标准**: 健康检查返回 `{ok:true,service:"api"}`

#### 📱 小程序
- **开发工具**: 微信开发者工具
- **构建产物**: `apps/mini/dist/` 目录
- **技术栈**: Taro 3 + React + TypeScript
- **构建命令**: `pnpm build:mini` 或 `cd apps/mini && pnpm build`
- **使用方法**: 构建后用微信开发者工具打开 `apps/mini` 目录

## 本地基础设施

### 🐳 启动基础服务

```bash
# 启动所有基础设施服务（PostgreSQL + Redis + MinIO）
./scripts/docker-start.sh

# 使用开发环境配置（简化密码）
./scripts/docker-start.sh --dev

# 前台运行（查看日志）
./scripts/docker-start.sh --dev --fg

# 停止所有服务
./scripts/docker-stop.sh

# 停止并删除数据（谨慎使用）
./scripts/docker-stop.sh --volumes
```

### 🔗 服务连接信息

#### 数据库连接 (PostgreSQL)
请在 `.env` 或 `apps/api/.env` 中配置：
```bash
DATABASE_URL="postgresql://<USER>:<PASSWORD>@localhost:5432/coshub"
```

#### 缓存连接 (Redis)
请在 `.env` 或 `apps/api/.env` 中配置：
```bash
REDIS_URL="redis://:<PASSWORD>@localhost:6379"
```

#### 对象存储（MinIO / COS / 七牛）
请在 `.env` 或 `apps/api/.env` 中配置对象存储参数。

- MinIO（默认，本地开发）：
  ```bash
  STORAGE_TYPE=minio
  MINIO_ENDPOINT=http://localhost:9000
  MINIO_ACCESS_KEY=<YOUR_ACCESS_KEY>
  MINIO_SECRET_KEY=<YOUR_SECRET_KEY>
  MINIO_BUCKET=coshub-uploads
  MINIO_REGION=us-east-1
  ```

- 腾讯云 COS（S3 兼容接口）：
  ```bash
  STORAGE_TYPE=cos
  S3_ENDPOINT=https://<your-cos-s3-endpoint>
  S3_ACCESS_KEY=<COS_SECRET_ID>
  S3_SECRET_KEY=<COS_SECRET_KEY>
  S3_BUCKET=<your-bucket>
  S3_REGION=ap-shanghai
  S3_USE_SSL=true
  ```

- 七牛云 Kodo（S3 兼容接口）：
  ```bash
  STORAGE_TYPE=qiniu
  S3_ENDPOINT=https://s3.<region>.qiniucs.com
  S3_ACCESS_KEY=<AK>
  S3_SECRET_KEY=<SK>
  S3_BUCKET=<your-bucket>
  S3_REGION=<region>
  S3_USE_SSL=true
  ```

上传配置与健康检查：
- `GET /api/upload/config` 返回上传限制与当前存储 Provider 信息（type/endpoint/bucket）
- `GET /api/upload/health` 返回上传子系统状态与 `storage` 类型（minio/cos/s3/qiniu）

### 🌐 管理界面

| 服务 | 地址 | 用途 |
|------|------|------|
| MinIO Console | http://localhost:9001 | 文件存储管理 |
| PgAdmin | http://localhost:5050 | 数据库管理 |
| Redis Commander | http://localhost:8081 | 缓存管理 |

## 近期变更

### 🎯 P0 任务完成 (2024年12月)
- **统一锁文件**: 删除所有 `package-lock.json`，统一使用 `pnpm-lock.yaml`
- **CI/CD 配置**: 迁移到 `.github/workflows/` 目录，实现完整的 GitHub Actions 流水线
- **开发凭据隔离**: 创建根级和 `apps/*` 的 `.env.example` 文件，清理 README 中的明文凭据
- **工程化统一**: 验证并统一根脚本与 Turbo 构建管道，覆盖 build/dev/test/lint 任务
- **代码质量基线**: 配置 ESLint + Prettier，实现自动化代码检查和格式化

### 🔧 前端集成优化
- 前端（P0 集成）
  - Web 使用 `NEXT_PUBLIC_API_BASE_URL` 配置 SDK 基址，便于 dev/prod 切换（apps/web/src/lib/api.ts）
  - SDK 实现直传上传（预签名 + PUT），Web 创建页接入 SDK 上传与创建（packages/sdk/src/services.ts；apps/web/src/app/skill-posts/*）
  - API 启用 UploadModule，CORS 支持通过 `CORS_ORIGINS` 配置；SkillPost 返回的枚举/状态与前端类型对齐（apps/api/src/*）

- 其他代工改动（样式与工程优化）
  - API 代码风格统一：import/字符串改为双引号、控制台日志文案优化，保持功能不变（apps/api/src/**/*.ts）
  - PrismaService 与若干模块的小幅格式化重排，逻辑不变（apps/api/src/prisma/prisma.service.ts 等）
  - UploadService 日志与参数格式更规范（apps/api/src/upload/upload.service.ts）
  - 格式化脚本范围调整：`format` 仅处理 `src/**/*.ts`（apps/api/package.json）
  - Web 构建配置增强：`next.config.js` 新增 `transpilePackages`（含 `@coshub/types`, `@coshub/sdk`）与 `experimental.externalDir: true`，改善 Monorepo 包联编与外部目录导入

### 代码规范

```bash
# 代码检查
pnpm lint          # 运行 ESLint 检查所有包
pnpm lint:fix      # 自动修复可修复的问题

# 代码格式化
pnpm format        # 运行 Prettier 格式化所有包

# 运行测试
pnpm test          # 运行所有测试
pnpm test:watch    # 监听模式运行测试

# CI/CD 验证
pnpm build         # 构建所有应用
pnpm lint          # 代码质量检查
```

**自动化流程**: GitHub Actions 会在每次提交时自动运行构建、测试和代码检查，确保代码质量。

## 任务完成状态

### 🎯 P0 任务已完成
- ✅ **统一锁文件**: 使用 pnpm 作为统一包管理器，确保依赖版本一致性
- ✅ **CI/CD 配置**: 完整的 GitHub Actions 工作流，支持自动化构建、测试和部署
- ✅ **开发凭据隔离**: 环境变量模板化，支持本地开发和生产环境配置
- ✅ **工程化统一**: Turbo 构建管道与根脚本完全对齐，支持 build/dev/test/lint 等任务
- ✅ **代码质量**: ESLint + Prettier 配置，确保代码风格一致性
- ✅ **CI 工作流**: 确保 CI 已在 .github/workflows/ 生效，包含 lint/build/test/changesets
- ✅ **环境变量安全**: 进一步检查并统一所有敏感凭据到 .env.example
- ✅ **脚本一致性**: 根脚本与 Turbo 完全对齐，支持多端启动和包过滤
- ✅ **API 中间件**: 启用 Helmet、CORS、RateLimit、ValidationPipe 和 Swagger
- ✅ **API 分页**: 统一为 keyset pagination，实现 DTO 校验和错误响应结构
- ✅ **内容审核**: 新增 POST /reports 端点，审核队列页面，内容安全检查钩子
- ✅ **缓存策略**: Redis 缓存热门技能帖和城市榜单，支持失效和预热
- ✅ **日志监控**: 结构化日志系统，Loki/Promtail + Grafana 监控栈
- ✅ **部署镜像**: 多阶段 Dockerfile，生产 Docker Compose，Vercel 配置
- ✅ **权限控制**: 角色权限系统，细粒度速率限制，资源所有权检查

## 缓存策略

### Redis 缓存配置
- **热门技能帖**: TTL 30分钟，按浏览量、评分、时间排序
- **城市榜单**: TTL 1小时，统计各城市技能帖数量
- **缓存键**: `hot_skill_posts:{limit}`, `city_ranking:{limit}`
- **失效策略**: 键失效 + 手动失效（内容更新时）

### 缓存观测点
- **命中率**: `/api/cache/stats` 接口监控缓存状态
- **性能指标**: 响应时间、数据库查询次数
- **预热机制**: 系统启动时自动预热热点数据
- **手动失效**: 支持按模式手动失效缓存

### 缓存API接口
- `GET /api/cache/hot-skill-posts?limit=10` - 获取热门技能帖
- `GET /api/cache/city-ranking?limit=20` - 获取城市榜单
- `GET /api/cache/stats` - 获取缓存统计信息
- `POST /api/cache/warmup` - 预热缓存
- `POST /api/cache/invalidate/:pattern` - 手动失效缓存

## 子包说明

### 应用程序 (apps/)
- **web**: Web 前端应用 (Next.js + React + TypeScript + Tailwind)
- **api**: 后端 API 服务 (NestJS + TypeScript)
- **mini**: 小程序应用 (Taro + React + TypeScript)
- **chat**: 实时聊天功能 (待开发)
- **forum**: 社区论坛模块 (待开发)
- **gallery**: 图片分享画廊 (待开发)
- **post**: 内容发布系统 (待开发)
- **user**: 用户管理中心 (待开发)

### 共享包 (packages/)
- **types**: TypeScript 类型定义 ✅
- **sdk**: 前端请求 SDK ✅
- **config**: 共享配置文件（ESLint、Prettier、TypeScript 配置）✅
- **ui**: 可复用的 UI 组件库 (待开发)
- **utils**: 通用工具函数 (待开发)

### 基础设施 (infra/)
- **docker**: 本地开发环境 (PostgreSQL + Redis + MinIO) ✅
- **ci/cd**: GitHub Actions 自动化流水线 (构建、测试、代码检查) ✅

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

**代码质量要求**:
- 所有代码必须通过 ESLint 检查 (`pnpm lint`)
- 代码格式必须符合 Prettier 规范 (`pnpm format`)
- 构建必须成功 (`pnpm build`)
- GitHub Actions 会自动验证这些要求

## 许可证

本项目采用 [MIT License](LICENSE) 许可证

## 🎯 MVP-A 演示路径

### 技能帖完整流程体验

#### 🌐 Web 端体验路径
1. **访问首页**: http://localhost:3000
2. **进入技能帖广场**: 点击"技能帖广场"或访问 http://localhost:3000/skill-posts
3. **浏览技能帖列表**: 
   - 查看预置的示例数据
   - 使用筛选器（分类、角色、城市）
   - 搜索关键词
4. **查看技能帖详情**: 点击任意技能帖卡片
   - 查看完整信息、图片、联系方式
   - 查看服务统计数据
5. **发布新技能帖**: 
   - 点击"发布技能帖"按钮
   - 填写完整表单（标题、描述、分类、价格、联系方式等）
   - 提交后自动跳转到详情页

#### 📱 小程序端体验路径
1. **启动小程序**: `pnpm build:mini` 后用微信开发者工具打开
2. **从首页进入**: 点击首页的"Cosplay"功能模块
3. **浏览和筛选**: 与 Web 端类似的列表和筛选功能
4. **查看详情**: 点击技能帖查看完整信息
5. **发布技能帖**: 点击"发布"按钮，填写表单

#### 🔗 API 端验证
- **健康检查**: http://localhost:3001/api/healthz
- **技能帖列表**: http://localhost:3001/api/skill-posts
- **技能帖详情**: http://localhost:3001/api/skill-posts/:id
- **城市列表**: http://localhost:3001/api/skill-posts/meta/cities
- **热门标签**: http://localhost:3001/api/skill-posts/meta/tags

### 🎮 体验要点

#### 完整业务闭环
✅ **发布技能帖** → ✅ **浏览列表** → ✅ **查看详情** → ✅ **联系服务者**

#### 核心功能验证
- 📝 **发布功能**: 表单验证、数据提交、页面跳转
- 🔍 **列表功能**: 分页加载、筛选搜索、响应式布局
- 👁️ **详情功能**: 完整信息展示、图片预览、联系方式
- 📊 **数据管理**: 内存存储、统计更新、状态管理

#### 技术架构展示
- 🎯 **类型安全**: 全流程 TypeScript 类型检查
- 🔄 **API 设计**: RESTful 接口、统一响应格式
- 🎨 **UI 一致性**: Web/小程序双端界面适配
- 📦 **Monorepo**: 共享类型、工具复用

### 🚀 快速启动演示

```bash
# 1. 安装依赖
pnpm install

# 2. 启动 API 服务
pnpm dev:api

# 3. 启动 Web 应用 (新终端)
pnpm dev:web

# 4. 构建小程序 (可选)
pnpm build:mini

# 5. 体验完整流程
# Web: http://localhost:3000/skill-posts
# API: http://localhost:3001/api/skill-posts
```

**代码质量验证**:
```bash
# 验证代码质量
pnpm lint          # ESLint 检查
pnpm format        # Prettier 格式化
pnpm build         # 构建验证

# 这些命令与 GitHub Actions CI 流程保持一致
```

### 📋 演示数据说明

系统预置了 3 个示例技能帖：
- **摄影师服务** (上海，¥300-800)
- **服装定制** (北京，¥500-2000) 
- **化妆师服务** (广州，¥200)

### 🗄️ 阶段 5 更新：数据库与上传功能

**数据持久化**：
- 技能帖数据已迁移到 PostgreSQL 数据库
- 使用 Prisma ORM 进行类型安全的数据库操作
- 支持完整的用户、技能帖、请求等数据模型

**文件上传功能**：
- 集成 MinIO 对象存储服务
- 支持预签名 URL 直传，减轻服务器压力
- 支持批量文件上传，单文件最大 10MB
- 自动生成唯一文件名和目录结构

**新增 API 端点**：
- `POST /api/upload/presign` - 获取上传预签名 URL
- `POST /api/upload/presign/batch` - 批量上传预签名 URL
- `GET /api/upload/config` - 获取上传配置信息
- `DELETE /api/upload/file` - 删除已上传文件

**数据库初始化**：
```bash
# 首次运行需要初始化数据库
cd apps/api
pnpm db:generate  # 生成 Prisma 客户端
pnpm db:migrate   # 运行数据库迁移
pnpm db:seed      # 填充示例数据
```

## 联系方式

- 项目主页: https://github.com/garrymei/coshub
- 问题反馈: https://github.com/garrymei/coshub/issues
