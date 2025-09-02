import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RateLimitType, RATE_LIMIT_CONFIGS } from "@coshub/types";
import { Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rateLimitType = this.reflector.getAllAndOverride<RateLimitType>(
      "rateLimitType",
      [context.getHandler(), context.getClass()],
    );

    if (!rateLimitType) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const clientId = this.getClientId(request);
    const config = RATE_LIMIT_CONFIGS[rateLimitType];

    if (!config) {
      return true;
    }

    const key = `rate_limit:${rateLimitType}:${clientId}`;
    const currentCount = await this.cacheManager.get<number>(key) || 0;

    if (currentCount >= config.max) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: config.message,
            details: `请求次数: ${currentCount}/${config.max}`,
          },
          timestamp: new Date().toISOString(),
        },
        config.statusCode,
      );
    }

    // 增加计数
    await this.cacheManager.set(key, currentCount + 1, config.windowMs / 1000);

    // 添加速率限制头
    if (config.headers) {
      const response = context.switchToHttp().getResponse();
      response.set("X-RateLimit-Limit", config.max.toString());
      response.set("X-RateLimit-Remaining", (config.max - currentCount - 1).toString());
      response.set("X-RateLimit-Reset", new Date(Date.now() + config.windowMs).toISOString());
    }

    return true;
  }

  private getClientId(request: any): string {
    // 优先使用用户ID，其次使用IP地址
    if (request.user?.id) {
      return `user:${request.user.id}`;
    }
    
    const ip = request.ip || 
               request.connection?.remoteAddress || 
               request.socket?.remoteAddress ||
               request.connection?.socket?.remoteAddress ||
               "unknown";
    
    return `ip:${ip}`;
  }
}
