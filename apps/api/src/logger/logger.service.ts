import { Injectable, LoggerService as NestLoggerService } from "@nestjs/common";
import { Request } from "express";

export interface LogContext {
  requestId: string;
  userId?: string;
  method: string;
  url: string;
  userAgent?: string;
  ip?: string;
  duration?: number;
  errorCode?: string;
  errorMessage?: string;
  statusCode?: number;
}

export interface LogData {
  level: "info" | "warn" | "error" | "debug";
  message: string;
  context: LogContext;
  data?: any;
  timestamp: string;
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatLog(data: LogData): string {
    const { level, message, context, data: extraData, timestamp } = data;

    const baseLog = {
      timestamp,
      level: level.toUpperCase(),
      message,
      requestId: context.requestId,
      userId: context.userId || "anonymous",
      method: context.method,
      url: context.url,
      duration: context.duration ? `${context.duration}ms` : undefined,
      errorCode: context.errorCode,
      errorMessage: context.errorMessage,
      userAgent: context.userAgent,
      ip: context.ip,
    };

    if (extraData) {
      Object.assign(baseLog, { extraData });
    }

    return JSON.stringify(baseLog);
  }

  log(message: string, context?: LogContext, data?: any) {
    const logData: LogData = {
      level: "info",
      message,
      context: context || {
        requestId: this.generateRequestId(),
        method: "SYSTEM",
        url: "SYSTEM",
      },
      data,
      timestamp: new Date().toISOString(),
    };

    console.log(this.formatLog(logData));
  }

  warn(message: string, context?: LogContext, data?: any) {
    const logData: LogData = {
      level: "warn",
      message,
      context: context || {
        requestId: this.generateRequestId(),
        method: "SYSTEM",
        url: "SYSTEM",
      },
      data,
      timestamp: new Date().toISOString(),
    };

    console.warn(this.formatLog(logData));
  }

  error(message: string, context?: LogContext, data?: any) {
    const logData: LogData = {
      level: "error",
      message,
      context: context || {
        requestId: this.generateRequestId(),
        method: "SYSTEM",
        url: "SYSTEM",
      },
      data,
      timestamp: new Date().toISOString(),
    };

    console.error(this.formatLog(logData));
  }

  debug(message: string, context?: LogContext, data?: any) {
    const logData: LogData = {
      level: "debug",
      message,
      context: context || {
        requestId: this.generateRequestId(),
        method: "SYSTEM",
        url: "SYSTEM",
      },
      data,
      timestamp: new Date().toISOString(),
    };

    console.debug(this.formatLog(logData));
  }

  // 请求开始日志
  logRequestStart(req: Request, userId?: string): string {
    const requestId = this.generateRequestId();
    const context: LogContext = {
      requestId,
      userId,
      method: req.method,
      url: req.url,
      userAgent: req.get("User-Agent"),
      ip: req.ip || req.connection.remoteAddress,
    };

    this.log("Request started", context);
    return requestId;
  }

  // 请求完成日志
  logRequestEnd(
    requestId: string,
    duration: number,
    statusCode: number,
    userId?: string,
  ) {
    const context: LogContext = {
      requestId,
      userId,
      method: "COMPLETED",
      url: "COMPLETED",
      duration,
    };

    if (statusCode >= 400) {
      this.warn(`Request completed with status ${statusCode}`, context);
    } else {
      this.log(`Request completed with status ${statusCode}`, context);
    }
  }

  // 错误日志
  logError(error: Error, context: LogContext, data?: any) {
    const errorContext: LogContext = {
      ...context,
      errorCode: error.name,
      errorMessage: error.message,
    };

    this.error("Error occurred", errorContext, {
      stack: error.stack,
      ...data,
    });
  }

  // 业务操作日志
  logBusinessOperation(operation: string, context: LogContext, data?: any) {
    this.log(`Business operation: ${operation}`, context, data);
  }

  // 性能日志
  logPerformance(
    operation: string,
    duration: number,
    context: LogContext,
    data?: any,
  ) {
    const performanceContext: LogContext = {
      ...context,
      duration,
    };

    this.log(`Performance: ${operation}`, performanceContext, data);
  }
}
