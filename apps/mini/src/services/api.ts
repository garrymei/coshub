import Taro from "@tarojs/taro";
import { User, Post, SkillPost, Comment, Banner, Interaction } from "../types";

// API基础URL
const BASE_URL = "https://api.coshub.com/v1";

// 请求配置接口
interface RequestOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  header?: Record<string, string>;
}

// 通用请求函数
const request = async function <T>(options: RequestOptions): Promise<T> {
  const token = Taro.getStorageSync("token");

  const defaultHeader: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeader["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await Taro.request({
      url: `${BASE_URL}${options.url}`,
      method: options.method || "GET",
      data: options.data,
      header: { ...defaultHeader, ...options.header },
    });

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.data as T;
    }

    throw new Error(`请求失败: ${response.statusCode}`);
  } catch (error) {
    console.error("API请求错误:", error);
    throw error;
  }
};

// 用户相关API
export const userApi = {
  // 登录
  login: (code: string) => {
    return request<{ token: string; user: User }>({
      url: "/auth/login",
      method: "POST",
      data: { code },
    });
  },

  // 获取用户信息
  getUserInfo: (userId: string) => {
    return request<User>({
      url: `/users/${userId}`,
    });
  },

  // 更新用户信息
  updateUserInfo: (data: Partial<User>) => {
    return request<User>({
      url: "/users/me",
      method: "PUT",
      data,
    });
  },

  // 获取用户发布的帖子
  getUserPosts: (userId: string, type?: "skill" | "share") => {
    return request<Post[]>({
      url: `/users/${userId}/posts`,
      data: { type },
    });
  },

  // 获取用户收藏的帖子
  getUserCollections: (userId: string) => {
    return request<Post[]>({
      url: `/users/${userId}/collections`,
    });
  },
};

// 技能帖子相关API
export const skillApi = {
  // 获取技能帖子列表
  getSkills: (params?: { page?: number; limit?: number; tags?: string[] }) => {
    return request<SkillPost[]>({
      url: "/skills",
      data: params,
    });
  },

  // 获取技能帖子详情
  getSkillDetail: (skillId: string) => {
    return request<SkillPost>({
      url: `/skills/${skillId}`,
    });
  },

  // 创建技能帖子
  createSkill: (data: Partial<SkillPost>) => {
    return request<SkillPost>({
      url: "/skills",
      method: "POST",
      data,
    });
  },

  // 更新技能帖子
  updateSkill: (skillId: string, data: Partial<SkillPost>) => {
    return request<SkillPost>({
      url: `/skills/${skillId}`,
      method: "PUT",
      data,
    });
  },

  // 删除技能帖子
  deleteSkill: (skillId: string) => {
    return request<void>({
      url: `/skills/${skillId}`,
      method: "DELETE",
    });
  },
};

// 分享帖子相关API
export const feedApi = {
  // 获取分享帖子列表
  getPosts: (params?: { page?: number; limit?: number; tags?: string[] }) => {
    return request<Post[]>({
      url: "/posts",
      data: params,
    });
  },

  // 获取分享帖子详情
  getPostDetail: (postId: string) => {
    return request<Post>({
      url: `/posts/${postId}`,
    });
  },

  // 创建分享帖子
  createPost: (data: Partial<Post>) => {
    return request<Post>({
      url: "/posts",
      method: "POST",
      data,
    });
  },

  // 更新分享帖子
  updatePost: (postId: string, data: Partial<Post>) => {
    return request<Post>({
      url: `/posts/${postId}`,
      method: "PUT",
      data,
    });
  },

  // 删除分享帖子
  deletePost: (postId: string) => {
    return request<void>({
      url: `/posts/${postId}`,
      method: "DELETE",
    });
  },

  // 获取帖子评论
  getComments: (postId: string) => {
    return request<Comment[]>({
      url: `/posts/${postId}/comments`,
    });
  },

  // 添加评论
  addComment: (postId: string, content: string, replyTo?: string) => {
    return request<Comment>({
      url: `/posts/${postId}/comments`,
      method: "POST",
      data: { content, replyTo },
    });
  },

  // 点赞帖子
  likePost: (postId: string) => {
    return request<Interaction>({
      url: `/posts/${postId}/like`,
      method: "POST",
    });
  },

  // 取消点赞
  unlikePost: (postId: string) => {
    return request<void>({
      url: `/posts/${postId}/like`,
      method: "DELETE",
    });
  },

  // 收藏帖子
  collectPost: (postId: string) => {
    return request<Interaction>({
      url: `/posts/${postId}/collect`,
      method: "POST",
    });
  },

  // 取消收藏
  uncollectPost: (postId: string) => {
    return request<void>({
      url: `/posts/${postId}/collect`,
      method: "DELETE",
    });
  },
};

// Banner相关API
export const bannerApi = {
  // 获取Banner列表
  getBanners: (type?: "skill" | "share") => {
    return request<Banner[]>({
      url: "/banners",
      data: { type },
    });
  },
};

export default {
  user: userApi,
  skill: skillApi,
  feed: feedApi,
  banner: bannerApi,
};
