import {
  Controller,
  Get,
  Post,
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
import { BannersService } from "./banners.service";
import {
  Banner,
  CreateBannerDTO,
  UpdateBannerDTO,
  BannerQueryDTO,
  ApiResponse,
} from "@coshub/types";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { RateLimitGuard } from "../auth/guards/rate-limit.guard";
import { RequirePermissions } from "../auth/decorators/permissions.decorator";
import { RateLimit } from "../auth/decorators/rate-limit.decorator";
import { Permission, RateLimitType } from "@coshub/types";

@Controller("banners")
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  // 获取Banner列表（公开API，无需权限）
  @Get()
  async findAll(
    @Query() query: BannerQueryDTO,
  ): Promise<ApiResponse<Banner[]>> {
    try {
      const banners = await this.bannersService.findAll(query);

      return {
        success: true,
        data: banners,
        message: "获取Banner列表成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "FETCH_FAILED",
            message: "获取Banner列表失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 获取Banner详情（公开API，无需权限）
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<ApiResponse<Banner>> {
    try {
      const banner = await this.bannersService.findOne(id);

      return {
        success: true,
        data: banner,
        message: "获取Banner详情成功",
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
            message: "获取Banner详情失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 创建Banner（需要管理员权限）
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(PermissionGuard, RateLimitGuard)
  @RequirePermissions(Permission.MANAGE_BANNERS)
  @RateLimit(RateLimitType.CREATE_POST)
  async create(
    @Body() createBannerDto: CreateBannerDTO,
  ): Promise<ApiResponse<Banner>> {
    try {
      const banner = await this.bannersService.create(createBannerDto);

      return {
        success: true,
        data: banner,
        message: "创建Banner成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "CREATE_FAILED",
            message: "创建Banner失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 更新Banner（需要管理员权限）
  @Put(":id")
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(PermissionGuard, RateLimitGuard)
  @RequirePermissions(Permission.MANAGE_BANNERS)
  @RateLimit(RateLimitType.EDIT_POST)
  async update(
    @Param("id") id: string,
    @Body() updateBannerDto: UpdateBannerDTO,
  ): Promise<ApiResponse<Banner>> {
    try {
      const banner = await this.bannersService.update(id, updateBannerDto);

      return {
        success: true,
        data: banner,
        message: "更新Banner成功",
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
            message: "更新Banner失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 删除Banner（需要管理员权限）
  @Delete(":id")
  @UseGuards(PermissionGuard, RateLimitGuard)
  @RequirePermissions(Permission.MANAGE_BANNERS)
  @RateLimit(RateLimitType.DELETE_POST)
  async remove(@Param("id") id: string): Promise<ApiResponse<void>> {
    try {
      const success = await this.bannersService.remove(id);

      return {
        success: true,
        message: "删除Banner成功",
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
            message: "删除Banner失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 切换Banner上线状态（需要管理员权限）
  @Put(":id/toggle-online")
  @UseGuards(PermissionGuard, RateLimitGuard)
  @RequirePermissions(Permission.MANAGE_BANNERS)
  async toggleOnline(@Param("id") id: string): Promise<ApiResponse<Banner>> {
    try {
      const banner = await this.bannersService.toggleOnline(id);

      return {
        success: true,
        data: banner,
        message: `Banner已${banner.online ? "上线" : "下线"}`,
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
            message: "切换Banner状态失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 调整Banner优先级（需要管理员权限）
  @Put(":id/priority")
  @UseGuards(PermissionGuard, RateLimitGuard)
  @RequirePermissions(Permission.MANAGE_BANNERS)
  async updatePriority(
    @Param("id") id: string,
    @Body() body: { priority: number },
  ): Promise<ApiResponse<Banner>> {
    try {
      const banner = await this.bannersService.updatePriority(
        id,
        body.priority,
      );

      return {
        success: true,
        data: banner,
        message: "调整Banner优先级成功",
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
            message: "调整Banner优先级失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
