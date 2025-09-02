import { SetMetadata } from "@nestjs/common";
import { RateLimitType } from "@coshub/types";

export const RATE_LIMIT_KEY = "rateLimitType";
export const RateLimit = (type: RateLimitType) =>
  SetMetadata(RATE_LIMIT_KEY, type);
