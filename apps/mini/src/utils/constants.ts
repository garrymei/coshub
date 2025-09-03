// 技能分类
export const SKILL_CATEGORIES = [
  { label: "Cosplay", value: "cosplay" },
  { label: "摄影", value: "photography" },
  { label: "妆容", value: "makeup" },
  { label: "道具制作", value: "props" },
  { label: "服装定制", value: "costume" },
  { label: "后期修图", value: "editing" },
  { label: "其他", value: "other" },
];

// 角色标签
export const SKILL_ROLES = [
  { label: "Coser", value: "coser" },
  { label: "摄影师", value: "photographer" },
  { label: "妆娘", value: "makeup_artist" },
  { label: "毛娘", value: "wig_stylist" },
  { label: "道具师", value: "prop_maker" },
  { label: "后期师", value: "editor" },
  { label: "服装师", value: "costume_designer" },
];

// 经验等级
export const EXPERIENCE_LEVELS = [
  { label: "新手", value: "beginner" },
  { label: "业余", value: "amateur" },
  { label: "专业", value: "professional" },
  { label: "大师", value: "master" },
];

// 价格类型
export const PRICE_TYPES = [
  { label: "免费", value: "free" },
  { label: "固定价格", value: "fixed" },
  { label: "起步价", value: "starting" },
  { label: "面议", value: "negotiable" },
];

// 联系方式
export const CONTACT_METHODS = [
  { label: "微信", value: "wechat" },
  { label: "QQ", value: "qq" },
  { label: "电话", value: "phone" },
  { label: "邮箱", value: "email" },
];

// 热门城市
export const POPULAR_CITIES = [
  "上海",
  "北京",
  "广州",
  "深圳",
  "成都",
  "杭州",
  "武汉",
  "南京",
  "重庆",
  "西安",
];

// 帖子类型
export const POST_TYPES = [
  { label: "技能", value: "skill" },
  { label: "分享", value: "share" },
];

// 标签推荐
export const RECOMMENDED_TAGS = [
  "二次元",
  "Cosplay",
  "动漫",
  "摄影",
  "妆容",
  "道具",
  "服装",
  "后期",
  "漫展",
  "同人",
];

// 内容审核类型
export const CONTENT_REVIEW_TYPES = {
  TEXT: "text",
  IMAGE: "image",
};

// 互动类型
export const INTERACTION_TYPES = {
  LIKE: "like",
  COMMENT: "comment",
  COLLECT: "collect",
  SHARE: "share",
};

// 通知类型
export const NOTIFICATION_TYPES = {
  LIKE: "like",
  COMMENT: "comment",
  FOLLOW: "follow",
  SYSTEM: "system",
};

// 用户角色
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

// 状态码
export const STATUS_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// 本地存储键
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER_INFO: "userInfo",
  SETTINGS: "settings",
};
