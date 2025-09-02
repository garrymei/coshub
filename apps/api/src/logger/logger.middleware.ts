import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { LoggerService } from "./logger.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    
    // 生成请求ID并记录请求开始
    const requestId = this.loggerService.logRequestStart(req);
    
    // 将请求ID添加到请求对象中，供后续使用
    (req as any).requestId = requestId;
    
    // 记录请求体（仅对POST/PUT/PATCH请求）
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      this.loggerService.log("Request body", {
        requestId,
        method: req.method,
        url: req.url,
      }, req.body);
    }

    // 监听响应完成
    res.on("finish", () => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      
      // 记录请求完成
      this.loggerService.logRequestEnd(requestId, duration, statusCode);
      
      // 记录响应体（仅对错误响应）
      if (statusCode >= 400) {
        this.loggerService.warn("Error response", {
          requestId,
          method: req.method,
          url: req.url,
          statusCode,
          duration,
        });
      }
    });

    next();
  }
}
