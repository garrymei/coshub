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
  UsePipes
} from '@nestjs/common';
import { SkillPostsService } from './skill-posts.service';
import {
  CreateSkillPostDTO,
  UpdateSkillPostDTO,
  SkillPostQueryDTO,
  SkillPost,
  SkillPostListResponse,
  ApiResponse
} from '@coshub/types';

@Controller('skill-posts')
export class SkillPostsController {
  constructor(private readonly skillPostsService: SkillPostsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createSkillPostDto: CreateSkillPostDTO): Promise<ApiResponse<SkillPost>> {
    try {
      const skillPost = await this.skillPostsService.create(createSkillPostDto);

      return {
        success: true,
        data: skillPost,
        message: '技能帖发布成功',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'CREATE_FAILED',
            message: '发布技能帖失败',
            details: error.message
          },
          timestamp: new Date().toISOString()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  async findAll(@Query() query: SkillPostQueryDTO): Promise<ApiResponse<SkillPostListResponse>> {
    try {
      const result = await this.skillPostsService.findAll(query);
      
      return {
        success: true,
        data: result,
        message: '获取技能帖列表成功',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'FETCH_FAILED',
            message: '获取技能帖列表失败',
            details: error.message
          },
          timestamp: new Date().toISOString()
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<SkillPost>> {
    try {
      const skillPost = await this.skillPostsService.findOne(id);
      
      if (!skillPost) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: '技能帖不存在',
              details: { id }
            },
            timestamp: new Date().toISOString()
          },
          HttpStatus.NOT_FOUND
        );
      }

      return {
        success: true,
        data: skillPost,
        message: '获取技能帖详情成功',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'FETCH_FAILED',
            message: '获取技能帖详情失败',
            details: error.message
          },
          timestamp: new Date().toISOString()
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateSkillPostDto: UpdateSkillPostDTO
  ): Promise<ApiResponse<SkillPost>> {
    try {
      const skillPost = await this.skillPostsService.update(id, updateSkillPostDto);
      
      if (!skillPost) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: '技能帖不存在',
              details: { id }
            },
            timestamp: new Date().toISOString()
          },
          HttpStatus.NOT_FOUND
        );
      }

      return {
        success: true,
        data: skillPost,
        message: '更新技能帖成功',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'UPDATE_FAILED',
            message: '更新技能帖失败',
            details: error.message
          },
          timestamp: new Date().toISOString()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<void>> {
    try {
      const success = await this.skillPostsService.remove(id);
      
      if (!success) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: '技能帖不存在',
              details: { id }
            },
            timestamp: new Date().toISOString()
          },
          HttpStatus.NOT_FOUND
        );
      }

      return {
        success: true,
        message: '删除技能帖成功',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'DELETE_FAILED',
            message: '删除技能帖失败',
            details: error.message
          },
          timestamp: new Date().toISOString()
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 获取城市列表（用于筛选）
  @Get('meta/cities')
  async getCities(): Promise<ApiResponse<string[]>> {
    try {
      const cities = await this.skillPostsService.getCities();
      
      return {
        success: true,
        data: cities,
        message: '获取城市列表成功',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'FETCH_FAILED',
            message: '获取城市列表失败',
            details: error.message
          },
          timestamp: new Date().toISOString()
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 获取热门标签（用于推荐）
  @Get('meta/tags')
  async getTags(): Promise<ApiResponse<string[]>> {
    try {
      const tags = await this.skillPostsService.getTags();
      
      return {
        success: true,
        data: tags,
        message: '获取热门标签成功',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'FETCH_FAILED',
            message: '获取热门标签失败',
            details: error.message
          },
          timestamp: new Date().toISOString()
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
