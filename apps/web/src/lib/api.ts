import { CoshubSDK } from '@coshub/sdk';

// 创建 SDK 实例（支持环境变量覆盖）
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
export const api = CoshubSDK.create(baseURL, {
  timeout: 15000,
  retry: { attempts: 2, delay: 1000 }
});

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
