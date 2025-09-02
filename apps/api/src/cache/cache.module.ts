import { Module } from "@nestjs/common";
import { CacheModule as NestCacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheService } from "./cache.service";
import { CacheController } from "./cache.controller";

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: "redis",
        host: configService.get("REDIS_HOST", "localhost"),
        port: configService.get("REDIS_PORT", 6379),
        password: configService.get("REDIS_PASSWORD"),
        ttl: configService.get("CACHE_TTL", 3600), // 默认1小时
        max: configService.get("CACHE_MAX_ITEMS", 1000),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CacheController],
  providers: [CacheService],
  // 导出 Nest 原生 CacheModule，使 CACHE_MANAGER 在导入本模块的上下文可用
  exports: [CacheService, NestCacheModule],
})
export class CacheModule {}
