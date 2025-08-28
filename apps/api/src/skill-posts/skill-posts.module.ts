import { Module } from '@nestjs/common';
import { SkillPostsController } from './skill-posts.controller';
import { SkillPostsService } from './skill-posts.service';

@Module({
  controllers: [SkillPostsController],
  providers: [SkillPostsService],
  exports: [SkillPostsService]
})
export class SkillPostsModule {}
