import { Module } from "@nestjs/common";
import { PermissionService } from "./services/permission.service";
import { PermissionGuard } from "./guards/permission.guard";
import { RateLimitGuard } from "./guards/rate-limit.guard";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthController } from "./auth.controller";
// import { CacheModule } from "../cache/cache.module";

@Module({
  imports: [
    PrismaModule,
    // CacheModule, // 暂时禁用缓存模块
  ],
  controllers: [AuthController],
  providers: [PermissionService, PermissionGuard, RateLimitGuard],
  exports: [PermissionService, PermissionGuard, RateLimitGuard],
})
export class AuthModule {}
