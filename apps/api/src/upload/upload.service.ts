import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { STORAGE_PROVIDER, type StorageProvider } from "./storage.provider";

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
  private bucketName: string;
  private config: UploadConfig;
  private providerType: string;
  private publicEndpoint: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(STORAGE_PROVIDER) private readonly storage: StorageProvider,
  ) {

    // 根据存储类型决定桶名配置项
    const providerType = (this.configService.get('STORAGE_TYPE', 'minio') || 'minio').toString();
    const minioBucket = this.configService.get('MINIO_BUCKET', 'coshub-uploads');
    this.bucketName =
      providerType === 'minio'
        ? minioBucket
        : this.configService.get('S3_BUCKET', minioBucket);

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

    // provider 与公共访问端点
    this.providerType = (this.configService.get('STORAGE_TYPE', 'minio') || 'minio').toString();
    const minioEp = this.configService.get('MINIO_ENDPOINT', 'http://localhost:9000');
    const s3Ep = this.configService.get('S3_ENDPOINT', minioEp);
    this.publicEndpoint = this.providerType === 'minio' ? minioEp : s3Ep;

    // 初始化存储桶
    this.initBucket();
  }

  // 初始化存储桶
  private async initBucket() {
    try {
      await this.storage.ensureBucket(this.bucketName, "us-east-1", true);
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
      const uploadUrl = await this.storage.presignedPut(
        this.bucketName,
        objectKey,
        this.config.expiresIn,
        mimeType,
      );

      // 生成文件访问 URL
      const fileUrl = this.storage.getPublicUrl(this.bucketName, objectKey);

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

      await this.storage.removeObject(this.bucketName, objectKey);
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
      const stat = await this.storage.statObject(this.bucketName, objectKey);
      return {
        size: stat.size,
        lastModified: stat.lastModified,
        contentType: stat.contentType,
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

  getProviderMeta() {
    return {
      type: this.providerType,
      endpoint: this.publicEndpoint,
      bucket: this.bucketName,
    };
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
      // 只读检查：存在即健康
      const ok = await this.storage.bucketExists(this.bucketName);
      return !!ok;
    } catch {
      return false;
    }
  }
}
