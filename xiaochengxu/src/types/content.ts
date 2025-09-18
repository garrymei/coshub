export interface CarouselItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
}

export interface DynamicUser {
  avatar: string;
  name: string;
  location?: string;
}

export interface DynamicContent {
  text: string;
  images: string[];
  tags: string[];
}

export interface DynamicStats {
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface DynamicItem {
  id: string;
  user: DynamicUser;
  content: DynamicContent;
  stats: DynamicStats;
  publishedAt: string;
}

export interface SquareTopic {
  label: string;
  value: string;
}

export interface SkillInstructor {
  name: string;
  avatar: string;
  rating: number;
}

export interface SkillCourse {
  id: string;
  title: string;
  description: string;
  instructor: SkillInstructor;
  category: string;
  difficulty: '初级' | '中级' | '高级' | string;
  duration: string;
  students: number;
  price: number;
  thumbnail: string;
  tags: string[];
}

export interface ProfileStats {
  dynamics: number;
  followers: number;
  following: number;
  likes: number;
}

export interface ProfileHighlight {
  id: string;
  icon: 'heart' | 'bookmark' | 'users' | 'settings';
  label: string;
}

export interface ProfilePost {
  id: string;
  image: string;
  title: string;
  likes: number;
  views: string;
}

export interface ProfileData {
  user: {
    name: string;
    bio: string;
    avatar: string;
    location?: string;
    website?: string;
    tags: string[];
    certifications?: string[];
  };
  stats: ProfileStats;
  posts: ProfilePost[];
  liked: ProfilePost[];
  skills: SkillCourse[];
  highlights: ProfileHighlight[];
}

export interface HomeFeedData {
  carousel: CarouselItem[];
  dynamics: DynamicItem[];
}

export interface SquareFeedData {
  dynamics: DynamicItem[];
  topics: SquareTopic[];
}

export interface SkillsCatalog {
  categories: string[];
  courses: SkillCourse[];
}
