# 贡献指南

## 提交流程

1. 从 `main` 创建特性分支
2. 提交规范化 Commit（遵循 Conventional Commits）
3. 提交 PR 到 `main`，CI 需通过

## 代码规范

- 使用 pnpm 管理依赖
- 运行 `pnpm -w lint && pnpm -w format` 保持风格统一
- TypeScript 严格模式，避免 `any`

## 提交信息格式（示例）

- feat(web): add home page
- fix(api): healthz returns ok
- chore: update dependencies


