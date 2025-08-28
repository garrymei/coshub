import { CoshubSDK } from '@coshub/sdk';

// 创建 SDK 实例
export const api = CoshubSDK.createDev();

// 导出类型以便在组件中使用
export type {
  SkillPost,
  SkillRole,
  SkillCategory,
  CreateSkillPostDTO,
  SkillPostQueryDTO,
  SkillPostListResponse,
  ExperienceLevel,
  PriceType,
  ContactMethod,
  ApiResponse
} from '@coshub/types';
