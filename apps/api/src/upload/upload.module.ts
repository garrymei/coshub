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
        const type = (config.get<string>('STORAGE_TYPE', 'minio') || 'minio').toLowerCase();
        switch (type) {
          case 'minio':
            return new MinioStorageProvider(config);
          case 'cos':
          case 's3':
          case 'qiniu':
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
