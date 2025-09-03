import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: redisStore,
        host: config.get("REDIS_HOST") || "localhost",
        port: config.get("REDIS_PORT") || 6379,
        ttl: 300, // 5分钟缓存
        max: 1000, // 最大缓存条目
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
