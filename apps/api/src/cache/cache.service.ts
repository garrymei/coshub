import { Injectable, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: PrismaService,
  ) {}

  // 热门技能帖缓存
  async getHotSkillPosts(limit: number = 10) {
    const cacheKey = `hot_skill_posts:${limit}`;

    try {
      // 尝试从缓存获取
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        console.log("热门技能帖缓存命中");
        return cached;
      }
    } catch (error) {
      console.warn("缓存读取失败:", error);
    }

    // 缓存未命中，从数据库获取
    console.log("热门技能帖缓存未命中，从数据库获取");
    const hotPosts = await this.prisma.skillPost.findMany({
      where: {
        deletedAt: null,
        status: "ACTIVE",
      },
      orderBy: [
        { viewCount: "desc" },
        { avgRating: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      include: {
        author: true,
      },
    });

    // 设置缓存，TTL为30分钟
    try {
      await this.cacheManager.set(cacheKey, hotPosts, 1800);
      console.log("热门技能帖已缓存");
    } catch (error) {
      console.warn("缓存设置失败:", error);
    }

    return hotPosts;
  }

  // 城市榜单缓存
  async getCityRanking(limit: number = 20) {
    const cacheKey = `city_ranking:${limit}`;

    try {
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        console.log("城市榜单缓存命中");
        return cached;
      }
    } catch (error) {
      console.warn("缓存读取失败:", error);
    }

    console.log("城市榜单缓存未命中，从数据库获取");

    // 统计各城市的技能帖数量
    const cityStats = await this.prisma.skillPost.groupBy({
      by: ["city"],
      where: {
        deletedAt: null,
        status: "ACTIVE",
      },
      _count: {
        city: true,
      },
      orderBy: {
        _count: {
          city: "desc",
        },
      },
      take: limit,
    });

    // 获取城市详细信息
    const cityRanking = await Promise.all(
      cityStats.map(async (stat) => {
        const cityPosts = await this.prisma.skillPost.findMany({
          where: {
            city: stat.city,
            deletedAt: null,
            status: "ACTIVE",
          },
          select: {
            id: true,
            title: true,
            category: true,
            price: true,
            avgRating: true,
            viewCount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // 每个城市显示最新的5个帖子
        });

        return {
          city: stat.city,
          postCount: stat._count.city,
          latestPosts: cityPosts,
        };
      }),
    );

    // 设置缓存，TTL为1小时
    try {
      await this.cacheManager.set(cacheKey, cityRanking, 3600);
      console.log("城市榜单已缓存");
    } catch (error) {
      console.warn("缓存设置失败:", error);
    }

    return cityRanking;
  }

  // 手动失效缓存
  async invalidateCache(pattern: string) {
    try {
      // 这里需要根据具体的缓存实现来失效
      // 对于Redis，可以使用SCAN命令查找匹配的键
      console.log(`手动失效缓存模式: ${pattern}`);

      // 示例：失效热门技能帖缓存
      if (pattern.includes("hot_skill_posts")) {
        await this.cacheManager.del("hot_skill_posts:10");
        await this.cacheManager.del("hot_skill_posts:20");
        console.log("热门技能帖缓存已失效");
      }

      // 示例：失效城市榜单缓存
      if (pattern.includes("city_ranking")) {
        await this.cacheManager.del("city_ranking:20");
        console.log("城市榜单缓存已失效");
      }
    } catch (error) {
      console.error("缓存失效失败:", error);
    }
  }

  // 获取缓存统计信息
  async getCacheStats() {
    try {
      // 这里可以返回缓存的统计信息
      // 如命中率、内存使用等
      return {
        status: "active",
        timestamp: new Date().toISOString(),
        // 实际实现中可以从Redis获取更详细的统计
      };
    } catch (error) {
      console.error("获取缓存统计失败:", error);
      return {
        status: "error",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 预热缓存
  async warmupCache() {
    console.log("开始预热缓存...");

    try {
      // 预热热门技能帖缓存
      await this.getHotSkillPosts(10);
      await this.getHotSkillPosts(20);

      // 预热城市榜单缓存
      await this.getCityRanking(20);

      console.log("缓存预热完成");
    } catch (error) {
      console.error("缓存预热失败:", error);
    }
  }
}
