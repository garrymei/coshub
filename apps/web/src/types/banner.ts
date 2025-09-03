export interface Banner {
  id: string;
  scene: "feed" | "skills";
  imageUrl: string;
  linkType: "external" | "internal";
  linkUrl: string;
  priority: number;
  online: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBannerDTO {
  scene: "feed" | "skills";
  imageUrl: string;
  linkType: "external" | "internal";
  linkUrl: string;
  priority?: number;
  online?: boolean;
}

export interface UpdateBannerDTO extends Partial<CreateBannerDTO> {}

export interface BannerQueryDTO {
  scene?: "feed" | "skills";
  online?: boolean;
}
