import { Module } from "@nestjs/common";
import { SkillPostsController } from "./skill-posts.controller";
import { SkillPostsService } from "./skill-posts.service";
// import { CacheModule } from "../cache/cache.module";

@Module({
  imports: [
    // CacheModule, // 暂时禁用缓存模块
  ],
  controllers: [SkillPostsController],
  providers: [SkillPostsService],
  exports: [SkillPostsService],
})
export class SkillPostsModule {}
