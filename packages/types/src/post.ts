/**
 * 帖子相关类型定义
 */

import { UploadedFile, Tag } from "./common";
import { SkillCategory } from "./skill";

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  type: PostType;
  category: PostCategory;
  tags: Tag[];
  images: UploadedFile[];
  videos: UploadedFile[];
  city?: string;
  lat?: number;
  lng?: number;
  geohash?: string;
  metadata?: PostMetadata;
  stats: PostStats;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum PostType {
  SHARE = "SHARE", // 分享
  DISCUSSION = "DISCUSSION", // 讨论
  TUTORIAL = "TUTORIAL", // 教程
  NEWS = "NEWS", // 资讯
  EVENT = "EVENT", // 活动
}

export enum PostCategory {
  COSPLAY_SHOW = "COSPLAY_SHOW", // Cosplay 展示
  TUTORIAL = "TUTORIAL", // 教程分享
  EVENT_REPORT = "EVENT_REPORT", // 活动报告
  DISCUSSION = "DISCUSSION", // 话题讨论
  NEWS = "NEWS", // 圈内资讯
  RESOURCE = "RESOURCE", // 资源分享
}

export interface PostMetadata {
  character?: string;
  anime?: string;
  difficulty?: "easy" | "medium" | "hard" | "expert";
  estimatedTime?: number; // 分钟
  materials?: string[];
  tools?: string[];
  skills?: SkillCategory[];
  event?: EventInfo;
}

export interface EventInfo {
  name: string;
  date: Date;
  location: string;
  website?: string;
}

export interface PostStats {
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  saveCount: number;
}

export interface PostDraft {
  id: string;
  authorId: string;
  title?: string;
  content?: string;
  type?: PostType;
  category?: PostCategory;
  tags?: string[];
  images?: string[];
  metadata?: Partial<PostMetadata>;
  lastSavedAt: Date;
  createdAt: Date;
}

// DTO 类型定义
export interface CreatePostDTO {
  title: string;
  content: string;
  type: PostType;
  category?: PostCategory;
  tags?: string[];
  images?: string[];
  videos?: string[];
  metadata?: Partial<PostMetadata>;
}

export interface UpdatePostDTO {
  title?: string;
  content?: string;
  type?: PostType;
  category?: PostCategory;
  tags?: string[];
  images?: string[];
  videos?: string[];
  metadata?: Partial<PostMetadata>;
}

export interface PostQueryDTO {
  type?: PostType;
  category?: PostCategory;
  tags?: string[];
  authorId?: string;
  keyword?: string;
  city?: string;
  sortBy?: "latest" | "popular" | "mostViewed";
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PostListResponse {
  data: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  cursor?: string;
}
