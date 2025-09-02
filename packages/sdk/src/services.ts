/**
 * API 服务类定义
 */

import type {
  User,
  UserProfile,
  Post,
  Request,
  Skill,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@coshub/types";
import { CoshubClient } from "./client";
import type {
  SkillPost,
  CreateSkillPostDTO,
  SkillPostQueryDTO,
  SkillPostListResponse,
} from "@coshub/types";

export class UserService {
  constructor(private client: CoshubClient) {}

  /**
   * 获取用户信息
   */
  async getUser(userId: string): Promise<ApiResponse<User>> {
    return this.client.get(`/users/${userId}`);
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.client.get("/users/me");
  }

  /**
   * 更新用户资料
   */
  async updateProfile(
    userId: string,
    profile: Partial<UserProfile>,
  ): Promise<ApiResponse<UserProfile>> {
    return this.client.put(`/users/${userId}/profile`, profile);
  }

  /**
   * 搜索用户
   */
  async searchUsers(
    query: string,
    params?: PaginationParams,
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    return this.client.get("/users/search", { q: query, ...params });
  }
}

export class PostService {
  constructor(private client: CoshubClient) {}

  /**
   * 获取帖子列表
   */
  async getPosts(
    params?: PaginationParams,
  ): Promise<ApiResponse<PaginatedResponse<Post>>> {
    return this.client.get("/posts", params);
  }

  /**
   * 获取帖子详情
   */
  async getPost(postId: string): Promise<ApiResponse<Post>> {
    return this.client.get(`/posts/${postId}`);
  }

  /**
   * 创建帖子
   */
  async createPost(post: Partial<Post>): Promise<ApiResponse<Post>> {
    return this.client.post("/posts", post);
  }

  /**
   * 更新帖子
   */
  async updatePost(
    postId: string,
    post: Partial<Post>,
  ): Promise<ApiResponse<Post>> {
    return this.client.put(`/posts/${postId}`, post);
  }

  /**
   * 删除帖子
   */
  async deletePost(postId: string): Promise<ApiResponse<void>> {
    return this.client.delete(`/posts/${postId}`);
  }

  /**
   * 点赞帖子
   */
  async likePost(postId: string): Promise<ApiResponse<void>> {
    return this.client.post(`/posts/${postId}/like`);
  }
}

export class RequestService {
  constructor(private client: CoshubClient) {}

  /**
   * 获取请求列表
   */
  async getRequests(
    params?: PaginationParams,
  ): Promise<ApiResponse<PaginatedResponse<Request>>> {
    return this.client.get("/requests", params);
  }

  /**
   * 获取请求详情
   */
  async getRequest(requestId: string): Promise<ApiResponse<Request>> {
    return this.client.get(`/requests/${requestId}`);
  }

  /**
   * 创建请求
   */
  async createRequest(
    request: Partial<Request>,
  ): Promise<ApiResponse<Request>> {
    return this.client.post("/requests", request);
  }

  /**
   * 申请请求
   */
  async applyToRequest(
    requestId: string,
    application: any,
  ): Promise<ApiResponse<void>> {
    return this.client.post(`/requests/${requestId}/apply`, application);
  }
}

export class SkillService {
  constructor(private client: CoshubClient) {}

  /**
   * 获取技能列表（分页/城市/角色）
   */
  async getSkills(
    params?: PaginationParams & {
      city?: string;
      role?: string;
      lat?: number;
      lng?: number;
      radius?: number;
    },
  ): Promise<ApiResponse<PaginatedResponse<Skill>>> {
    return this.client.get("/skills", params as any);
  }

  /**
   * 认证用户技能
   */
  async certifySkill(
    userId: string,
    skillId: string,
    data: any,
  ): Promise<ApiResponse<void>> {
    return this.client.post(`/users/${userId}/skills/${skillId}/certify`, data);
  }

  /**
   * 获取技能详情
   */
  async getSkill(id: string): Promise<ApiResponse<Skill>> {
    return this.client.get(`/skills/${id}`);
  }

  /**
   * 发布技能（内存实现对应接口）
   */
  async createSkill(payload: {
    title: string;
    city: string;
    role: string;
    description?: string;
    images?: string[];
    author?: string;
  }): Promise<ApiResponse<Skill>> {
    return this.client.post("/skills", payload);
  }
}

export class AuthService {
  constructor(private client: CoshubClient) {}

  /**
   * 登录
   */
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.client.request("/auth/login", {
      method: "POST",
      data: credentials,
      skipAuth: true,
    });
  }

  /**
   * 注册
   */
  async register(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.client.request("/auth/register", {
      method: "POST",
      data: userData,
      skipAuth: true,
    });
  }

  /**
   * 登出
   */
  async logout(): Promise<ApiResponse<void>> {
    return this.client.post("/auth/logout");
  }

  /**
   * 刷新 Token
   */
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.client.post("/auth/refresh");
  }
}

export class UploadService {
  constructor(private client: CoshubClient) {}

  /**
   * 申请预签名并直传（PUT）单文件
   */
  async uploadFile(
    file: File,
  ): Promise<ApiResponse<{ url: string; filename: string }>> {
    // 1) 申请预签名
    const presign = await this.client.request<{
      uploadUrl: string;
      fields: Record<string, string>;
      fileUrl: string;
    }>("/upload/presign", {
      method: "POST",
      data: { filename: file.name, mimeType: file.type, fileSize: file.size },
    });
    if (!presign.success || !presign.data) return presign as any;

    const { uploadUrl, fields, fileUrl } = presign.data;

    // 2) 直传到对象存储（PUT）
    const putResp = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": fields["Content-Type"] || file.type },
      body: file,
    });
    if (!putResp.ok) {
      return {
        success: false,
        error: { code: String(putResp.status), message: "Upload failed" },
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: { url: fileUrl, filename: file.name },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 批量上传（串行，返回成功的 URL 列表）
   */
  async uploadFiles(
    files: FileList | File[],
  ): Promise<ApiResponse<{ urls: string[] }>> {
    const list = Array.isArray(files) ? files : Array.from(files);
    const urls: string[] = [];
    for (const f of list) {
      const r = await this.uploadFile(f);
      if (!r.success || !r.data) {
        return r as any;
      }
      urls.push(r.data.url);
    }
    return {
      success: true,
      data: { urls },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 删除文件
   */
  async deleteFile(fileId: string): Promise<ApiResponse<void>> {
    return this.client.delete(`/upload/${fileId}`);
  }
}

export class SkillPostsService {
  constructor(private client: CoshubClient) {}

  async list(
    params?: SkillPostQueryDTO,
  ): Promise<ApiResponse<SkillPostListResponse>> {
    return this.client.get("/skill-posts", params as any);
  }

  async get(id: string): Promise<ApiResponse<SkillPost>> {
    return this.client.get(`/skill-posts/${id}`);
  }

  async create(payload: CreateSkillPostDTO): Promise<ApiResponse<SkillPost>> {
    return this.client.post("/skill-posts", payload);
  }
}
