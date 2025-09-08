import Taro from "@tarojs/taro";

// API基础配置（支持 TARO_APP_API_BASE_URL 覆盖，默认开发端口 3001）
const API_BASE_URL =
  (process.env.TARO_APP_API_BASE_URL as string | undefined) ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001/api"
    : "https://api.coshub.com");

// 通用请求方法
const request = async <T = any>(options: {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  header?: Record<string, string>;
}): Promise<{ data: T; code: number; message: string }> => {
  try {
    const token = Taro.getStorageSync("token");

    const response = await Taro.request({
      url: `${API_BASE_URL}${options.url}`,
      method: options.method || "GET",
      data: options.data,
      header: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.header,
      },
    });

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.data as any;
    } else {
      throw new Error(
        `HTTP ${response.statusCode}: ${response.data?.message || "请求失败"}`,
      );
    }
  } catch (error) {
    console.error("API请求失败:", error);
    throw error;
  }
};

// 数据类型定义
export interface User {
  id: string;
  nickname: string;
  avatar: string;
  bio?: string;
  followers: number;
  likes: number;
  collections: number;
  level: "normal" | "vip" | "premium";
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  collectCount: number;
  isLiked: boolean;
  isCollected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  userId: string;
  user: User;
  title: string;
  description: string;
  price: number;
  category: "makeup" | "photography" | "editing" | "props" | "wigs";
  images: string[];
  tags: string[];
  city: string;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  image: string;
  link?: string;
  type: "home" | "plaza" | "skills";
  order: number;
}

// 工具：适配小程序端与后端的参数差异
const mapBannerScene = (type: "home" | "plaza" | "skills"): string => {
  // API 使用 scene: feed | skills | home
  if (type === "plaza") return "feed";
  return type; // home/skills 保持一致
};

const mapPostType = (
  type?: "home" | "plaza" | "share" | "skill",
): "share" | "skill" | undefined => {
  if (!type) return undefined;
  if (type === "plaza" || type === "home") return "share";
  return type;
};

// API方法
export const api = {
  // 用户相关
  user: {
    // TODO: 后端暂无 /user/profile；先保留占位，联调阶段用 mock 或补充后端接口
    getProfile: (): Promise<User> => request({ url: "/user/profile" }),
    updateProfile: (data: Partial<User>): Promise<User> =>
      request({ url: "/user/profile", method: "PUT", data }),
    login: (code: string): Promise<{ token: string; user: User }> =>
      request({ url: "/auth/login", method: "POST", data: { code } }),
  },

  // 帖子相关
  posts: {
    getList: async (params: {
      type?: "home" | "plaza" | "share" | "skill";
      cursor?: string;
      limit?: number;
      search?: string;
      page?: number;
      sortBy?: "latest" | "popular" | "mostViewed";
    }): Promise<{ data: Post[]; nextCursor?: string; hasMore: boolean }> => {
      const res = await request<{
        data: any[];
        meta?: { hasNext?: boolean; nextCursor?: string };
        cursor?: string | null;
      }>({
        url: "/posts",
        data: {
          ...params,
          type: mapPostType(params.type),
          keyword: params.search,
        },
      });

      return {
        data: (res as any).data as any,
        nextCursor: (res as any).cursor ?? (res as any).meta?.nextCursor,
        hasMore: Boolean((res as any).meta?.hasNext),
      } as any;
    },

    getDetail: (id: string): Promise<Post> => request({ url: `/posts/${id}` }),

    create: (data: { content: string; images: string[] }): Promise<Post> =>
      request({ url: "/posts", method: "POST", data }),

    like: (id: string): Promise<void> =>
      request({ url: `/posts/${id}/like`, method: "POST" }),

    unlike: (id: string): Promise<void> =>
      request({ url: `/posts/${id}/like`, method: "DELETE" }),

    collect: (id: string): Promise<void> =>
      request({ url: `/posts/${id}/collect`, method: "POST" }),

    uncollect: (id: string): Promise<void> =>
      request({ url: `/posts/${id}/collect`, method: "DELETE" }),

    comment: (id: string, content: string): Promise<void> =>
      request({
        url: `/posts/${id}/comments`,
        method: "POST",
        data: { content },
      }),

    getComments: (id: string): Promise<any[]> =>
      request({ url: `/posts/${id}/comments` }),
  },

  // 技能相关
  skills: {
    getList: async (params: {
      cursor?: string;
      limit?: number;
      search?: string;
      category?: string;
      city?: string;
      priceMin?: number;
      priceMax?: number;
    }): Promise<{ data: Skill[]; nextCursor?: string; hasMore: boolean }> => {
      const res = await request<{ total: number; page: number; pageSize: number; items: any[] }>(
        { url: "/skills", data: params },
      );
      const total = (res as any).total ?? 0;
      const page = (res as any).page ?? 1;
      const pageSize = (res as any).pageSize ?? (params.limit || 10);
      return {
        data: (res as any).items as any,
        nextCursor: undefined,
        hasMore: page * pageSize < total,
      } as any;
    },

    getDetail: (id: string): Promise<Skill> =>
      request({ url: `/skills/${id}` }),

    create: (data: {
      title: string;
      description: string;
      price: number;
      category: string;
      images: string[];
      tags: string[];
      city: string;
    }): Promise<Skill> => request({ url: "/skills", method: "POST", data }),
  },

  // 轮播图相关
  banners: {
    getList: async (
      type: "home" | "plaza" | "skills",
    ): Promise<Banner[]> => {
      const res = await request<{ success: boolean; data: any[] }>(
        { url: `/banners?scene=${mapBannerScene(type)}` },
      );
      const list = ((res as any).data || []) as any[];
      return list.map((b) => ({
        id: b.id,
        title: "",
        image: b.imageUrl,
        link: b.linkUrl,
        type,
        order: b.priority ?? 0,
      }));
    },
  },

  // 搜索相关
  search: {
    global: (
      query: string,
    ): Promise<{
      posts: Post[];
      skills: Skill[];
      users: User[];
    }> => request({ url: "/search", data: { q: query } }),
  },
};

// 模拟数据（开发环境使用）
export const mockData = {
  users: [
    {
      id: "1",
      nickname: "五河琴里Cici",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      bio: "专业coser，喜欢原神",
      followers: 108,
      likes: 23000,
      collections: 99,
      level: "vip" as const,
    },
    {
      id: "2",
      nickname: "漫圈小王子",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
      bio: "动漫爱好者",
      followers: 256,
      likes: 15000,
      collections: 45,
      level: "normal" as const,
    },
  ] as User[],

  posts: [
    {
      id: "1",
      userId: "1",
      user: {} as User, // 会被填充
      content: "#原神cos# 纳西妲cos正片",
      images: ["https://placehold.co/400x500/fbcfe8/9d174d?text=Cosplay"],
      likeCount: 1800,
      commentCount: 45,
      collectCount: 120,
      isLiked: false,
      isCollected: false,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      userId: "2",
      user: {} as User, // 会被填充
      content: "这季度的新番也太好看了吧！",
      images: ["https://placehold.co/400x350/e0e7ff/4338ca?text=新番"],
      likeCount: 996,
      commentCount: 23,
      collectCount: 67,
      isLiked: true,
      isCollected: false,
      createdAt: "2024-01-14T15:20:00Z",
      updatedAt: "2024-01-14T15:20:00Z",
    },
  ] as Post[],

  skills: [
    {
      id: "1",
      userId: "1",
      user: {} as User, // 会被填充
      title: "原神角色专业妆造",
      description: "超还原角色妆面，可选美瞳、假发造型服务",
      price: 200,
      category: "makeup" as const,
      images: ["https://placehold.co/400x400/f5d0fe/a21caf?text=妆造"],
      tags: ["原神", "cosplay", "化妆"],
      city: "北京",
      createdAt: "2024-01-10T09:00:00Z",
      updatedAt: "2024-01-10T09:00:00Z",
    },
    {
      id: "2",
      userId: "2",
      user: {} as User, // 会被填充
      title: "漫展场照拍摄",
      description: "捕捉你在漫展最亮眼的瞬间，高质量返图",
      price: 300,
      category: "photography" as const,
      images: ["https://placehold.co/400x500/fbcfe8/9d174d?text=摄影"],
      tags: ["摄影", "漫展", "场照"],
      city: "上海",
      createdAt: "2024-01-08T14:30:00Z",
      updatedAt: "2024-01-08T14:30:00Z",
    },
  ] as Skill[],

  banners: [
    {
      id: "1",
      title: "夏日漫展",
      image: "https://placehold.co/600x300/fce7f3/db2777?text=夏日漫展",
      type: "home" as const,
      order: 1,
    },
    {
      id: "2",
      title: "绘画征集",
      image: "https://placehold.co/600x300/f5d0fe/a21caf?text=绘画征集",
      type: "home" as const,
      order: 2,
    },
    {
      id: "3",
      title: "新人福利",
      image: "https://placehold.co/600x300/ecfccb/4d7c0f?text=新人福利",
      type: "home" as const,
      order: 3,
    },
  ] as Banner[],
};

// 填充用户数据
mockData.posts.forEach((post) => {
  post.user =
    mockData.users.find((u) => u.id === post.userId) || mockData.users[0];
});

mockData.skills.forEach((skill) => {
  skill.user =
    mockData.users.find((u) => u.id === skill.userId) || mockData.users[0];
});

export default api;
