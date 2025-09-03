import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { STORAGE_PROVIDER } from "./storage.provider";
import { MinioStorageProvider } from "./providers/minio.provider";
import { S3StorageProvider } from "./providers/s3.provider";

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: STORAGE_PROVIDER,
      useFactory: (config: ConfigService) => {
        const type = (
          config.get<string>("STORAGE_TYPE", "minio") || "minio"
        ).toLowerCase();
        console.log("Storage type:", type); // 调试日志
        switch (type) {
          case "local":
            // 临时返回一个简单的对象，避免 MinIO 连接
            return {
              upload: async () => ({
                success: true,
                message: "Local storage not implemented yet",
              }),
              presignedPut: async () => "http://localhost:3000/upload",
              getPublicUrl: () => "http://localhost:3000/files",
              ensureBucket: async () => true,
            };
          case "minio":
            return new MinioStorageProvider(config);
          case "cos":
          case "s3":
          case "qiniu":
            return new S3StorageProvider(config);
          default:
            return new MinioStorageProvider(config);
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [UploadService],
})
export class UploadModule {}
