// 统一 API 封装（支持真实接口与 Mock 切换）
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

const USE_MOCK = String(process.env.NEXT_PUBLIC_USE_MOCK || "false") === "true";

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(
    path.startsWith("http") ? path : `${API_BASE_URL}${path}`,
    {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    },
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  return (await res.json()) as T;
}

// 类型（Web 端本地定义，避免与后端 DTO 强耦合）
export interface ListResult<T> {
  items: T[];
  total?: number;
  nextCursor?: string | null;
  hasNext?: boolean;
}

export interface WebBanner {
  id: string;
  scene: "feed" | "skills" | "home";
  imageUrl: string;
  linkType: "external" | "internal";
  linkUrl: string;
  priority: number;
  online: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface WebPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  images: string[];
  videos?: string[];
  tags: string[];
  city?: string;
  stats?: any;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface WebSkill {
  id: string;
  title: string;
  description: string;
  authorId?: string;
  authorName?: string;
  authorAvatar?: string;
  city?: string;
  price?: any;
  images: string[];
  tags: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Mock 数据（仅在 USE_MOCK=true 时使用）
const mock = {
  banners: [{
    id: "mock-1",
    scene: "feed" as const,
    imageUrl: "/api/banners/1.jpg",
    linkType: "external" as const,
    linkUrl: "https://example.com",
    priority: 1,
    online: true,
  }],
  posts: [{
    id: "mock-1",
    title: "Mock Post",
    content: "This is a mock post",
    authorId: "u1",
    authorName: "Mock User",
    images: ["/api/posts/1.jpg"],
    tags: ["mock"],
  }],
  skills: [{
    id: "mock-1",
    title: "Mock Skill",
    description: "Mock desc",
    images: [],
    tags: ["mock"],
  }],
};

export const api = {
  banners: {
    list: async (scene?: "feed" | "skills" | "home") => {
      if (USE_MOCK) return mock.banners as WebBanner[];
      const res = await apiFetch<{ success: boolean; data: WebBanner[] }>(
        scene ? `/banners?scene=${scene}` : "/banners",
      );
      return res.data ?? [];
    },
  },

  posts: {
    list: async (params: Record<string, any> = {}) => {
      if (USE_MOCK)
        return { items: mock.posts as WebPost[], hasNext: false } as ListResult<WebPost>;
      const qs = new URLSearchParams(params as any).toString();
      const res = await apiFetch<{
        data: WebPost[];
        meta?: { total?: number; hasNext?: boolean; nextCursor?: string };
        cursor?: string | null;
      }>(`/posts${qs ? `?${qs}` : ""}`);
      return {
        items: res.data || [],
        total: res.meta?.total,
        nextCursor: res.cursor ?? res.meta?.nextCursor,
        hasNext: res.meta?.hasNext,
      } as ListResult<WebPost>;
    },
  },

  skills: {
    list: async (params: Record<string, any> = {}) => {
      if (USE_MOCK)
        return { items: mock.skills as WebSkill[], hasNext: false } as ListResult<WebSkill>;
      const qs = new URLSearchParams(params as any).toString();
      const res = await apiFetch<{ items: WebSkill[]; total?: number; nextCursor?: string; hasNext?: boolean }>(
        `/skills${qs ? `?${qs}` : ""}`,
      );
      return {
        items: (res as any).data?.items || (res as any).items || [],
        total: (res as any).data?.total || (res as any).total,
        nextCursor: (res as any).data?.nextCursor || (res as any).nextCursor,
        hasNext: (res as any).data?.hasNext || (res as any).hasNext,
      } as ListResult<WebSkill>;
    },
  },

  // 保留旧的占位接口，便于后续迁移
  skillPosts: {
    create: async (data: any) => {
      if (USE_MOCK) return { success: true, data: { id: "mock-id" } } as any;
      return apiFetch("/skill-posts", { method: "POST", body: JSON.stringify(data) });
    },
    get: async (id: string) => {
      if (USE_MOCK) return { success: true, data: mock.skills[0] } as any;
      return apiFetch(`/skill-posts/${id}`);
    },
    list: async (params: any) => {
      if (USE_MOCK) return { success: true, data: { items: mock.skills } } as any;
      const qs = new URLSearchParams(params as any).toString();
      return apiFetch(`/skill-posts${qs ? `?${qs}` : ""}`);
    },
  },

  upload: {
    uploadFile: async (file: File) => {
      if (USE_MOCK) return { success: true, data: { url: "mock-url" } } as any;
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API_BASE_URL}/upload`, { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      return (await res.json()) as any;
    },
    uploadFiles: async (files: FileList) => {
      if (USE_MOCK) return { success: true, data: { urls: ["mock-url-1", "mock-url-2"] } } as any;
      const form = new FormData();
      Array.from(files).forEach((f) => form.append("files", f));
      const res = await fetch(`${API_BASE_URL}/upload/multi`, { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      return (await res.json()) as any;
    },
  },
};

// 也导出后端共享类型，供有需要的地方直接使用
export type { ApiResponse } from "@coshub/types";
