// 创建临时的 API 对象
export const api = {
  skillPosts: {
    create: async (data: any) => {
      console.log("Mock API call:", data);
      return { success: true, data: { id: "mock-id" } };
    },
    get: async (id: string) => {
      console.log("Mock API get:", id);
      return { 
        success: true, 
        data: { 
          id, 
          title: "Mock Skill Post",
          description: "Mock description",
          authorId: "mock-author",
          authorName: "Mock Author",
          authorAvatar: undefined,
          category: "cosplay" as any,
          role: "coser" as any,
          experience: "intermediate" as any,
          city: "Mock City",
          price: { type: "fixed" as any, amount: 100, currency: "CNY" as any, negotiable: false },
          images: [],
          tags: [],
          availability: { weekdays: true, weekends: true, holidays: false, timeSlots: [], advance: 1 },
          contactInfo: { preferred: "wechat" as any, wechat: "", qq: "", phone: "", email: "" },
          stats: {
            viewCount: 0,
            likeCount: 0,
            favoriteCount: 0,
            contactCount: 0,
            responseRate: 100,
            avgRating: 5,
            reviewCount: 0
          },
          status: "published" as any,
          createdAt: new Date(),
          updatedAt: new Date()
        } 
      };
    },
    list: async (params: any) => {
      console.log("Mock API list:", params);
      return { 
        success: true, 
        data: { 
          items: [{
            id: "mock-1", 
            title: "Mock Skill Post 1",
            description: "Mock description",
            authorId: "mock-author",
            authorName: "Mock Author",
            authorAvatar: undefined,
            category: "cosplay" as any,
            role: "coser" as any,
            experience: "intermediate" as any,
            city: "Mock City",
            price: { type: "fixed" as any, amount: 100, currency: "CNY" as any, negotiable: false },
            images: [],
            tags: [],
            availability: { weekdays: true, weekends: true, holidays: false, timeSlots: [], advance: 1 },
            contactInfo: { preferred: "wechat" as any, wechat: "", qq: "", phone: "", email: "" },
            stats: {
              viewCount: 0,
              likeCount: 0,
              favoriteCount: 0,
              contactCount: 0,
              responseRate: 100,
              avgRating: 5,
              reviewCount: 0
            },
            status: "published" as any,
            createdAt: new Date(),
            updatedAt: new Date()
          }],
          total: 1,
          nextCursor: null,
          hasNext: false
        } 
      };
    }
  },
  upload: {
    uploadFile: async (file: File) => {
      console.log("Mock upload:", file);
      return { success: true, data: { url: "mock-url" } };
    },
    uploadFiles: async (files: FileList) => {
      console.log("Mock upload files:", files);
      return { success: true, data: { urls: ["mock-url-1", "mock-url-2"] } };
    }
  }
};

// 导出类型以便在组件中使用
export type {
  SkillPost,
  SkillRole,
  SkillCategory,
  CreateSkillPostDTO,
  SkillPostQueryDTO,
  SkillPostListResponse,
  ExperienceLevel,
  PriceType,
  ContactMethod,
  ApiResponse,
} from "@coshub/types";
