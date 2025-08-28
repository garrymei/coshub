/**
 * 请求相关类型定义
 */

export interface RequestBase {
  id: string;
  title: string;
  description: string;
  userId: string;
  status: RequestStatus;
  priority: RequestPriority;
  budget?: BudgetRange;
  deadline?: Date;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CosplayRequest extends RequestBase {
  type: 'cosplay';
  character: string;
  anime: string;
  requiredSkills: SkillCategory[];
  eventDate?: Date;
  isPrivateEvent: boolean;
}

export interface PhotographyRequest extends RequestBase {
  type: 'photography';
  shootingStyle: PhotographyStyle;
  numberOfPhotos: number;
  includesEditing: boolean;
  equipmentProvided: boolean;
}

export interface MakeupRequest extends RequestBase {
  type: 'makeup';
  character: string;
  complexity: ComplexityLevel;
  duration: number; // 小时
  includesHair: boolean;
}

export type Request = CosplayRequest | PhotographyRequest | MakeupRequest;

export enum RequestStatus {
  DRAFT = 'draft',           // 草稿
  PUBLISHED = 'published',   // 已发布
  IN_PROGRESS = 'in_progress', // 进行中
  COMPLETED = 'completed',   // 已完成
  CANCELLED = 'cancelled'    // 已取消
}

export enum RequestPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface BudgetRange {
  min: number;
  max: number;
  currency: 'CNY' | 'USD' | 'JPY';
}

export enum PhotographyStyle {
  PORTRAIT = 'portrait',
  SCENE = 'scene',
  ACTION = 'action',
  STUDIO = 'studio',
  OUTDOOR = 'outdoor'
}

export enum ComplexityLevel {
  SIMPLE = 'simple',     // 简单
  MEDIUM = 'medium',     // 中等
  COMPLEX = 'complex',   // 复杂
  EXTREME = 'extreme'    // 极难
}

export interface RequestApplication {
  id: string;
  requestId: string;
  applicantUserId: string;
  message: string;
  proposedBudget?: number;
  estimatedDuration?: number;
  portfolio: string[]; // 作品链接
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum ApplicationStatus {
  PENDING = 'pending',     // 待审核
  ACCEPTED = 'accepted',   // 已接受
  REJECTED = 'rejected',   // 已拒绝
  WITHDRAWN = 'withdrawn'  // 已撤回
}
