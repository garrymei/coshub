import { request } from "@/utils/api";

interface UserProfile {
  id: string;
  nickname: string;
  avatar: string;
  bio: string;
  gender: string;
  city: string;
}

interface UserPost {
  id: string;
  title: string;
  coverImage?: string;
  type: "share" | "skill";
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

export async function getUserProfile(): Promise<UserProfile> {
  return request({
    url: "/users/me",
    method: "GET",
  });
}

export async function updateUserProfile(
  profile: Partial<UserProfile>,
): Promise<UserProfile> {
  return request({
    url: "/users/me",
    method: "PUT", // 修改为PUT，与API定义的Method类型兼容
    data: profile,
  });
}

export async function getUserPosts(params: {
  type?: "share" | "skill";
  cursor?: string | null;
}): Promise<{
  data: UserPost[];
  nextCursor: string | null;
  hasMore: boolean;
}> {
  return request({
    url: "/users/me/posts",
    method: "GET",
    data: params,
  });
}

export async function getUserFavorites(params: {
  cursor?: string | null;
}): Promise<{
  data: UserPost[];
  nextCursor: string | null;
  hasMore: boolean;
}> {
  return request({
    url: "/users/me/favorites",
    method: "GET",
    data: params,
  });
}

// 添加getUserCollections函数，与collections.tsx页面兼容
export async function getUserCollections(page = 1): Promise<{
  list: any[];
  hasMore: boolean;
}> {
  return request({
    url: "/users/me/collections",
    method: "GET",
    data: { page, limit: 10 },
  });
}
