import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Param,
  Query,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import {
  CreatePostDTO,
  UpdatePostDTO,
  PostQueryDTO,
  Post as PostModel,
  PostListResponse,
  ApiResponse,
  InteractionType,
  EventType,
} from "@coshub/types";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { RateLimitGuard } from "../auth/guards/rate-limit.guard";
import { RequirePermissions } from "../auth/decorators/permissions.decorator";
import { RateLimit } from "../auth/decorators/rate-limit.decorator";
import { Permission, RateLimitType } from "@coshub/types";
import { CreateInteractionDto } from "./dto/interaction.dto";
import { DeleteInteractionDto } from "./dto/interaction.dto";
import { CreateCommentDto } from "./dto/comment.dto";
import { TrackEventDto } from "./dto/event.dto";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @HttpPost()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(PermissionGuard, RateLimitGuard)
  @RequirePermissions(Permission.CREATE_POST)
  @RateLimit(RateLimitType.CREATE_POST)
  async create(
    @Body() createPostDto: CreatePostDTO,
  ): Promise<ApiResponse<PostModel>> {
    try {
      const post = await this.postsService.create(createPostDto);

      return {
        success: true,
        data: post,
        message: "帖子发布成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "CREATE_FAILED",
            message: "发布帖子失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(
    @Query() query: PostQueryDTO & { type?: 'share' | 'skill' },
  ): Promise<ApiResponse<PostListResponse>> {
    // 直接使用 query.type，不需要额外处理
    try {
      const result = await this.postsService.findAll(query);

      return {
        success: true,
        data: result,
        message: "获取帖子列表成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "FETCH_FAILED",
            message: "获取帖子列表失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<ApiResponse<PostModel>> {
    try {
      const post = await this.postsService.findOne(id);

      return {
        success: true,
        data: post,
        message: "获取帖子详情成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          error: {
            code: "FETCH_FAILED",
            message: "获取帖子详情失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(":id")
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(PermissionGuard, RateLimitGuard)
  @RequirePermissions(Permission.EDIT_POST)
  @RateLimit(RateLimitType.EDIT_POST)
  async update(
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDTO,
  ): Promise<ApiResponse<PostModel>> {
    try {
      const post = await this.postsService.update(id, updatePostDto);

      return {
        success: true,
        data: post,
        message: "更新帖子成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          error: {
            code: "UPDATE_FAILED",
            message: "更新帖子失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(":id")
  @UseGuards(PermissionGuard, RateLimitGuard)
  @RequirePermissions(Permission.DELETE_POST)
  @RateLimit(RateLimitType.DELETE_POST)
  async remove(@Param("id") id: string): Promise<ApiResponse<void>> {
    try {
      const success = await this.postsService.remove(id);

      return {
        success: true,
        message: "删除帖子成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          error: {
            code: "DELETE_FAILED",
            message: "删除帖子失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取热门标签（用于推荐）
  @Get("meta/tags")
  async getTags(): Promise<ApiResponse<string[]>> {
    try {
      const tags = await this.postsService.getTags();

      return {
        success: true,
        data: tags,
        message: "获取热门标签成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "FETCH_FAILED",
            message: "获取热门标签失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 点赞/收藏接口
  @Post(":id/interactions")
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(PermissionGuard, RateLimitGuard)
  @RequirePermissions(Permission.INTERACT_POST)
  @RateLimit(RateLimitType.INTERACT_POST)
  async createInteraction(
    @Param("id") postId: string,
    @Body() dto: CreateInteractionDto,
  ): Promise<ApiResponse<void>> {
    try {
      await this.postsService.createInteraction(postId, dto.type);
      return {
        success: true,
        message: "操作成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "INTERACTION_FAILED",
            message: "操作失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(":id/interactions")
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(PermissionGuard, RateLimitGuard)
  @RequirePermissions(Permission.INTERACT_POST)
  @RateLimit(RateLimitType.INTERACT_POST)
  async deleteInteraction(
    @Param("id") postId: string,
    @Body() dto: DeleteInteractionDto,
  ): Promise<ApiResponse<void>> {
    try {
      await this.postsService.deleteInteraction(postId, dto.type);
      return {
        success: true,
        message: "取消操作成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "INTERACTION_FAILED",
            message: "取消操作失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 评论接口
  @Post(":id/comments")
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(PermissionGuard, RateLimitGuard)
  @RequirePermissions(Permission.COMMENT_POST)
  @RateLimit(RateLimitType.COMMENT_POST)
  async createComment(
    @Param("id") postId: string,
    @Body() dto: CreateCommentDto,
  ): Promise<ApiResponse<Comment>> {
    try {
      const comment = await this.postsService.createComment(postId, dto.content);
      return {
        success: true,
        data: comment,
        message: "评论成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "COMMENT_FAILED",
            message: "评论失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 埋点接口
  @Post(":id/events")
  @UsePipes(new ValidationPipe({ transform: true }))
  async trackEvent(
    @Param("id") postId: string,
    @Body() dto: TrackEventDto,
  ): Promise<ApiResponse<void>> {
    try {
      await this.postsService.trackEvent(postId, dto.type);
      return {
        success: true,
        message: "事件记录成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "TRACKING_FAILED",
            message: "事件记录失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
