import type * as Minio from "minio";

export const STORAGE_PROVIDER = Symbol("STORAGE_PROVIDER");

export interface StorageProvider {
  ensureBucket(
    bucket: string,
    region?: string,
    publicRead?: boolean,
  ): Promise<void>;
  presignedPut(
    bucket: string,
    objectKey: string,
    expiresInSec: number,
    contentType?: string,
  ): Promise<string>;
  removeObject(bucket: string, objectKey: string): Promise<void>;
  statObject(
    bucket: string,
    objectKey: string,
  ): Promise<{
    size: number;
    lastModified: Date;
    etag?: string;
    contentType?: string;
  }>;
  getPublicUrl(bucket: string, objectKey: string): string;
  bucketExists(bucket: string): Promise<boolean>;
}
