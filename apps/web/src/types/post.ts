export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  city?: string;
  type: "SHARE" | "TUTORIAL" | "DISCUSSION" | "NEWS" | "EVENT";
  category:
    | "COSPLAY_SHOW"
    | "TUTORIAL"
    | "EVENT_REPORT"
    | "DISCUSSION"
    | "NEWS"
    | "RESOURCE";
  tags: string[];
  images: string[];
  videos: string[];
  stats: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
    shareCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
  status?: "pending" | "approved" | "rejected";
}

export interface CreatePostRequest {
  type: "work" | "skill";
  media: string[]; // 上传后的文件 URL
  tags: string[];

  // 作品帖字段
  caption?: string;

  // 技能帖字段
  price?: number;
  currency?: "CNY" | "USD";
  skillTags?: string[];
  city?: string;
  serviceRadiusKm?: number;
  availableSlots?: string[];
  desc?: string;
}

export interface PostListResponse {
  posts: Post[];
  nextCursor?: string;
  hasMore: boolean;
  total: number;
}
