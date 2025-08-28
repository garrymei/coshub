/**
 * 帖子相关类型定义
 */

import { UploadedFile, Tag } from './common';
import { SkillCategory } from './skill';

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
  metadata?: PostMetadata;
  stats: PostStats;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum PostType {
  SHOWCASE = 'showcase',     // 作品展示
  TUTORIAL = 'tutorial',     // 教程
  DISCUSSION = 'discussion', // 讨论
  NEWS = 'news',            // 资讯
  EVENT = 'event'           // 活动
}

export enum PostCategory {
  COSPLAY = 'cosplay',
  PHOTOGRAPHY = 'photography',
  MAKEUP = 'makeup',
  PROP_MAKING = 'prop_making',
  COSTUME_MAKING = 'costume_making',
  ANIME_DISCUSSION = 'anime_discussion',
  COMMUNITY = 'community',
  TIPS_TRICKS = 'tips_tricks'
}

export interface PostMetadata {
  character?: string;
  anime?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
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
