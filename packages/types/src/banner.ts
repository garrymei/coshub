/**
 * Banner相关类型定义
 */

export interface Banner {
  id: string;
  scene: BannerScene;
  imageUrl: string;
  linkType: BannerLinkType;
  linkUrl: string;
  priority: number;
  online: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum BannerScene {
  FEED = "feed", // 交流区
  SKILLS = "skills", // 技能区
  HOME = "home", // 首页
}

export enum BannerLinkType {
  EXTERNAL = "external", // 外部链接
  INTERNAL = "internal", // 内部链接
}

// DTO 类型定义
export interface CreateBannerDTO {
  scene: BannerScene;
  imageUrl: string;
  linkType: BannerLinkType;
  linkUrl: string;
  priority?: number;
  online?: boolean;
}

export type UpdateBannerDTO = Partial<CreateBannerDTO>

export interface BannerQueryDTO {
  scene?: BannerScene;
  online?: boolean;
}
