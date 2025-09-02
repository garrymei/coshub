import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  SkillPost,
  CreateSkillPostDTO,
  SkillPostQueryDTO,
  SkillPostListResponse,
} from "@coshub/types";
import { Prisma } from "../../generated/prisma";

@Injectable()
export class SkillPostsService {
  constructor(private prisma: PrismaService) {}

  // 创建技能帖
  async create(createSkillPostDto: CreateSkillPostDTO): Promise<SkillPost> {
    // 暂时使用第一个用户作为作者，后续集成认证后从JWT获取
    const firstUser = await this.prisma.user.findFirst();
    if (!firstUser) {
      throw new Error("未找到用户，请先运行种子数据");
    }

    const skillPost = await this.prisma.skillPost.create({
      data: {
        title: createSkillPostDto.title,
        description: createSkillPostDto.description,
        category: createSkillPostDto.category as any,
        role: createSkillPostDto.role as any,
        experience: createSkillPostDto.experience as any,
        city: createSkillPostDto.city,
        price: createSkillPostDto.price as Prisma.JsonObject,
        images: createSkillPostDto.images,
        tags: createSkillPostDto.tags,
        availability: createSkillPostDto.availability as any,
        contactInfo: createSkillPostDto.contactInfo as any,
        authorId: firstUser.id,
      },
      include: {
        author: true,
      },
    });

    return this.transformSkillPost(skillPost);
  }

  // 获取技能帖列表
  async findAll(query: SkillPostQueryDTO): Promise<SkillPostListResponse> {
    const where: Prisma.SkillPostWhereInput = {
      deletedAt: null,
      status: "ACTIVE",
    };

    // 应用筛选条件
    if (query.category) {
      where.category = query.category as any;
    }

    if (query.role) {
      where.role = query.role as any;
    }

    if (query.city) {
      where.city = {
        contains: query.city,
        mode: "insensitive",
      };
    }

    if (query.keyword) {
      where.OR = [
        {
          title: {
            contains: query.keyword,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.keyword,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: query.keyword,
          },
        },
      ];
    }

    // 排序
    const orderBy: Prisma.SkillPostOrderByWithRelationInput = {};
    switch (query.sortBy) {
      case "createdAt":
        orderBy.createdAt = "desc";
        break;
      case "viewCount":
        orderBy.viewCount = "desc";
        break;
      case "rating":
        orderBy.avgRating = "desc";
        break;
      default:
        orderBy.updatedAt = "desc";
    }

    // Keyset pagination 实现
    const limit = query.limit || 10;
    
    // 如果提供了游标，添加游标条件
    if (query.cursor) {
      const cursorField = query.sortBy === "createdAt" ? "createdAt" : 
                         query.sortBy === "updatedAt" ? "updatedAt" : "id";
      
      // 解析游标（假设游标是 base64 编码的 JSON）
      try {
        const cursorData = JSON.parse(Buffer.from(query.cursor, 'base64').toString());
        if (cursorData[cursorField]) {
          where[cursorField] = {
            [orderBy[cursorField] === 'desc' ? 'lt' : 'gt']: cursorData[cursorField]
          };
        }
      } catch (error) {
        // 游标解析失败，忽略游标条件
        console.warn('Invalid cursor format:', error);
      }
    }

    // 获取数据（多取一条用于判断是否有下一页）
    const take = limit + 1;
    
    const skillPosts = await this.prisma.skillPost.findMany({
      where,
      orderBy,
      take,
      include: {
        author: true,
      },
    });

    // 判断是否有下一页
    const hasNext = skillPosts.length > limit;
    const items = skillPosts.slice(0, limit);
    
    // 计算下一页游标
    let nextCursor: string | undefined;
    if (hasNext && items.length > 0) {
      const lastItem = items[items.length - 1];
      const cursorField = query.sortBy === "createdAt" ? "createdAt" : 
                         query.sortBy === "updatedAt" ? "updatedAt" : "id";
      
      const cursorData = {
        [cursorField]: lastItem[cursorField],
        id: lastItem.id // 总是包含 id 作为唯一标识
      };
      nextCursor = Buffer.from(JSON.stringify(cursorData)).toString('base64');
    }

    // 获取总数（仅用于向后兼容）
    const total = await this.prisma.skillPost.count({ where });

    return {
      items: items.map((post) => this.transformSkillPost(post)),
      total,
      nextCursor,
      hasNext,
      // 向后兼容字段
      page: query.page || 1,
      limit,
      totalPages: Math.ceil(total / limit),
      hasPrev: query.page ? query.page > 1 : false,
    };
  }

  // 获取技能帖详情
  async findOne(id: string): Promise<SkillPost> {
    const skillPost = await this.prisma.skillPost.findFirst({
      where: {
        id,
        deletedAt: null,
        status: "ACTIVE",
      },
      include: {
        author: true,
      },
    });

    if (!skillPost) {
      throw new NotFoundException(`技能帖 ID ${id} 不存在`);
    }

    // 增加浏览量
    await this.prisma.skillPost.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    skillPost.viewCount += 1; // 更新本地对象以返回最新值

    return this.transformSkillPost(skillPost);
  }

  // 获取城市列表
  async getCities(): Promise<string[]> {
    const cities = await this.prisma.skillPost.findMany({
      where: {
        deletedAt: null,
        status: "ACTIVE",
      },
      select: {
        city: true,
      },
      distinct: ["city"],
      orderBy: {
        city: "asc",
      },
    });

    return cities.map((item) => item.city);
  }

  // 获取热门标签
  async getTags(): Promise<string[]> {
    const skillPosts = await this.prisma.skillPost.findMany({
      where: {
        deletedAt: null,
        status: "ACTIVE",
      },
      select: {
        tags: true,
      },
    });

    const allTags = skillPosts.flatMap((post) => post.tags);
    const tagCounts = allTags.reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 20)
      .map(([tag]) => tag);
  }

  // 更新技能帖
  async update(id: string, updateSkillPostDto: any): Promise<SkillPost> {
    const skillPost = await this.prisma.skillPost.update({
      where: { id },
      data: {
        ...updateSkillPostDto,
        updatedAt: new Date(),
      },
      include: {
        author: true,
      },
    });

    return this.transformSkillPost(skillPost);
  }

  // 删除技能帖（软删除）
  async remove(id: string): Promise<boolean> {
    await this.prisma.skillPost.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return true;
  }

  // 转换数据库模型到API模型
  private transformSkillPost(skillPost: any): SkillPost {
    const mapStatus = (s: string) => {
      switch (s) {
        case "DRAFT":
          return "draft";
        case "ACTIVE":
          return "published";
        case "INACTIVE":
          return "paused";
        case "DELETED":
          return "closed";
        default:
          return "published";
      }
    };

    return {
      id: skillPost.id,
      title: skillPost.title,
      description: skillPost.description,
      category: String(skillPost.category).toLowerCase(),
      role: String(skillPost.role).toLowerCase(),
      experience: String(skillPost.experience).toLowerCase(),
      city: skillPost.city,
      price: skillPost.price as any,
      images: skillPost.images,
      tags: skillPost.tags,
      availability: skillPost.availability as any,
      contactInfo: skillPost.contactInfo as any,
      authorId: skillPost.authorId,
      authorName: skillPost.author.nickname || skillPost.author.username,
      authorAvatar:
        skillPost.author.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${skillPost.author.username}`,
      stats: {
        viewCount: skillPost.viewCount,
        favoriteCount: skillPost.favoriteCount,
        contactCount: skillPost.contactCount,
        likeCount: skillPost.likeCount || 0,
        avgRating: skillPost.avgRating,
        reviewCount: skillPost.reviewCount,
        responseRate: skillPost.responseRate,
      },
      status: mapStatus(String(skillPost.status)),
      createdAt: skillPost.createdAt,
      updatedAt: skillPost.updatedAt,
    } as any;
  }
}
