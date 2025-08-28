/**
 * 通用类型定义
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  category?: string;
  color?: string;
  usageCount: number;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  targetId: string;
  targetType: CommentTargetType;
  parentId?: string; // 用于嵌套评论
  likeCount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum CommentTargetType {
  POST = 'post',
  REQUEST = 'request',
  USER = 'user',
  GALLERY_ITEM = 'gallery_item'
}

export interface Like {
  id: string;
  userId: string;
  targetId: string;
  targetType: LikeTargetType;
  createdAt: Date;
}

export enum LikeTargetType {
  POST = 'post',
  COMMENT = 'comment',
  REQUEST = 'request',
  GALLERY_ITEM = 'gallery_item'
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  FOLLOW = 'follow',
  REQUEST_APPLICATION = 'request_application',
  REQUEST_ACCEPTED = 'request_accepted',
  SYSTEM = 'system'
}
