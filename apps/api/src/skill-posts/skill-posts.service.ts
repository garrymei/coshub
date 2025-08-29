import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SkillPost,
  CreateSkillPostDTO,
  SkillPostQueryDTO,
  SkillPostListResponse
} from '@coshub/types';
import { Prisma } from '../../generated/prisma';

@Injectable()
export class SkillPostsService {
  constructor(private prisma: PrismaService) {}

  // 创建技能帖
  async create(createSkillPostDto: CreateSkillPostDTO): Promise<SkillPost> {
    // 暂时使用第一个用户作为作者，后续集成认证后从JWT获取
    const firstUser = await this.prisma.user.findFirst();
    if (!firstUser) {
      throw new Error('未找到用户，请先运行种子数据');
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
      status: 'ACTIVE',
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
        mode: 'insensitive',
      };
    }

    if (query.keyword) {
      where.OR = [
        {
          title: {
            contains: query.keyword,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query.keyword,
            mode: 'insensitive',
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
      case 'createdAt':
        orderBy.createdAt = 'desc';
        break;
      case 'viewCount':
        orderBy.viewCount = 'desc';
        break;
      case 'rating':
        orderBy.avgRating = 'desc';
        break;
      default:
        orderBy.updatedAt = 'desc';
    }

    // 分页
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [skillPosts, total] = await Promise.all([
      this.prisma.skillPost.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: true,
        },
      }),
      this.prisma.skillPost.count({ where }),
    ]);

    return {
      items: skillPosts.map(post => this.transformSkillPost(post)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    };
  }

  // 获取技能帖详情
  async findOne(id: string): Promise<SkillPost> {
    const skillPost = await this.prisma.skillPost.findFirst({
      where: {
        id,
        deletedAt: null,
        status: 'ACTIVE',
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
        status: 'ACTIVE',
      },
      select: {
        city: true,
      },
      distinct: ['city'],
      orderBy: {
        city: 'asc',
      },
    });

    return cities.map(item => item.city);
  }

  // 获取热门标签
  async getTags(): Promise<string[]> {
    const skillPosts = await this.prisma.skillPost.findMany({
      where: {
        deletedAt: null,
        status: 'ACTIVE',
      },
      select: {
        tags: true,
      },
    });

    const allTags = skillPosts.flatMap(post => post.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

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
    return {
      id: skillPost.id,
      title: skillPost.title,
      description: skillPost.description,
      category: skillPost.category,
      role: skillPost.role,
      experience: skillPost.experience,
      city: skillPost.city,
      price: skillPost.price as any,
      images: skillPost.images,
      tags: skillPost.tags,
      availability: skillPost.availability as any,
      contactInfo: skillPost.contactInfo as any,
      authorId: skillPost.authorId,
      authorName: skillPost.author.nickname || skillPost.author.username,
      authorAvatar: skillPost.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${skillPost.author.username}`,
      stats: {
        viewCount: skillPost.viewCount,
        favoriteCount: skillPost.favoriteCount,
        contactCount: skillPost.contactCount,
        likeCount: skillPost.likeCount || 0,
        avgRating: skillPost.avgRating,
        reviewCount: skillPost.reviewCount,
        responseRate: skillPost.responseRate,
      },
      status: skillPost.status,
      createdAt: skillPost.createdAt.toISOString(),
      updatedAt: skillPost.updatedAt.toISOString(),
    };
  }
}