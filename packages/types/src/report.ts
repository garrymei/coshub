export enum ReportType {
  SPAM = "SPAM",           // 垃圾信息
  INAPPROPRIATE = "INAPPROPRIATE", // 不当内容
  HARASSMENT = "HARASSMENT",       // 骚扰行为
  COPYRIGHT = "COPYRIGHT",         // 版权侵犯
  VIOLENCE = "VIOLENCE",           // 暴力内容
  OTHER = "OTHER",                 // 其他
}

export enum ReportTargetType {
  SKILL_POST = "SKILL_POST",       // 技能帖
  USER = "USER",                   // 用户
  COMMENT = "COMMENT",             // 评论
  MESSAGE = "MESSAGE",             // 私信
}

export enum ReportReason {
  SPAM = "SPAM",                   // 垃圾信息
  INAPPROPRIATE_CONTENT = "INAPPROPRIATE_CONTENT", // 不当内容
  HARASSMENT = "HARASSMENT",       // 骚扰行为
  COPYRIGHT_VIOLATION = "COPYRIGHT_VIOLATION",     // 版权侵犯
  VIOLENCE = "VIOLENCE",           // 暴力内容
  FRAUD = "FRAUD",                 // 欺诈行为
  OTHER = "OTHER",                 // 其他
}

export enum ReportStatus {
  PENDING = "PENDING",             // 待审核
  REVIEWING = "REVIEWING",         // 审核中
  RESOLVED = "RESOLVED",           // 已处理
  REJECTED = "REJECTED",           // 已驳回
  CLOSED = "CLOSED",               // 已关闭
}

export interface CreateReportDTO {
  type: ReportType;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description: string;
  content?: string;                // 举报内容（用于内容安全检查）
  reporterId: string;
  evidence?: string[];             // 证据（图片URL等）
}

export interface Report {
  id: string;
  type: ReportType;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description: string;
  reporterId: string;
  status: ReportStatus;
  contentCheckResult?: ContentCheckResult;
  evidence?: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
}

export interface ContentCheckResult {
  safe: boolean;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  violations: string[];
  confidence: number;
  checkedAt: Date;
  service: string;                 // 使用的检查服务
}

export interface ContentViolationLog {
  id: string;
  content: string;
  type: ReportType;
  violations: string[];
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  reporterId: string;
  timestamp: Date;
}
