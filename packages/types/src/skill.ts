/**
 * 技能相关类型定义
 */

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description?: string;
  level: SkillLevel;
  isVerified: boolean;
  createdAt: Date;
}

export enum SkillCategory {
  COSPLAY = "cosplay", // cosplay表演
  MAKEUP = "makeup", // 化妆
  PHOTOGRAPHY = "photography", // 摄影
  POST_PROCESSING = "post_processing", // 后期处理
  PROP_MAKING = "prop_making", // 道具制作
  COSTUME_MAKING = "costume_making", // 服装制作
  VOICE_ACTING = "voice_acting", // 配音
  DRAWING = "drawing", // 绘画
  WRITING = "writing", // 写作
  VIDEO_EDITING = "video_editing", // 视频剪辑
  DANCING = "dancing", // 舞蹈
  SINGING = "singing", // 歌唱
}

export enum SkillLevel {
  BEGINNER = "beginner", // 初学者
  INTERMEDIATE = "intermediate", // 中级
  ADVANCED = "advanced", // 高级
  EXPERT = "expert", // 专家
  MASTER = "master", // 大师
}

export interface SkillCertification {
  id: string;
  userId: string;
  skillId: string;
  certifierUserId: string;
  level: SkillLevel;
  comment?: string;
  createdAt: Date;
}
