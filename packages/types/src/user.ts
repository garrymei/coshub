/**
 * 用户相关类型定义
 */

export interface User {
  id: string;
  username: string;
  email: string;
  nickname?: string;
  avatar?: string;
  bio?: string;
  level: UserLevel;
  gender?: Gender;
  birthday?: Date;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isVerified: boolean;
}

export enum UserLevel {
  NEWBIE = 'newbie',       // 萌新
  REGULAR = 'regular',     // 普通用户
  VIP = 'vip',            // VIP用户
  MODERATOR = 'moderator', // 版主
  ADMIN = 'admin'         // 管理员
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export interface UserProfile {
  userId: string;
  cosplayExperience?: number; // 年数
  favoriteAnimes: string[];
  favoriteCharacters: string[];
  skills: Skill[];
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  isPublic: boolean;
}

export enum SocialPlatform {
  WEIBO = 'weibo',
  BILIBILI = 'bilibili',
  QQ = 'qq',
  WECHAT = 'wechat',
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram'
}

export interface UserStats {
  userId: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  likesReceived: number;
  commentsReceived: number;
  reputation: number;
}
