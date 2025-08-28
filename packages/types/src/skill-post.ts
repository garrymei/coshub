/**
 * 技能帖相关类型定义
 */

import { SkillCategory } from './skill';

export interface SkillPost {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  category: SkillCategory;
  role: SkillRole;
  city: string;
  price: SkillPrice;
  images: string[];
  tags: string[];
  experience: ExperienceLevel;
  availability: Availability;
  contactInfo: ContactInfo;
  stats: SkillPostStats;
  status: SkillPostStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum SkillRole {
  COSER = 'coser',           // cos 模特
  PHOTOGRAPHER = 'photographer', // 摄影师
  MAKEUP_ARTIST = 'makeup_artist', // 化妆师
  PROP_MAKER = 'prop_maker',     // 道具师
  COSTUME_MAKER = 'costume_maker', // 服装师
  LOCATION_OWNER = 'location_owner', // 场地方
  POST_PROCESSOR = 'post_processor', // 后期师
  VIDEOGRAPHER = 'videographer',   // 摄像师
  ORGANIZER = 'organizer'          // 活动组织者
}

export interface SkillPrice {
  type: PriceType;
  amount?: number;
  currency: 'CNY' | 'USD' | 'JPY';
  unit?: PriceUnit;
  range?: {
    min: number;
    max: number;
  };
  negotiable: boolean;
}

export enum PriceType {
  FREE = 'free',           // 免费
  FIXED = 'fixed',         // 固定价格
  RANGE = 'range',         // 价格区间
  NEGOTIABLE = 'negotiable' // 面议
}

export enum PriceUnit {
  PER_HOUR = 'per_hour',       // 每小时
  PER_DAY = 'per_day',         // 每天
  PER_SET = 'per_set',         // 每套
  PER_PHOTO = 'per_photo',     // 每张照片
  PER_EVENT = 'per_event'      // 每次活动
}

export enum ExperienceLevel {
  NEWBIE = 'newbie',       // 新手
  BEGINNER = 'beginner',   // 初级
  INTERMEDIATE = 'intermediate', // 中级
  ADVANCED = 'advanced',   // 高级
  PROFESSIONAL = 'professional' // 专业
}

export interface Availability {
  weekdays: boolean;
  weekends: boolean;
  holidays: boolean;
  timeSlots: TimeSlot[];
  advance: number; // 需要提前几天预约
}

export interface TimeSlot {
  start: string; // HH:mm 格式
  end: string;   // HH:mm 格式
}

export interface ContactInfo {
  wechat?: string;
  qq?: string;
  phone?: string;
  email?: string;
  preferred: ContactMethod;
}

export enum ContactMethod {
  WECHAT = 'wechat',
  QQ = 'qq',
  PHONE = 'phone',
  EMAIL = 'email',
  PLATFORM = 'platform' // 站内联系
}

export interface SkillPostStats {
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  contactCount: number;
  responseRate: number; // 响应率 0-100
  avgRating: number;    // 平均评分 0-5
  reviewCount: number;
}

export enum SkillPostStatus {
  DRAFT = 'draft',         // 草稿
  PUBLISHED = 'published', // 已发布
  PAUSED = 'paused',      // 暂停接单
  CLOSED = 'closed',      // 已关闭
  BANNED = 'banned'       // 已封禁
}

// DTO 类型定义

export interface CreateSkillPostDTO {
  title: string;
  description: string;
  category: SkillCategory;
  role: SkillRole;
  city: string;
  price: Omit<SkillPrice, 'currency'> & { currency?: string };
  images: string[];
  tags: string[];
  experience: ExperienceLevel;
  availability: Availability;
  contactInfo: ContactInfo;
}

export interface UpdateSkillPostDTO extends Partial<CreateSkillPostDTO> {
  status?: SkillPostStatus;
}

export interface SkillPostQueryDTO {
  page?: number;
  limit?: number;
  category?: SkillCategory;
  role?: SkillRole;
  city?: string;
  priceType?: PriceType;
  priceMin?: number;
  priceMax?: number;
  experience?: ExperienceLevel;
  sortBy?: SkillPostSortBy;
  sortOrder?: 'asc' | 'desc';
  keyword?: string;
}

export enum SkillPostSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  PRICE = 'price',
  RATING = 'rating',
  VIEW_COUNT = 'viewCount',
  RESPONSE_RATE = 'responseRate'
}

// 响应类型
export interface SkillPostListResponse {
  items: SkillPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 表单验证规则
export interface SkillPostValidationRules {
  title: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  description: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  images: {
    required: boolean;
    minCount: number;
    maxCount: number;
  };
  price: {
    required: boolean;
    minAmount: number;
    maxAmount: number;
  };
  contact: {
    atLeastOne: boolean;
  };
}

export const SKILL_POST_VALIDATION_RULES: SkillPostValidationRules = {
  title: {
    required: true,
    minLength: 5,
    maxLength: 100
  },
  description: {
    required: true,
    minLength: 20,
    maxLength: 2000
  },
  images: {
    required: true,
    minCount: 1,
    maxCount: 9
  },
  price: {
    required: true,
    minAmount: 0,
    maxAmount: 99999
  },
  contact: {
    atLeastOne: true
  }
};
