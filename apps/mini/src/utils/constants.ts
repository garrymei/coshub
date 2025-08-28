import { SkillCategory, SkillRole, ExperienceLevel, PriceType, ContactMethod } from '@coshub/types';

// 技能分类选项
export const SKILL_CATEGORIES = [
  { value: SkillCategory.COSPLAY, label: 'Cosplay 表演' },
  { value: SkillCategory.PHOTOGRAPHY, label: '摄影' },
  { value: SkillCategory.MAKEUP, label: '化妆' },
  { value: SkillCategory.PROP_MAKING, label: '道具制作' },
  { value: SkillCategory.COSTUME_MAKING, label: '服装制作' },
  { value: SkillCategory.POST_PROCESSING, label: '后期处理' },
  { value: SkillCategory.VIDEO_EDITING, label: '视频剪辑' },
  { value: SkillCategory.VOICE_ACTING, label: '配音' },
  { value: SkillCategory.DRAWING, label: '绘画' },
  { value: SkillCategory.WRITING, label: '写作' },
  { value: SkillCategory.DANCING, label: '舞蹈' },
  { value: SkillCategory.SINGING, label: '歌唱' }
];

// 角色类型选项
export const SKILL_ROLES = [
  { value: SkillRole.COSER, label: 'Cos 模特' },
  { value: SkillRole.PHOTOGRAPHER, label: '摄影师' },
  { value: SkillRole.MAKEUP_ARTIST, label: '化妆师' },
  { value: SkillRole.PROP_MAKER, label: '道具师' },
  { value: SkillRole.COSTUME_MAKER, label: '服装师' },
  { value: SkillRole.LOCATION_OWNER, label: '场地方' },
  { value: SkillRole.POST_PROCESSOR, label: '后期师' },
  { value: SkillRole.VIDEOGRAPHER, label: '摄像师' },
  { value: SkillRole.ORGANIZER, label: '活动组织者' }
];

// 经验等级选项
export const EXPERIENCE_LEVELS = [
  { value: ExperienceLevel.NEWBIE, label: '新手' },
  { value: ExperienceLevel.BEGINNER, label: '初级' },
  { value: ExperienceLevel.INTERMEDIATE, label: '中级' },
  { value: ExperienceLevel.ADVANCED, label: '高级' },
  { value: ExperienceLevel.PROFESSIONAL, label: '专业' }
];

// 价格类型选项
export const PRICE_TYPES = [
  { value: PriceType.FREE, label: '免费' },
  { value: PriceType.FIXED, label: '固定价格' },
  { value: PriceType.RANGE, label: '价格区间' },
  { value: PriceType.NEGOTIABLE, label: '面议' }
];

// 联系方式选项
export const CONTACT_METHODS = [
  { value: ContactMethod.WECHAT, label: '微信' },
  { value: ContactMethod.QQ, label: 'QQ' },
  { value: ContactMethod.PHONE, label: '电话' },
  { value: ContactMethod.EMAIL, label: '邮箱' },
  { value: ContactMethod.PLATFORM, label: '站内联系' }
];

// 常用城市列表
export const POPULAR_CITIES = [
  '北京', '上海', '广州', '深圳', '杭州', '南京', '武汉', '成都',
  '重庆', '西安', '苏州', '天津', '青岛', '长沙', '大连', '厦门'
];

// 获取标签
export const getLabel = (value: string, options: { value: string; label: string }[]): string => {
  return options.find(option => option.value === value)?.label || value;
};
