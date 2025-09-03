export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  city?: string;
  type: "showcase" | "tutorial" | "discussion" | "news" | "event";
  category:
    | "cosplay"
    | "photography"
    | "makeup"
    | "prop_making"
    | "costume_making"
    | "anime_discussion"
    | "community"
    | "tips_tricks";
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
