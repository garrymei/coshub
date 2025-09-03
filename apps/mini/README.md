# CosHub 小程序

CosHub 是一个二次元社区小程序，聚焦二次元技能服务与日常分享。

## 功能特点

- **技能区**：发布/展示技能（摄影、妆娘、毛娘、道具师等），带价格和服务介绍
- **分享区**：类似小红书瀑布流，分享 Cos 日常/作品，带互动（点赞、评论、收藏）
- **个人中心**：展示个人资料、发布的内容和收藏的内容

## 页面结构

- **技能页面**：`/pages/skills/index`
  - 技能详情：`/pages/skills/detail`
  - 发布技能：`/pages/skills/create`

- **分享页面**：`/pages/feed/index`
  - 分享详情：`/pages/feed/detail`
  - 发布分享：`/pages/feed/create`

- **个人中心**：`/pages/me/index`
  - 编辑资料：`/pages/me/profile`
  - 我的收藏：`/pages/me/collections`
  - 设置：`/pages/me/settings`

## 开发说明

### 技术栈

- Taro 框架
- React
- TypeScript
- SCSS

### 运行项目

```bash
# 安装依赖
npm install

# 开发模式
npm run dev:weapp

# 打包
npm run build:weapp
```

### 项目结构

```
src/
├── app.config.ts      # 应用配置
├── app.scss           # 全局样式
├── app.tsx            # 应用入口
├── assets/            # 静态资源
├── components/        # 公共组件
├── pages/             # 页面
│   ├── skills/        # 技能相关页面
│   ├── feed/          # 分享相关页面
│   └── me/            # 个人中心相关页面
└── utils/             # 工具函数
    ├── api.ts         # API请求
    └── constants.ts   # 常量定义
```

## 设计风格

- 整体风格偏小红书，简洁、现代
- 主色调：#FF6B9D（粉色）
- 辅助色：白色、浅灰色
- 强调交互和视觉体验

## 后续开发计划

1. 完善用户登录注册流程
2. 添加消息通知功能
3. 优化图片上传和展示
4. 添加内容审核机制
5. 优化搜索和筛选功能