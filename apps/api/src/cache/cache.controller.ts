import { Controller, Get, Query, Param, Post, HttpException, HttpStatus } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { ApiResponse } from "@coshub/types";

@Controller("cache")
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get("hot-skill-posts")
  async getHotSkillPosts(@Query("limit") limit: string = "10") {
    try {
      const limitNum = parseInt(limit, 10);
      if (isNaN(limitNum) || limitNum <= 0 || limitNum > 100) {
        throw new Error("limit参数无效，应为1-100之间的数字");
      }

      const hotPosts = await this.cacheService.getHotSkillPosts(limitNum);

      return {
        success: true,
        data: hotPosts,
        message: "获取热门技能帖成功",
        timestamp: new Date().toISOString(),
      } as ApiResponse<any>;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "HOT_POSTS_FETCH_FAILED",
            message: "获取热门技能帖失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("city-ranking")
  async getCityRanking(@Query("limit") limit: string = "20") {
    try {
      const limitNum = parseInt(limit, 10);
      if (isNaN(limitNum) || limitNum <= 0 || limitNum > 100) {
        throw new Error("limit参数无效，应为1-100之间的数字");
      }

      const cityRanking = await this.cacheService.getCityRanking(limitNum);

      return {
        success: true,
        data: cityRanking,
        message: "获取城市榜单成功",
        timestamp: new Date().toISOString(),
      } as ApiResponse<any>;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "CITY_RANKING_FETCH_FAILED",
            message: "获取城市榜单失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("stats")
  async getCacheStats() {
    try {
      const stats = await this.cacheService.getCacheStats();

      return {
        success: true,
        data: stats,
        message: "获取缓存统计成功",
        timestamp: new Date().toISOString(),
      } as ApiResponse<any>;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "CACHE_STATS_FETCH_FAILED",
            message: "获取缓存统计失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("warmup")
  async warmupCache() {
    try {
      await this.cacheService.warmupCache();

      return {
        success: true,
        data: { message: "缓存预热完成" },
        message: "缓存预热成功",
        timestamp: new Date().toISOString(),
      } as ApiResponse<any>;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "CACHE_WARMUP_FAILED",
            message: "缓存预热失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("invalidate/:pattern")
  async invalidateCache(@Param("pattern") pattern: string) {
    try {
      await this.cacheService.invalidateCache(pattern);

      return {
        success: true,
        data: { pattern, message: "缓存失效成功" },
        message: "缓存失效成功",
        timestamp: new Date().toISOString(),
      } as ApiResponse<any>;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "CACHE_INVALIDATE_FAILED",
            message: "缓存失效失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
