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
} from "@coshub/types";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { RateLimitGuard } from "../auth/guards/rate-limit.guard";
import { RequirePermissions } from "../auth/decorators/permissions.decorator";
import { RateLimit } from "../auth/decorators/rate-limit.decorator";
import { Permission, RateLimitType } from "@coshub/types";

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
    @Query() query: PostQueryDTO,
  ): Promise<ApiResponse<PostListResponse>> {
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
}
