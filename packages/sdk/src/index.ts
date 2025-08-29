/**
 * @coshub/sdk - Coshub 前端请求 SDK
 * 
 * 这个包提供了统一的 API 调用接口，包含错误处理、重试机制、类型安全等功能
 */

import { CoshubClient } from './client';
import type { ClientConfig, RequestOptions } from './client';
import {
  UserService,
  PostService,
  RequestService,
  SkillService,
  AuthService,
  UploadService
} from './services';
import {
  CoshubError,
  ErrorHandler,
  RetryHandler
} from './errors';

export { CoshubClient } from './client';
export type { ClientConfig, RequestOptions } from './client';

export {
  UserService,
  PostService,
  RequestService,
  SkillService,
  AuthService,
  UploadService
} from './services';

export {
  CoshubError,
  ErrorHandler,
  RetryHandler
} from './errors';

// 导出类型定义（从 @coshub/types 重新导出）
export type {
  User,
  UserLevel,
  UserProfile,
  Post,
  PostType,
  PostCategory,
  Request,
  RequestStatus,
  Skill,
  SkillCategory,
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '@coshub/types';

/**
 * SDK 工厂类，提供便捷的初始化方法
 */
export class CoshubSDK {
  public readonly client: CoshubClient;
  public readonly users: UserService;
  public readonly posts: PostService;
  public readonly requests: RequestService;
  public readonly skills: SkillService;
  public readonly auth: AuthService;
  public readonly upload: UploadService;

  constructor(baseURL: string, config?: Partial<import('./client').ClientConfig>) {
    this.client = new CoshubClient({
      baseURL,
      ...config
    });

    // 初始化所有服务
    this.users = new UserService(this.client);
    this.posts = new PostService(this.client);
    this.requests = new RequestService(this.client);
    this.skills = new SkillService(this.client);
    this.auth = new AuthService(this.client);
    this.upload = new UploadService(this.client);
  }

  /**
   * 设置认证 Token
   */
  setAuthToken(token: string): void {
    this.client.setAuthToken(token);
  }

  /**
   * 清除认证 Token
   */
  clearAuthToken(): void {
    this.client.clearAuthToken();
  }

  /**
   * 创建 SDK 实例的便捷方法
   */
  static create(baseURL: string, config?: Partial<import('./client').ClientConfig>): CoshubSDK {
    return new CoshubSDK(baseURL, config);
  }

  /**
   * 创建开发环境 SDK 实例
   */
  static createDev(): CoshubSDK {
    return new CoshubSDK('http://localhost:3001/api', {
      timeout: 15000,
      retry: { attempts: 2, delay: 1000 }
    });
  }

  /**
   * 创建生产环境 SDK 实例
   */
  static createProd(baseURL: string): CoshubSDK {
    return new CoshubSDK(baseURL, {
      timeout: 10000,
      retry: { attempts: 3, delay: 2000 }
    });
  }
}

// 默认导出
export default CoshubSDK;

// 版本信息
export const VERSION = '0.1.0';
