# 🚀 Coshub 快速启动指南

## 📋 当前状态

- ✅ **阶段 1**: Monorepo 基础骨架已完成
- ✅ **阶段 2**: 三端应用占位已完成
- 🔄 **阶段 3**: 准备开始业务功能开发

## 🛠️ 快速验证

### 1. 安装依赖
```bash
# 全局安装 pnpm (如果还没有)
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 2. 启动验证

#### Web 应用验证
```bash
# 启动 Web 应用
pnpm dev:web

# 浏览器访问: http://localhost:3000
# 应该看到: "Coshub Web" 二次元主题页面
```

#### API 服务验证
```bash
# 启动 API 服务  
pnpm dev:api

# 浏览器访问: http://localhost:3001/api/healthz
# 应该看到: {"ok":true,"service":"api",...}
```

#### 小程序验证
```bash
# 构建小程序
pnpm build:mini

# 用微信开发者工具打开 apps/mini 目录
# 应该看到: "Coshub Mini" 小程序首页
```

#### 同时启动多端
```bash
# 同时启动 Web + API
pnpm dev:all
```

## 📦 应用架构

### 🌐 Web 端 (`apps/web`)
- **框架**: Next.js 14 + App Router
- **样式**: Tailwind CSS
- **端口**: 3000
- **入口**: `src/app/page.tsx`

### 🔗 API 端 (`apps/api`)  
- **框架**: NestJS
- **端口**: 3001
- **健康检查**: `/api/healthz`
- **入口**: `src/main.ts`

### 📱 小程序端 (`apps/mini`)
- **框架**: Taro 3 + React
- **构建目录**: `dist/`
- **入口**: `src/app.ts`
- **首页**: `src/pages/index/index.tsx`

## 🎯 下一步开发建议

### 阶段 3A: 共享包开发
- 创建 UI 组件库 (`packages/ui`)
- 创建工具函数库 (`packages/utils`)  
- 创建类型定义库 (`packages/types`)

### 阶段 3B: 核心功能开发
- 用户认证系统
- 数据库集成 (Prisma + PostgreSQL)
- 文件上传服务
- 实时通信 (WebSocket)

### 阶段 3C: 业务模块开发
- 用户管理模块
- 内容发布模块
- 聊天系统
- 论坛功能
- 图片画廊

## 🔧 开发工具

### 代码规范
```bash
pnpm lint     # 代码检查
pnpm format   # 代码格式化
```

### 构建和部署
```bash
pnpm build         # 构建所有应用
pnpm build:web     # 只构建 Web
pnpm build:api     # 只构建 API
pnpm build:mini    # 只构建小程序
```

### 清理
```bash
pnpm clean    # 清理所有构建产物
```

## 📚 技术文档

- [Next.js 文档](https://nextjs.org/docs)
- [NestJS 文档](https://docs.nestjs.com/)
- [Taro 文档](https://docs.taro.zone/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Turbo 文档](https://turbo.build/repo/docs)

## 🐛 常见问题

### Q: pnpm 命令找不到？
A: 先安装 pnpm: `npm install -g pnpm`

### Q: 端口被占用？
A: 检查 3000/3001 端口，或修改配置文件中的端口

### Q: 小程序构建失败？
A: 确保已安装 Taro CLI: `npm install -g @tarojs/cli`

### Q: TypeScript 类型错误？
A: 运行 `pnpm install` 确保类型定义已安装

---

🎌 **准备好开始 Coshub 的二次元之旅了吗？**
