import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";
import type { StorageProvider } from "../storage.provider";

// Generic S3-compatible provider using Minio SDK
export class S3StorageProvider implements StorageProvider {
  private client: Minio.Client;
  private endpoint: string;

  constructor(private readonly config: ConfigService) {
    const endpointRaw = this.config.get<string>(
      "S3_ENDPOINT",
      "http://localhost:9000",
    );
    const endpointHost = endpointRaw
      .replace("http://", "")
      .replace("https://", "");
    this.client = new Minio.Client({
      endPoint: endpointHost,
      port: this.config.get<number>("S3_PORT", 9000),
      useSSL: this.config.get<boolean>("S3_USE_SSL", false),
      accessKey: this.config.get<string>("S3_ACCESS_KEY", ""),
      secretKey: this.config.get<string>("S3_SECRET_KEY", ""),
    });
    this.endpoint = endpointRaw;
  }

  async ensureBucket(
    bucket: string,
    region = "us-east-1",
    publicRead = true,
  ): Promise<void> {
    const exists = await this.client.bucketExists(bucket).catch(() => false);
    if (!exists) {
      await this.client.makeBucket(bucket, region);
      if (publicRead) {
        const policy = {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: { AWS: ["*"] },
              Action: ["s3:GetObject"],
              Resource: [`arn:aws:s3:::${bucket}/*`],
            },
          ],
        };
        try {
          await this.client.setBucketPolicy(bucket, JSON.stringify(policy));
        } catch (e) {
          // 某些云厂商策略设置需要控制台操作或权限，忽略此错误
        }
      }
    }
  }

  async presignedPut(
    bucket: string,
    objectKey: string,
    expiresInSec: number,
    _contentType?: string,
  ): Promise<string> {
    return this.client.presignedPutObject(bucket, objectKey, expiresInSec);
  }

  async removeObject(bucket: string, objectKey: string): Promise<void> {
    await this.client.removeObject(bucket, objectKey);
  }

  async statObject(
    bucket: string,
    objectKey: string,
  ): Promise<{
    size: number;
    lastModified: Date;
    etag?: string;
    contentType?: string;
  }> {
    const stat = await this.client.statObject(bucket, objectKey);
    return {
      size: stat.size,
      lastModified: stat.lastModified,
      etag: stat.etag,
      contentType: (stat as any).metaData?.["content-type"],
    };
  }

  getPublicUrl(bucket: string, objectKey: string): string {
    return `${this.endpoint}/${bucket}/${objectKey}`;
  }

  async bucketExists(bucket: string): Promise<boolean> {
    try {
      return await this.client.bucketExists(bucket);
    } catch {
      return false;
    }
  }
}
