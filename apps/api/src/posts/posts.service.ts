import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { PrismaService } from "../prisma/prisma.service";
import {
  Post,
  CreatePostDTO,
  UpdatePostDTO,
  PostQueryDTO,
  PostListResponse,
} from "@coshub/types";
import { Prisma } from "../../generated/prisma";

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // 创建帖子
  async create(createPostDto: CreatePostDTO): Promise<Post> {
    // 暂时使用第一个用户作为作者，后续集成认证后从JWT获取
    const firstUser = await this.prisma.user.findFirst();
    if (!firstUser) {
      throw new Error("未找到用户，请先运行种子数据");
    }

    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        type: createPostDto.type as any,
        category: createPostDto.category as any,
        images: createPostDto.images || [],
        videos: createPostDto.videos || [],
        tags: createPostDto.tags || [],
        authorId: firstUser.id,
        // 处理技能帖特有字段
        ...(createPostDto.type === 'SKILL' && {
          price: createPostDto.price,
          role: createPostDto.role,
          experience: createPostDto.experience,
          availability: createPostDto.availability,
          contactInfo: createPostDto.contactInfo,
        }),
      },
      include: {
        author: true,
      },
    });

    return this.transformPost(post);
  }

  // 获取帖子列表（支持筛选和排序）
  async findAll(
    query: PostQueryDTO & { city?: string; radiusKm?: number },
  ): Promise<PostListResponse> {
    const where: Prisma.PostWhereInput = {
      deletedAt: null,
      status: "ACTIVE",
    };

    // 城市筛选
    if (query.city) {
      where.city = query.city;
    }

    // 地理范围筛选 (后续实现geohash)
    if (query.radiusKm && query.lat && query.lng) {
      // 临时实现 - 后续替换为geohash查询
      where.AND = [
        { lat: { gte: query.lat - 0.1 } },
        { lat: { lte: query.lat + 0.1 } },
        { lng: { gte: query.lng - 0.1 } },
        { lng: { lte: query.lng + 0.1 } },
      ];
    }

    // 应用筛选条件
    if (query.type) {
      where.type = query.type as any;
    }

    if (query.category) {
      where.category = query.category as any;
    }

    if (query.city) {
      // 如果帖子有城市字段，可以在这里筛选
      // 目前Post模型没有city字段，需要扩展
    }

    if (query.tags && query.tags.length > 0) {
      where.tags = {
        hasSome: query.tags,
      };
    }

    if (query.authorId) {
      where.authorId = query.authorId;
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
          content: {
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
    const orderBy: Prisma.PostOrderByWithRelationInput = {};
    switch (query.sortBy) {
      case "latest":
        orderBy.createdAt = "desc";
        break;
      case "popular":
        orderBy.likeCount = "desc";
        break;
      case "mostViewed":
        orderBy.viewCount = "desc";
        break;
      default:
        orderBy.createdAt = "desc";
    }

    // Keyset pagination 实现
    const limit = query.limit || 10;

    // 如果提供了游标，添加游标条件
    if (query.cursor) {
      const cursorField = query.sortBy || "createdAt";
      try {
        const cursorData = JSON.parse(
          Buffer.from(query.cursor, "base64").toString(),
        );
        if (cursorData[cursorField]) {
          where[cursorField] = {
            [orderBy[cursorField] === "desc" ? "lt" : "gt"]:
              cursorData[cursorField],
          };
        }
      } catch (error) {
        console.warn("Invalid cursor format:", error);
      }
    }

    // 获取数据（多取一条用于判断是否有下一页）
    const take = limit + 1;

    const posts = await this.prisma.post.findMany({
      where,
      orderBy,
      take,
      select: {
        id: true,
        title: true,
        type: true,
        images: true,
        viewCount: true,
        likeCount: true,
        commentCount: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    });

    // 判断是否有下一页
    const hasNext = posts.length > limit;
    const items = posts.slice(0, limit);

    // 计算下一页游标
    let nextCursor: string | undefined;
    if (hasNext && items.length > 0) {
      const lastItem = items[items.length - 1];
      const cursorField = query.sortBy || "createdAt";
      const cursorData = {
        [cursorField]: lastItem[cursorField],
        id: lastItem.id,
      };
      nextCursor = Buffer.from(JSON.stringify(cursorData)).toString("base64");
    }

    // 获取总数
    const total = await this.prisma.post.count({ where });

    const response: PostListResponse = {
      data: items.map((post) => this.transformPost(post)),
      meta: {
        total,
        page: query.page || 1,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext,
        hasPrev: query.page ? query.page > 1 : false,
      },
      cursor: nextCursor,
    };

    return response;
  }

  // 获取帖子详情
  async findOne(id: string): Promise<Post> {
    // 尝试从缓存获取
    const cachedPost = await this.cacheManager.get<Post>(`post_${id}`);
    if (cachedPost) {
      return cachedPost;
    }

    const post = await this.prisma.post.findFirst({
      where: {
        id,
        deletedAt: null,
        status: "ACTIVE",
      },
      include: {
        author: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`帖子 ID ${id} 不存在`);
    }

    // 增加浏览量
    await this.prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    post.viewCount += 1;
    const transformed = this.transformPost(post);

    // 缓存帖子详情
    await this.cacheManager.set(`post_${id}`, transformed, 300);

    return transformed;
  }

  // 更新帖子
  async update(id: string, updatePostDto: UpdatePostDTO): Promise<Post> {
    const updateData: Prisma.PostUpdateInput = {
      updatedAt: new Date(),
    };

    if (updatePostDto.title !== undefined) {
      updateData.title = updatePostDto.title;
    }
    if (updatePostDto.content !== undefined) {
      updateData.content = updatePostDto.content;
    }
    if (updatePostDto.type !== undefined) {
      updateData.type = { set: updatePostDto.type as any };
    }
    if (updatePostDto.category !== undefined) {
      updateData.category = { set: updatePostDto.category as any };
    }
    if (updatePostDto.images !== undefined) {
      updateData.images = updatePostDto.images;
    }
    if (updatePostDto.videos !== undefined) {
      updateData.videos = updatePostDto.videos;
    }
    if (updatePostDto.tags !== undefined) {
      updateData.tags = updatePostDto.tags;
    }

    const post = await this.prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
      },
    });

    return this.transformPost(post);
  }

  // 删除帖子（软删除）
  async remove(id: string): Promise<boolean> {
    await this.prisma.post.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return true;
  }

  // 获取热门标签
  async getTags(): Promise<string[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        deletedAt: null,
        status: "ACTIVE",
      },
      select: {
        tags: true,
      },
    });

    const allTags = posts.flatMap((post) => post.tags);
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

  // 转换数据库模型到API模型
  // 批量点赞/收藏操作（减少数据库往返）
  private pendingInteractions: Map<
    string,
    { type: "LIKE" | "COLLECT"; delta: number }
  > = new Map();
  private interactionFlushTimeout: NodeJS.Timeout | null = null;

  async createInteraction(
    postId: string,
    type: "LIKE" | "COLLECT",
  ): Promise<void> {
    const key = `${postId}-${type}`;
    const current = this.pendingInteractions.get(key) || { type, delta: 0 };
    current.delta += 1;
    this.pendingInteractions.set(key, current);

    // 延迟批量更新
    if (!this.interactionFlushTimeout) {
      this.interactionFlushTimeout = setTimeout(
        () => this.flushInteractions(),
        500,
      );
    }
  }

  private async flushInteractions() {
    if (this.interactionFlushTimeout) {
      clearTimeout(this.interactionFlushTimeout);
      this.interactionFlushTimeout = null;
    }

    const updates = Array.from(this.pendingInteractions.entries()).map(
      ([key, { type, delta }]) => {
        const [postId] = key.split("-");
        const field = type === "LIKE" ? "likeCount" : "shareCount"; // reuse shareCount for collect
        return this.prisma.post.update({
          where: { id: postId },
          data: {
            [field]: {
              increment: delta,
            },
          },
        });
      },
    );

    await Promise.all(updates);
    this.pendingInteractions.clear();
  }

  // 取消点赞/收藏
  async deleteInteraction(
    postId: string,
    type: "LIKE" | "COLLECT",
  ): Promise<void> {
    const field = type === "LIKE" ? "likeCount" : "shareCount";
    await this.prisma.post.update({
      where: { id: postId },
      data: {
        [field]: {
          decrement: 1,
        },
      },
    });
  }

  // 获取帖子评论列表
  async getComments(postId: string) {
    const comments = await this.prisma.comment.findMany({
      where: {
        targetType: "POST",
        targetId: postId,
        status: "ACTIVE",
      },
      orderBy: { createdAt: "asc" },
      include: {
        author: true,
      },
    });

    return comments.map((c) => ({
      id: c.id,
      postId,
      userId: c.authorId,
      user: {
        id: c.author.id,
        nickname: c.author.nickname || c.author.username,
        avatar:
          c.author.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author.username}`,
      },
      content: c.content,
      likeCount: c.likeCount,
      createdAt: c.createdAt,
    }));
  }

  // 添加评论
  async createComment(postId: string, content: string): Promise<any> {
    // 暂时使用第一个用户作为评论者
    const firstUser = await this.prisma.user.findFirst();
    if (!firstUser) {
      throw new Error("未找到用户，请先运行种子数据");
    }

    // 创建评论
    const comment = await this.prisma.comment.create({
      data: {
        content,
        targetType: "POST",
        targetId: postId,
        authorId: firstUser.id,
      },
    });

    // 更新帖子评论数
    await this.prisma.post.update({
      where: { id: postId },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });

    return comment;
  }

  // 记录事件
  async trackEvent(
    postId: string,
    type: "VIEW" | "CLICK" | "SHARE" | "PUBLISH",
  ): Promise<void> {
    await this.prisma.event.create({
      data: {
        type,
        targetType: "POST",
        targetId: postId,
        metadata: {},
      },
    });
  }

  private transformPost(post: any): Post {
    const basePost = {
      id: post.id,
      title: post.title,
      content: post.content,
      type: String(post.type).toLowerCase(),
      category: post.category ? String(post.category).toLowerCase() : undefined,
      images: post.images || [],
      videos: post.videos || [],
      tags: post.tags || [],
      authorId: post.authorId,
      authorName: post.author.nickname || post.author.username,
      authorAvatar:
        post.author.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.username}`,
      stats: {
        viewCount: post.viewCount,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        shareCount: post.shareCount,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    // 添加技能帖特有字段
    if (post.type === 'SKILL') {
      return {
        ...basePost,
        price: post.price,
        role: post.role,
        experience: post.experience,
        availability: post.availability,
        contactInfo: post.contactInfo,
      } as any;
    }

    return basePost as any;
  }
}
