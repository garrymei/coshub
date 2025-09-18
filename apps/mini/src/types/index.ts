// 用户模型
export interface User {
  id: string;
  openid?: string;
  nickname: string;
  avatar: string;
  bio?: string;
  location?: string;
  tags?: string[];
  followingCount: number;
  followersCount: number;
  createdAt: string;
  updatedAt: string;
}

// 基础帖子模型
export interface Post {
  id: string;
  authorId?: string;
  author?: User;
  user?: User; // 兼容不同的命名
  type?: "skill" | "share";
  media?: string[];
  images?: string[]; // 兼容不同的命名
  content?: string; // 兼容不同的命名
  caption?: string;
  tags?: string[];
  likeCount: number;
  commentCount: number;
  collectCount: number;
  isLiked?: boolean;
  isCollected?: boolean;
  createdAt: string;
  updatedAt: string;
}

// 技能帖子模型（扩展自帖子）
export interface SkillPost extends Post {
  price: number;
  skillTags: string[];
  contactInfo?: string;
  serviceDescription: string;
}

// 技能服务模型
export interface Skill {
  id: string;
  userId: string;
  user: User;
  title: string;
  description: string;
  price: number;
  category: "makeup" | "photography" | "editing" | "props" | "wigs";
  images: string[];
  tags: string[];
  city: string;
  createdAt: string;
  updatedAt: string;
}

// 互动模型（点赞、收藏、评论）
export interface Interaction {
  id: string;
  postId: string;
  userId: string;
  type: "like" | "collect" | "comment";
  comment?: string;
  createdAt: string;
}

// 评论模型
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user?: User;
  content: string;
  likeCount: number;
  isLiked?: boolean;
  createdAt: string;
  replyTo?: string;
}

// Banner模型
export interface Banner {
  id: string;
  imageUrl: string;
  linkType: "post" | "skill" | "external" | "page";
  linkUrl: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
}
