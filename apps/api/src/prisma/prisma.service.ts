import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // 清理已删除的记录（软删除）
  async cleanupDeleted() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 永久删除30天前的软删除记录
    await this.user.deleteMany({
      where: {
        deletedAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    await this.skillPost.deleteMany({
      where: {
        deletedAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    await this.request.deleteMany({
      where: {
        deletedAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    await this.post.deleteMany({
      where: {
        deletedAt: {
          lt: thirtyDaysAgo,
        },
      },
    });
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
