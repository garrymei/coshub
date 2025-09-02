import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { STORAGE_PROVIDER } from "./storage.provider";
import { MinioStorageProvider } from "./providers/minio.provider";

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: STORAGE_PROVIDER,
      useFactory: (config: ConfigService) => new MinioStorageProvider(config),
      inject: [ConfigService],
    },
  ],
  exports: [UploadService],
})
export class UploadModule {}
