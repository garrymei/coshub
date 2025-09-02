/**
 * @coshub/types - Coshub 共享类型定义
 *
 * 这个包提供了 Coshub 项目中所有应用共享的 TypeScript 类型定义
 */

// 用户相关类型
export * from "./user";

// 技能相关类型
export * from "./skill";

// 请求相关类型
export * from "./request";

// 帖子相关类型
export * from "./post";

// 技能帖相关类型
export * from "./skill-post";

// 举报相关类型
export * from "./report";

// 通用类型
export * from "./common";

// 校验器（zod schemas）
export { createSkillPostSchema } from "./validators/skill-post";
export type { CreateSkillPostInput } from "./validators/skill-post";

// 版本信息
export const VERSION = "0.1.0";

// 导出一些常用的类型组合
export type { User, UserLevel, UserProfile } from "./user";
export type { Skill, SkillCategory, SkillLevel } from "./skill";
export type { Request, RequestStatus, CosplayRequest } from "./request";
export type { Post, PostType, PostCategory } from "./post";
export type { ApiResponse, PaginatedResponse, UploadedFile } from "./common";
export type {
  SkillPost,
  SkillRole,
  CreateSkillPostDTO,
  SkillPostQueryDTO,
  SkillPostListResponse,
} from "./skill-post";
