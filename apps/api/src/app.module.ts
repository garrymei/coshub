import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthController } from "./health/health.controller";
import { HealthService } from "./health/health.service";
import { SkillPostsModule } from "./skill-posts/skill-posts.module";
import { SkillsModule } from "./skills/skills.module";
import { PostsModule } from "./posts/posts.module";
import { BannersModule } from "./banners/banners.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UploadModule } from "./upload/upload.module";
import { ReportsModule } from "./reports/reports.module";
import { CacheModule } from "./cache/cache.module";
import { LoggerModule } from "./logger/logger.module";
import { LoggerMiddleware } from "./logger/logger.middleware";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 120 }],
    }),
    PrismaModule,
    SkillPostsModule,
    PostsModule,
    BannersModule,
    UploadModule,
    SkillsModule,
    ReportsModule,
    CacheModule,
    LoggerModule,
    AuthModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    HealthService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
