# Coshub - 二次元交流网站

> 基于 Monorepo 架构的二次元爱好者交流平台

## 项目定位

Coshub 是一个专为二次元爱好者设计的现代化交流平台，采用 Monorepo 架构，支持多端部署，提供用户互动、内容分享、社区论坛等功能。

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
├── ops/                    # 运维
│   └── ci/                 # CI/CD 配置
└── legacy/                 # 旧版本代码
```

## 本地开发

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/garrymei/coshub.git

# 进入项目目录
cd coshub

# 安装依赖
pnpm install
```

### 启动开发

```bash
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

### 应用访问

#### 🌐 Web 应用
- **开发环境**: http://localhost:3000
- **技术栈**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **启动命令**: `pnpm dev:web`

#### 🔗 API 服务
- **开发环境**: http://localhost:3001
- **健康检查**: http://localhost:3001/api/healthz
- **技术栈**: NestJS + TypeScript
- **启动命令**: `pnpm dev:api`

#### 📱 小程序
- **开发工具**: 微信开发者工具
- **构建产物**: `apps/mini/dist/` 目录
- **技术栈**: Taro 3 + React + TypeScript
- **构建命令**: `pnpm build:mini`
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
```bash
# 开发环境
DATABASE_URL="postgresql://coshub_user:dev123@localhost:5432/coshub"

# 生产环境  
DATABASE_URL="postgresql://coshub_user:coshub_password@localhost:5432/coshub"
```

#### 缓存连接 (Redis)
```bash
# 开发环境
REDIS_URL="redis://:dev123@localhost:6379"

# 生产环境
REDIS_URL="redis://:coshub_redis_password@localhost:6379"
```

#### 对象存储 (MinIO)
```bash
# 开发环境
MINIO_ENDPOINT="localhost:9000"
MINIO_ACCESS_KEY="dev123"
MINIO_SECRET_KEY="dev123456"

# 生产环境
MINIO_ENDPOINT="localhost:9000"
MINIO_ACCESS_KEY="coshub_minio_user"
MINIO_SECRET_KEY="coshub_minio_password"
```

### 🌐 管理界面

| 服务 | 地址 | 用途 |
|------|------|------|
| MinIO Console | http://localhost:9001 | 文件存储管理 |
| PgAdmin | http://localhost:5050 | 数据库管理 |
| Redis Commander | http://localhost:8081 | 缓存管理 |

### 代码规范

```bash
# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 运行测试
pnpm test
```

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
- **ui**: 可复用的 UI 组件库 (待开发)
- **utils**: 通用工具函数 (待开发)
- **config**: 共享配置文件 (待开发)

### 基础设施 (infra/)
- **docker**: 本地开发环境 (PostgreSQL + Redis + MinIO) ✅

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

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
npm run db:generate  # 生成 Prisma 客户端
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 填充示例数据
```

## 联系方式

- 项目主页: https://github.com/garrymei/coshub
- 问题反馈: https://github.com/garrymei/coshub/issues

