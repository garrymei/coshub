import {
  CarouselItem,
  DynamicItem,
  HomeFeedData,
  ProfileData,
  SkillCourse,
  SkillsCatalog,
  SquareFeedData,
} from "../types/content";

const networkDelay = (ms = 240) => new Promise((resolve) => setTimeout(resolve, ms));

const homeFeedMock: HomeFeedData = {
  carousel: [
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1639784119996-3de5792ddff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBiYW5uZXIlMjB5b3VuZyUyMHBlb3BsZXxlbnwxfHx8fDE3NTcwNjIyNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "青春无限",
      subtitle: "发现更多精彩生活",
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1464854860390-e95991b46441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "时尚达人",
      subtitle: "分享你的穿搭灵感",
    },
    {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1578960281840-cb36759fb109?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "美食探店",
      subtitle: "记录每一次味蕾旅程",
    },
  ],
  dynamics: [
    {
      id: "1",
      user: {
        avatar:
          "https://images.unsplash.com/photo-1632506823413-200b3d091e90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXdhaWklMjBhbmltZSUyMGdpcmx8ZW58MXx8fHwxNzU3MDYxNTU1fDA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral",
        name: "甜心小可爱",
        location: "上海 · 静安",
      },
      content: {
        text: "今天和朋友们去了新开的网红咖啡店，环境超棒！咖啡香醇，拍照超出片～推荐给大家~",
        images: [
          "https://images.unsplash.com/photo-1578960281840-cb36759fb109?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1464854860390-e95991b46441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
        ],
        tags: ["咖啡", "网红店", "拍照圣地", "周末好去处"],
      },
      stats: {
        likes: 128,
        comments: 23,
        isLiked: false,
        isBookmarked: false,
      },
      publishedAt: "2024-09-17T08:30:00Z",
    },
    {
      id: "2",
      user: {
        avatar:
          "https://images.unsplash.com/photo-1697059172415-f1e08f9151bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzA1NDE4Nnww&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral",
        name: "时尚达人 Lily",
        location: "北京 · 朝阳",
      },
      content: {
        text: "春日穿搭分享！这套 look 舒适又时尚，颜色搭配超清新，收获了好多赞美~",
        images: [
          "https://images.unsplash.com/photo-1639784119996-3de5792ddff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBiYW5uZXIlMjB5b3VuZyUyMHBlb3BsZXxlbnwxfHx8fDE3NTcwNjIyNjN8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
        ],
        tags: ["春日穿搭", "时尚", "OOTD", "清新色系"],
      },
      stats: {
        likes: 89,
        comments: 15,
        isLiked: true,
        isBookmarked: true,
      },
      publishedAt: "2024-09-16T11:10:00Z",
    },
  ],
};

const squareFeedMock: SquareFeedData = {
  dynamics: [
    {
      id: "1",
      user: {
        avatar:
          "https://images.unsplash.com/photo-1673047233994-78df05226bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwYW5pbWUlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzU3MDYxNTU5fDA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral",
        name: "旅行小达人",
        location: "杭州 · 西湖",
      },
      content: {
        text: "周末去西湖边走走，樱花盛开，游人如织，每一帧都是明信片级别的风景~",
        images: [
          "https://images.unsplash.com/photo-1577949619851-db947ef972af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBsaWZlc3R5bGUlMjBiYW5uZXJ8ZW58MXx8fHwxNzU3MDYyMjY0fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1639784119996-3de5792ddff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBiYW5uZXIlMjB5b3VuZyUyMHBlb3BsZXxlbnwxfHx8fDE3NTcwNjIyNjN8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1464854860390-e95991b46441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
        ],
        tags: ["旅行", "杭州", "西湖", "春游", "樱花"],
      },
      stats: {
        likes: 256,
        comments: 42,
        isLiked: false,
        isBookmarked: false,
      },
      publishedAt: "2024-09-15T09:20:00Z",
    },
    {
      id: "2",
      user: {
        avatar:
          "https://images.unsplash.com/photo-1581132285926-a4c91a76ef14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGdpcmwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTcwNjE1NjJ8MA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral",
        name: "美食探索家",
        location: "广州 · 天河",
      },
      content: {
        text: "发现一家超棒的粤菜餐厅！招牌白切鸡嫩滑无比，虾饺皮薄馅鲜，环境也很雅致。价格合理，值得推荐！",
        images: [
          "https://images.unsplash.com/photo-1578960281840-cb36759fb109?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
        ],
        tags: ["美食", "粤菜", "广州", "探店", "推荐"],
      },
      stats: {
        likes: 189,
        comments: 28,
        isLiked: true,
        isBookmarked: true,
      },
      publishedAt: "2024-09-14T13:55:00Z",
    },
    {
      id: "3",
      user: {
        avatar:
          "https://images.unsplash.com/photo-1641298583600-7d6ad2098298?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMGNvc3BsYXl8ZW58MXx8fHwxNzU3MDYxNTY1fDA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral",
        name: "健身小姐姐",
        location: "深圳 · 南山",
      },
      content: {
        text: "今天的健身打卡！坚持 30 天晨练，整个人状态完全不一样。分享一些简单居家运动，一起变强~",
        images: [
          "https://images.unsplash.com/photo-1639784119996-3de5792ddff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBiYW5uZXIlMjB5b3VuZyUyMHBlb3BsZXxlbnwxfHx8fDE3NTcwNjIyNjN8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1588912914078-2fe5224fd8b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2lsbHMlMjBsZWFybmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTcwNjIyNjV8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
        ],
        tags: ["健身", "晨练", "打卡", "运动", "健康生活"],
      },
      stats: {
        likes: 312,
        comments: 56,
        isLiked: false,
        isBookmarked: false,
      },
      publishedAt: "2024-09-13T07:40:00Z",
    },
  ],
  topics: [
    { label: "#春日穿搭", value: "spring-outfit" },
    { label: "#美食探店", value: "food-spot" },
    { label: "#旅行日记", value: "travel" },
    { label: "#健身打卡", value: "fitness" },
    { label: "#护肤心得", value: "skincare" },
    { label: "#学习分享", value: "study" },
  ],
};

const skillsCatalogMock: SkillsCatalog = {
  categories: ["全部", "编程", "设计", "摄影", "健身", "语言", "音乐", "烘焙"],
  courses: [
    {
      id: "1",
      title: "Python 零基础入门到实战",
      description: "从零开始学习 Python 编程，掌握基础语法并完成真实项目，适合编程小白。",
      instructor: {
        name: "张老师",
        avatar:
          "https://images.unsplash.com/photo-1588912914078-2fe5224fd8b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2lsbHMlMjBsZWFybmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTcwNjIyNjV8MA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral",
        rating: 4.8,
      },
      category: "编程",
      difficulty: "初级",
      duration: "30 小时",
      students: 2847,
      price: 199,
      thumbnail:
        "https://images.unsplash.com/photo-1588912914078-2fe5224fd8b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2lsbHMlMjBsZWFybmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTcwNjIyNjV8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      tags: ["Python", "编程入门", "实战项目"],
    },
    {
      id: "2",
      title: "手机摄影技巧大揭秘",
      description: "用手机拍出专业级照片，涵盖构图、光线与后期的全方位技巧拆解。",
      instructor: {
        name: "小美老师",
        avatar:
          "https://images.unsplash.com/photo-1639784119996-3de5792ddff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBiYW5uZXIlMjB5b3VuZyUyMHBlb3BsZXxlbnwxfHx8fDE3NTcwNjIyNjN8MA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral",
        rating: 4.9,
      },
      category: "摄影",
      difficulty: "初级",
      duration: "15 小时",
      students: 1623,
      price: 0,
      thumbnail:
        "https://images.unsplash.com/photo-1639784119996-3de5792ddff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBiYW5uZXIlMjB5b3VuZyUyMHBlb3BsZXxlbnwxfHx8fDE3NTcwNjIyNjN8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      tags: ["手机摄影", "构图技巧", "免费课程"],
    },
    {
      id: "3",
      title: "UI 设计系统化学习",
      description: "系统学习 UI 设计，从设计理论到实操案例，掌握 Figma 等核心工具。",
      instructor: {
        name: "设计师阿青",
        avatar:
          "https://images.unsplash.com/photo-1464854860390-e95991b46441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral",
        rating: 4.7,
      },
      category: "设计",
      difficulty: "中级",
      duration: "45 小时",
      students: 987,
      price: 399,
      thumbnail:
        "https://images.unsplash.com/photo-1464854860390-e95991b46441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      tags: ["UI 设计", "Figma", "设计系统"],
    },
    {
      id: "4",
      title: "健身训练营：塑造理想身材",
      description: "专业教练指导，科学训练计划，帮你在家也能练出好身材。",
      instructor: {
        name: "健身达人小李",
        avatar:
          "https://images.unsplash.com/photo-1578960281840-cb36759fb109?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral",
        rating: 4.6,
      },
      category: "健身",
      difficulty: "初级",
      duration: "20 小时",
      students: 3421,
      price: 99,
      thumbnail:
        "https://images.unsplash.com/photo-1578960281840-cb36759fb109?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      tags: ["健身", "塑形", "居家运动"],
    },
    {
      id: "5",
      title: "英语口语突破训练",
      description: "地道英语表达 + 情景对话练习，让你的口语更流利自信。",
      instructor: {
        name: "Emma 老师",
        avatar:
          "https://images.unsplash.com/photo-1577949619851-db947ef972af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBsaWZlc3R5bGUlMjBiYW5uZXJ8ZW58MXx8fHwxNzU3MDYyMjY0fDA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral",
        rating: 4.8,
      },
      category: "语言",
      difficulty: "中级",
      duration: "25 小时",
      students: 1567,
      price: 299,
      thumbnail:
        "https://images.unsplash.com/photo-1577949619851-db947ef972af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBsaWZlc3R5bGUlMjBiYW5uZXJ8ZW58MXx8fHwxNzU3MDYyMjY0fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      tags: ["英语口语", "情景对话", "流利表达"],
    },
  ],
};

const profileMock: ProfileData = {
  user: {
    name: "甜心小可爱",
    bio: "热爱分享生活，每天记录一点小美好。",
    avatar:
      "https://images.unsplash.com/photo-1632506823413-200b3d091e90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXdhaWklMjBhbmltZSUyMGdpcmx8ZW58MXx8fHwxNzU3MDYxNTU1fDA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral",
    location: "上海",
    website: "https://coshub.example.com",
    tags: ["生活方式", "美食", "穿搭"],
    certifications: ["2023 优质内容创作者"],
  },
  stats: {
    dynamics: 23,
    followers: 156,
    following: 89,
    likes: 342,
  },
  highlights: [
    { id: "likes", icon: "heart", label: "我的点赞" },
    { id: "bookmarks", icon: "bookmark", label: "我的收藏" },
    { id: "following", icon: "users", label: "我的关注" },
    { id: "settings", icon: "settings", label: "设置" },
  ],
  posts: [
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1697059172415-f1e08f9151bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzA1NDE4Nnww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      title: "青春甜美时光",
      likes: 245,
      views: "6.8k",
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1632506823413-200b3d091e90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXdhaWklMjBhbmltZSUyMGdpcmx8ZW58MXx8fHwxNzU3MDYxNTU1fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      title: "梦幻公主",
      likes: 389,
      views: "12.3k",
    },
    {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1673047233994-78df05226bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwYW5pbWUlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzU3MDYxNTU5fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      title: "温柔时光",
      likes: 156,
      views: "4.2k",
    },
    {
      id: "4",
      image:
        "https://images.unsplash.com/photo-1581132285926-a4c91a76ef14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGdpcmwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTcwNjE1NjJ8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      title: "午后阳光",
      likes: 203,
      views: "7.1k",
    },
    {
      id: "5",
      image:
        "https://images.unsplash.com/photo-1641298583600-7d6ad2098298?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMGNvc3BsYXl8ZW58MXx8fHwxNzU3MDYxNTY1fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      title: "春日花语",
      likes: 298,
      views: "9.5k",
    },
    {
      id: "6",
      image:
        "https://images.unsplash.com/photo-1697059172415-f1e08f9151bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzA1NDE4Nnww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      title: "甜美笑容",
      likes: 421,
      views: "15.2k",
    },
  ],
  liked: [
    {
      id: "7",
      image:
        "https://images.unsplash.com/photo-1632506823413-200b3d091e90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXdhaWklMjBhbmltZSUyMGdpcmx8ZW58MXx8fHwxNzU3MDYxNTU1fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      title: "可爱头像",
      likes: 189,
      views: "5.6k",
    },
    {
      id: "8",
      image:
        "https://images.unsplash.com/photo-1673047233994-78df05226bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwYW5pbWUlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzU3MDYxNTU5fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      title: "梦幻少女",
      likes: 267,
      views: "8.3k",
    },
    {
      id: "9",
      image:
        "https://images.unsplash.com/photo-1581132285926-a4c91a76ef14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGdpcmwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTcwNjE1NjJ8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      title: "纯真年代",
      likes: 134,
      views: "3.9k",
    },
  ],
  skills: skillsCatalogMock.courses.slice(0, 2),
};

const cloneDynamic = (dynamic: DynamicItem): DynamicItem => ({
  ...dynamic,
  user: { ...dynamic.user },
  content: {
    ...dynamic.content,
    images: [...dynamic.content.images],
    tags: [...dynamic.content.tags],
  },
  stats: { ...dynamic.stats },
});

const cloneCourse = (course: SkillCourse): SkillCourse => ({
  ...course,
  instructor: { ...course.instructor },
  tags: [...course.tags],
});

const cloneCarousel = (item: CarouselItem): CarouselItem => ({ ...item });

export async function fetchHomeFeed(): Promise<HomeFeedData> {
  await networkDelay();
  return {
    carousel: homeFeedMock.carousel.map(cloneCarousel),
    dynamics: homeFeedMock.dynamics.map(cloneDynamic),
  };
}

export async function fetchSquareFeed(): Promise<SquareFeedData> {
  await networkDelay();
  return {
    dynamics: squareFeedMock.dynamics.map(cloneDynamic),
    topics: squareFeedMock.topics.map((topic) => ({ ...topic })),
  };
}

export async function fetchSkillsCatalog(): Promise<SkillsCatalog> {
  await networkDelay();
  return {
    categories: [...skillsCatalogMock.categories],
    courses: skillsCatalogMock.courses.map(cloneCourse),
  };
}

export async function fetchProfile(): Promise<ProfileData> {
  await networkDelay();
  return {
    user: {
      ...profileMock.user,
      tags: [...profileMock.user.tags],
      certifications: profileMock.user.certifications
        ? [...profileMock.user.certifications]
        : undefined,
    },
    stats: { ...profileMock.stats },
    highlights: profileMock.highlights.map((highlight) => ({ ...highlight })),
    posts: profileMock.posts.map((post) => ({ ...post })),
    liked: profileMock.liked.map((post) => ({ ...post })),
    skills: profileMock.skills.map(cloneCourse),
  };
}
