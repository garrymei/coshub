export enum UserRole {
  COSER = "COSER", // Coser
  PHOTOGRAPHER = "PHOTOGRAPHER", // 摄影师
  MAKEUP_ARTIST = "MAKEUP_ARTIST", // 妆娘
  WIG_MAKER = "WIG_MAKER", // 毛娘
  PROP_MAKER = "PROP_MAKER", // 道具师
  ADMIN = "ADMIN", // 管理员
  MODERATOR = "MODERATOR", // 版主
  USER = "USER", // 普通用户
}

export enum Permission {
  // 内容管理权限
  CREATE_SKILL_POST = "CREATE_SKILL_POST", // 发布技能帖
  EDIT_SKILL_POST = "EDIT_SKILL_POST", // 编辑技能帖
  DELETE_SKILL_POST = "DELETE_SKILL_POST", // 删除技能帖
  MODERATE_SKILL_POST = "MODERATE_SKILL_POST", // 审核技能帖

  // 帖子管理权限
  CREATE_POST = "CREATE_POST", // 发布帖子
  EDIT_POST = "EDIT_POST", // 编辑帖子
  DELETE_POST = "DELETE_POST", // 删除帖子

  // Banner管理权限
  MANAGE_BANNERS = "MANAGE_BANNERS", // 管理Banner

  // 用户管理权限
  VIEW_USER_PROFILE = "VIEW_USER_PROFILE", // 查看用户资料
  EDIT_USER_PROFILE = "EDIT_USER_PROFILE", // 编辑用户资料
  MANAGE_USERS = "MANAGE_USERS", // 管理用户

  // 内容审核权限
  REVIEW_REPORTS = "REVIEW_REPORTS", // 审核举报
  MODERATE_CONTENT = "MODERATE_CONTENT", // 内容审核
  MANAGE_REPORTS = "MANAGE_REPORTS", // 管理举报
  CREATE_REPORT = "CREATE_REPORT", // 创建举报
  VIEW_REPORTS = "VIEW_REPORTS", // 查看举报
  
  // 帖子交互权限
  INTERACT_POST = "INTERACT_POST", // 与帖子交互（点赞、收藏等）
  COMMENT_POST = "COMMENT_POST", // 评论帖子
  
  // 用户权限
  EDIT_PROFILE = "EDIT_PROFILE", // 编辑个人资料
  VIEW_PROFILE = "VIEW_PROFILE", // 查看个人资料

  // 系统管理权限
  SYSTEM_CONFIG = "SYSTEM_CONFIG", // 系统配置
  VIEW_LOGS = "VIEW_LOGS", // 查看日志
  MANAGE_CACHE = "MANAGE_CACHE", // 管理缓存
}

export interface RolePermission {
  role: UserRole;
  permissions: Permission[];
  description: string;
}

export const ROLE_PERMISSIONS: RolePermission[] = [
  {
    role: UserRole.USER,
    permissions: [Permission.VIEW_USER_PROFILE, Permission.EDIT_USER_PROFILE],
    description: "基础用户权限",
  },
  {
    role: UserRole.COSER,
    permissions: [
      Permission.CREATE_SKILL_POST,
      Permission.EDIT_SKILL_POST,
      Permission.DELETE_SKILL_POST,
      Permission.VIEW_USER_PROFILE,
      Permission.EDIT_USER_PROFILE,
    ],
    description: "Coser用户权限",
  },
  {
    role: UserRole.PHOTOGRAPHER,
    permissions: [
      Permission.CREATE_SKILL_POST,
      Permission.EDIT_SKILL_POST,
      Permission.DELETE_SKILL_POST,
      Permission.VIEW_USER_PROFILE,
      Permission.EDIT_USER_PROFILE,
    ],
    description: "摄影师用户权限",
  },
  {
    role: UserRole.MAKEUP_ARTIST,
    permissions: [
      Permission.CREATE_SKILL_POST,
      Permission.EDIT_SKILL_POST,
      Permission.DELETE_SKILL_POST,
      Permission.VIEW_USER_PROFILE,
      Permission.EDIT_USER_PROFILE,
    ],
    description: "妆娘用户权限",
  },
  {
    role: UserRole.WIG_MAKER,
    permissions: [
      Permission.CREATE_SKILL_POST,
      Permission.EDIT_SKILL_POST,
      Permission.DELETE_SKILL_POST,
      Permission.VIEW_USER_PROFILE,
      Permission.EDIT_USER_PROFILE,
    ],
    description: "毛娘用户权限",
  },
  {
    role: UserRole.PROP_MAKER,
    permissions: [
      Permission.CREATE_SKILL_POST,
      Permission.EDIT_SKILL_POST,
      Permission.DELETE_SKILL_POST,
      Permission.VIEW_USER_PROFILE,
      Permission.EDIT_USER_PROFILE,
    ],
    description: "道具师用户权限",
  },
  {
    role: UserRole.MODERATOR,
    permissions: [
      Permission.CREATE_SKILL_POST,
      Permission.EDIT_SKILL_POST,
      Permission.DELETE_SKILL_POST,
      Permission.VIEW_USER_PROFILE,
      Permission.EDIT_USER_PROFILE,
      Permission.REVIEW_REPORTS,
      Permission.MODERATE_CONTENT,
      Permission.MANAGE_REPORTS,
      Permission.VIEW_LOGS,
    ],
    description: "版主权限",
  },
  {
    role: UserRole.ADMIN,
    permissions: Object.values(Permission),
    description: "管理员权限",
  },
];

// 速率限制配置
export interface RateLimitConfig {
  windowMs: number; // 时间窗口（毫秒）
  max: number; // 最大请求次数
  message: string; // 限制消息
  statusCode: number; // 状态码
  headers: boolean; // 是否添加限制头
}

export enum RateLimitType {
  // 认证相关
  LOGIN = "LOGIN", // 登录尝试
  REGISTER = "REGISTER", // 注册尝试
  PASSWORD_RESET = "PASSWORD_RESET", // 密码重置

  // 内容相关
  CREATE_POST = "CREATE_POST", // 发布内容
  EDIT_POST = "EDIT_POST", // 编辑内容
  DELETE_POST = "DELETE_POST", // 删除内容

  // 交互相关
  COMMENT = "COMMENT", // 评论
  LIKE = "LIKE", // 点赞
  REPORT = "REPORT", // 举报
  INTERACT_POST = "INTERACT_POST", // 帖子交互
  COMMENT_POST = "COMMENT_POST", // 评论帖子

  // 上传相关
  UPLOAD_FILE = "UPLOAD_FILE", // 文件上传
  UPLOAD_IMAGE = "UPLOAD_IMAGE", // 图片上传

  // API相关
  API_REQUEST = "API_REQUEST", // API请求
  SEARCH = "SEARCH", // 搜索请求
}

export const RATE_LIMIT_CONFIGS: Record<RateLimitType, RateLimitConfig> = {
  [RateLimitType.LOGIN]: {
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 5, // 最多5次
    message: "登录尝试过于频繁，请15分钟后再试",
    statusCode: 429,
    headers: true,
  },
  [RateLimitType.REGISTER]: {
    windowMs: 60 * 60 * 1000, // 1小时
    max: 3, // 最多3次
    message: "注册尝试过于频繁，请1小时后再试",
    statusCode: 429,
    headers: true,
  },
  [RateLimitType.PASSWORD_RESET]: {
    windowMs: 60 * 60 * 1000, // 1小时
    max: 3, // 最多3次
    message: "密码重置请求过于频繁，请1小时后再试",
    statusCode: 429,
    headers: true,
  },
  [RateLimitType.CREATE_POST]: {
    windowMs: 60 * 60 * 1000, // 1小时
    max: 10, // 最多10次
    message: "发布内容过于频繁，请1小时后再试",
    statusCode: 429,
    headers: true,
  },
  [RateLimitType.EDIT_POST]: {
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 20, // 最多20次
    message: "编辑内容过于频繁，请15分钟后再试",
    statusCode: 429,
    headers: true,
  },
  [RateLimitType.DELETE_POST]: {
    windowMs: 60 * 60 * 1000, // 1小时
    max: 5, // 最多5次
    message: "删除内容过于频繁，请1小时后再试",
    statusCode: 429,
    headers: true,
  },
  [RateLimitType.COMMENT]: {
    windowMs: 5 * 60 * 1000, // 5分钟
    max: 30, // 最多30次
    message: "评论过于频繁，请5分钟后再试",
    statusCode: 429,
    headers: true,
  },
  [RateLimitType.LIKE]: {
    windowMs: 1 * 60 * 1000, // 1分钟
    max: 100, // 最多100次
    message: "操作过于频繁，请1分钟后再试",
    statusCode: 429,
    headers: true,
  },
  [RateLimitType.REPORT]: {
    windowMs: 60 * 60 * 1000, // 1小时
    max: 5, // 最多5次
    message: "举报过于频繁，请1小时后再试",
    statusCode: 429,
    headers: true,
  },
  [RateLimitType.UPLOAD_FILE]: {
    windowMs: 60 * 60 * 1000, // 1小时
    max: 50, // 最多50次
    message: "文件上传过于频繁，请1小时后再试",
    statusCode: 429,
    headers: true,
  },
  [RateLimitType.UPLOAD_IMAGE]: {
    windowMs: 60 * 60 * 1000, // 1小时
    max: 100, // 最多100次
    message: "图片上传过于频繁，请1小时后再试",
    statusCode: 429,
    headers: true,
  },
  [RateLimitType.API_REQUEST]: {
    windowMs: 60 * 1000, // 1分钟
    max: 1000, // 最多1000次
    message: "API请求过于频繁，请1分钟后再试",
    statusCode: 429,
    headers: true,
  },
  [RateLimitType.SEARCH]: {
    windowMs: 1 * 60 * 1000, // 1分钟
    max: 200, // 最多200次
    message: "搜索请求过于频繁，请1分钟后再试",
    statusCode: 429,
    headers: true,
  },
  [RateLimitType.INTERACT_POST]: {
    windowMs: 1 * 60 * 1000, // 1分钟
    max: 100, // 最多100次
    message: "帖子交互过于频繁，请1分钟后再试",
    statusCode: 429,
    headers: true,
  },
  [RateLimitType.COMMENT_POST]: {
    windowMs: 1 * 60 * 1000, // 1分钟
    max: 50, // 最多50次
    message: "评论过于频繁，请1分钟后再试",
    statusCode: 429,
    headers: true,
  },
};

// 权限检查接口
export interface PermissionCheck {
  userId: string;
  permission: Permission;
  resourceId?: string;
  resourceType?: string;
}

// 权限检查结果
export interface PermissionResult {
  allowed: boolean;
  reason?: string;
  role?: UserRole;
}
