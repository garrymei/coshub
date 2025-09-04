import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // 5分钟缓存
      max: 1000, // 最大缓存条目
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
export { CacheModule };
