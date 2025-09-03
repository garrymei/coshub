# 🤝 贡献指南

感谢您对 Coshub 项目的关注！我们欢迎所有形式的贡献。

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 9.0.0
- Git

### 本地开发设置
```bash
# 1. Fork 项目
# 2. 克隆你的 Fork
git clone https://github.com/YOUR_USERNAME/coshub.git
cd coshub

# 3. 添加上游远程
git remote add upstream https://github.com/garrymei/coshub.git

# 4. 安装依赖
pnpm install

# 5. 启动开发环境
pnpm dev:all
```

## 📝 开发流程

### 1. 创建分支
```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 2. 开发与测试
- 遵循项目的代码规范
- 确保所有测试通过
- 运行 lint 检查：`pnpm lint`
- 运行格式化：`pnpm format`

### 3. 提交代码
```bash
git add .
git commit -m "feat: add new feature"
```

**提交信息规范**：
- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 重构
- `test:` 测试
- `chore:` 构建/工具

### 4. 推送与 PR
```bash
git push origin feature/your-feature-name
# 然后在 GitHub 创建 Pull Request
```

## 🎯 贡献类型

### 🐛 Bug 修复
1. 在 Issues 中查找或创建 Bug 报告
2. 修复问题并添加测试
3. 提交 PR 并链接相关 Issue

### 🚀 新功能
1. 在 Issues 中讨论功能需求
2. 实现功能并添加测试
3. 更新相关文档
4. 提交 PR

### 📚 文档改进
- 修复拼写错误
- 改进文档结构
- 添加示例代码
- 翻译文档

### 🧪 测试
- 添加单元测试
- 添加集成测试
- 提高测试覆盖率

## 📋 代码规范

### TypeScript
- 使用严格的类型检查
- 避免 `any` 类型
- 为函数参数和返回值添加类型注解

### React/Next.js
- 使用函数组件和 Hooks
- 遵循 React 最佳实践
- 使用 TypeScript 类型

### NestJS
- 遵循 NestJS 架构模式
- 使用 DTO 进行数据验证
- 实现适当的错误处理

## 🔍 代码审查

所有 PR 都需要通过代码审查：
- 至少需要一位维护者批准
- 所有 CI 检查必须通过
- 代码必须遵循项目规范

## 📞 获取帮助

- 查看 [README.md](README.md)
- 搜索现有的 Issues 和 PR
- 创建新的 Issue 描述问题
- 加入项目讨论

## 📄 许可证

通过贡献代码，您同意您的贡献将在 MIT 许可证下发布。

---

再次感谢您的贡献！🎉



