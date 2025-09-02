import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Query,
  Param,
  HttpException,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from "@nestjs/common";
import { UploadService } from "./upload.service";
import { ApiResponse } from "@coshub/types";

export class PresignRequestDTO {
  filename: string;
  mimeType: string;
  fileSize: number;
}

export class BatchPresignRequestDTO {
  files: PresignRequestDTO[];
}

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // 获取单个文件上传预签名 URL
  @Post("presign")
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPresignedUrl(
    @Body() request: PresignRequestDTO,
  ): Promise<ApiResponse<any>> {
    try {
      // 暂时硬编码用户ID，后续从JWT获取
      const userId = "temp-user-id";

      const presignedData = await this.uploadService.generatePresignedPost(
        request.filename,
        request.mimeType,
        request.fileSize,
        userId,
      );

      return {
        success: true,
        data: presignedData,
        message: "获取上传链接成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "PRESIGN_FAILED",
            message: "生成上传链接失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取批量文件上传预签名 URL
  @Post("presign/batch")
  @UsePipes(new ValidationPipe({ transform: true }))
  async getBatchPresignedUrls(
    @Body() request: BatchPresignRequestDTO,
  ): Promise<ApiResponse<any[]>> {
    try {
      // 暂时硬编码用户ID，后续从JWT获取
      const userId = "temp-user-id";

      const presignedDataList =
        await this.uploadService.generateBatchPresignedPost(
          request.files,
          userId,
        );

      return {
        success: true,
        data: presignedDataList,
        message: "获取批量上传链接成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "BATCH_PRESIGN_FAILED",
            message: "生成批量上传链接失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 删除文件
  @Delete("file")
  async deleteFile(@Query("url") fileUrl: string): Promise<ApiResponse<void>> {
    try {
      if (!fileUrl) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: "MISSING_PARAMETER",
              message: "缺少文件URL参数",
            },
            timestamp: new Date().toISOString(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // 暂时硬编码用户ID，后续从JWT获取
      const userId = "temp-user-id";

      const success = await this.uploadService.deleteFile(fileUrl, userId);

      if (!success) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: "DELETE_FAILED",
              message: "删除文件失败",
            },
            timestamp: new Date().toISOString(),
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        success: true,
        message: "删除文件成功",
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
            code: "DELETE_ERROR",
            message: "删除文件时发生错误",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 获取文件信息
  @Get("file/info")
  async getFileInfo(@Query("url") fileUrl: string): Promise<ApiResponse<any>> {
    try {
      if (!fileUrl) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: "MISSING_PARAMETER",
              message: "缺少文件URL参数",
            },
            timestamp: new Date().toISOString(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const fileInfo = await this.uploadService.getFileInfo(fileUrl);

      if (!fileInfo) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: "FILE_NOT_FOUND",
              message: "文件不存在",
            },
            timestamp: new Date().toISOString(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: fileInfo,
        message: "获取文件信息成功",
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
            code: "GET_FILE_INFO_ERROR",
            message: "获取文件信息时发生错误",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 获取上传配置
  @Get("config")
  async getUploadConfig(): Promise<ApiResponse<any>> {
    try {
      const config = this.uploadService.getUploadConfig();
      const meta = this.uploadService.getProviderMeta();

      return {
        success: true,
        data: {
          maxFileSize: config.maxFileSize,
          maxFileSizeMB: Math.round(config.maxFileSize / 1024 / 1024),
          allowedMimeTypes: config.allowedMimeTypes,
          maxFiles: config.maxFiles,
          expiresIn: config.expiresIn,
          provider: meta,
        },
        message: "获取上传配置成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "GET_CONFIG_ERROR",
            message: "获取上传配置失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 健康检查
  @Get("health")
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const isHealthy = await this.uploadService.healthCheck();
      const meta = this.uploadService.getProviderMeta();

      return {
        success: true,
        data: {
          status: isHealthy ? "healthy" : "unhealthy",
          service: "upload",
          storage: meta.type,
        },
        message: isHealthy ? "上传服务正常" : "上传服务异常",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "HEALTH_CHECK_ERROR",
            message: "健康检查失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
