import { Injectable, BadRequestException } from "@nestjs/common";
import * as Minio from "minio";
import { ConfigService } from "@nestjs/config";

export interface PresignedPostData {
  uploadUrl: string;
  fields: Record<string, string>;
  fileUrl: string;
  filename: string;
  expires: number;
}

export interface UploadConfig {
  maxFileSize: number;
  allowedMimeTypes: string[];
  maxFiles: number;
  expiresIn: number;
}

@Injectable()
export class UploadService {
  private minioClient: Minio.Client;
  private bucketName: string;
  private config: UploadConfig;

  constructor(private configService: ConfigService) {
    // 初始化 MinIO 客户端
    this.minioClient = new Minio.Client({
      endPoint: this.configService
        .get("MINIO_ENDPOINT", "localhost:9000")
        .replace("http://", "")
        .replace("https://", ""),
      port: this.configService.get("MINIO_PORT", 9000),
      useSSL: this.configService.get("MINIO_USE_SSL", false),
      accessKey: this.configService.get("MINIO_ACCESS_KEY", "minioadmin"),
      secretKey: this.configService.get("MINIO_SECRET_KEY", "minioadmin"),
    });

    this.bucketName = this.configService.get("MINIO_BUCKET", "coshub-uploads");

    // 上传配置
    this.config = {
      maxFileSize: parseInt(
        this.configService.get("UPLOAD_MAX_FILE_SIZE", "10485760"),
      ), // 10MB
      allowedMimeTypes: this.configService
        .get("UPLOAD_ALLOWED_IMAGES", "jpg,jpeg,png,gif,webp")
        .split(",")
        .map((ext) => `image/${ext.replace("jpg", "jpeg")}`),
      maxFiles: parseInt(this.configService.get("UPLOAD_MAX_FILES", "9")),
      expiresIn: parseInt(
        this.configService.get("UPLOAD_PRESIGN_EXPIRES", "3600"),
      ), // 1小时
    };

    this.initBucket();
  }

  // 初始化存储桶
  private async initBucket() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, "us-east-1");
        console.log(`✅ 创建存储桶: ${this.bucketName}`);

        // 设置桶策略，允许公开读取
        const policy = {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: { AWS: ["*"] },
              Action: ["s3:GetObject"],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };

        await this.minioClient.setBucketPolicy(
          this.bucketName,
          JSON.stringify(policy),
        );
        console.log(`✅ 设置存储桶公开读取策略: ${this.bucketName}`);
      }
    } catch (error) {
      console.error("❌ 初始化存储桶失败:", error);
    }
  }

  // 生成上传预签名 URL
  async generatePresignedPost(
    filename: string,
    mimeType: string,
    fileSize: number,
    userId?: string,
  ): Promise<PresignedPostData> {
    // 验证文件类型
    if (!this.config.allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException(`不支持的文件类型: ${mimeType}`);
    }

    // 验证文件大小
    if (fileSize > this.config.maxFileSize) {
      throw new BadRequestException(
        `文件大小超过限制: ${fileSize} > ${this.config.maxFileSize}`,
      );
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = this.getFileExtension(filename);
    const uniqueFilename = `${timestamp}-${randomStr}${ext}`;

    // 生成对象键 (根据用户ID和日期组织目录结构)
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const objectKey = userId
      ? `users/${userId}/${date}/${uniqueFilename}`
      : `public/${date}/${uniqueFilename}`;

    try {
      // 生成预签名 PUT URL
      const uploadUrl = await this.minioClient.presignedPutObject(
        this.bucketName,
        objectKey,
        this.config.expiresIn,
      );

      // 生成文件访问 URL
      const fileUrl = `${this.configService.get("MINIO_ENDPOINT", "http://localhost:9000")}/${this.bucketName}/${objectKey}`;

      return {
        uploadUrl,
        fields: {
          "Content-Type": mimeType,
          "Content-Length": fileSize.toString(),
        },
        fileUrl,
        filename: uniqueFilename,
        expires: Date.now() + this.config.expiresIn * 1000,
      };
    } catch (error) {
      console.error("生成预签名 URL 失败:", error);
      throw new BadRequestException("生成上传链接失败");
    }
  }

  // 批量生成上传预签名 URL
  async generateBatchPresignedPost(
    files: Array<{
      filename: string;
      mimeType: string;
      fileSize: number;
    }>,
    userId?: string,
  ): Promise<PresignedPostData[]> {
    if (files.length > this.config.maxFiles) {
      throw new BadRequestException(
        `文件数量超过限制: ${files.length} > ${this.config.maxFiles}`,
      );
    }

    const results: PresignedPostData[] = [];

    for (const file of files) {
      const presignedData = await this.generatePresignedPost(
        file.filename,
        file.mimeType,
        file.fileSize,
        userId,
      );
      results.push(presignedData);
    }

    return results;
  }

  // 删除文件
  async deleteFile(fileUrl: string, userId?: string): Promise<boolean> {
    try {
      // 从文件 URL 中提取对象键
      const objectKey = this.extractObjectKeyFromUrl(fileUrl);

      // 权限检查：确保用户只能删除自己的文件
      if (userId && !objectKey.startsWith(`users/${userId}/`)) {
        throw new BadRequestException("无权限删除此文件");
      }

      await this.minioClient.removeObject(this.bucketName, objectKey);
      return true;
    } catch (error) {
      console.error("删除文件失败:", error);
      return false;
    }
  }

  // 获取文件信息
  async getFileInfo(fileUrl: string): Promise<any> {
    try {
      const objectKey = this.extractObjectKeyFromUrl(fileUrl);
      const stat = await this.minioClient.statObject(
        this.bucketName,
        objectKey,
      );
      return {
        size: stat.size,
        lastModified: stat.lastModified,
        contentType: stat.metaData?.["content-type"],
        etag: stat.etag,
      };
    } catch (error) {
      console.error("获取文件信息失败:", error);
      return null;
    }
  }

  // 获取上传配置信息
  getUploadConfig(): UploadConfig {
    return { ...this.config };
  }

  // 辅助方法：获取文件扩展名
  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf(".");
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : "";
  }

  // 辅助方法：从 URL 中提取对象键
  private extractObjectKeyFromUrl(fileUrl: string): string {
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split("/");
    // 移除空字符串和桶名，剩下的就是对象键
    return pathParts.slice(2).join("/");
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      await this.minioClient.bucketExists(this.bucketName);
      return true;
    } catch {
      return false;
    }
  }
}
