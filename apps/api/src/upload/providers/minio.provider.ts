import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import type { StorageProvider } from '../storage.provider';

export class MinioStorageProvider implements StorageProvider {
  private client: Minio.Client;
  private endpoint: string;

  constructor(private readonly config: ConfigService) {
    const endpointRaw = this.config.get<string>('MINIO_ENDPOINT', 'http://localhost:9000');
    const endpointHost = endpointRaw.replace('http://', '').replace('https://', '');
    this.client = new Minio.Client({
      endPoint: endpointHost,
      port: this.config.get<number>('MINIO_PORT', 9000),
      useSSL: this.config.get<boolean>('MINIO_USE_SSL', false),
      accessKey: this.config.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.config.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
    });
    this.endpoint = endpointRaw;
  }

  async ensureBucket(bucket: string, region = 'us-east-1', publicRead = true): Promise<void> {
    const exists = await this.client.bucketExists(bucket).catch(() => false);
    if (!exists) {
      await this.client.makeBucket(bucket, region);
      if (publicRead) {
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucket}/*`],
            },
          ],
        };
        await this.client.setBucketPolicy(bucket, JSON.stringify(policy));
      }
    }
  }

  async presignedPut(bucket: string, objectKey: string, expiresInSec: number, contentType?: string): Promise<string> {
    // Minio SDK presignedPutObject ignores contentType param; caller sets it in request headers
    return this.client.presignedPutObject(bucket, objectKey, expiresInSec);
  }

  async removeObject(bucket: string, objectKey: string): Promise<void> {
    await this.client.removeObject(bucket, objectKey);
  }

  async statObject(bucket: string, objectKey: string): Promise<{ size: number; lastModified: Date; etag?: string; contentType?: string }> {
    const stat = await this.client.statObject(bucket, objectKey);
    return {
      size: stat.size,
      lastModified: stat.lastModified,
      contentType: (stat as any).metaData?.['content-type'],
      etag: stat.etag,
    };
  }

  getPublicUrl(bucket: string, objectKey: string): string {
    return `${this.endpoint}/${bucket}/${objectKey}`;
  }
}

