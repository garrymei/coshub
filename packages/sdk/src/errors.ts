/**
 * 错误处理工具
 */

import type { ApiError, ApiResponse } from '@coshub/types';

export class CoshubError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, any>;
  public readonly timestamp: string;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = 'CoshubError';
    this.code = apiError.code;
    this.details = apiError.details;
    this.timestamp = new Date().toISOString();
  }

  /**
   * 检查是否为特定错误类型
   */
  is(code: string): boolean {
    return this.code === code;
  }

  /**
   * 检查是否为网络错误
   */
  isNetworkError(): boolean {
    return this.code === 'NETWORK_ERROR' || this.code === 'TIMEOUT';
  }

  /**
   * 检查是否为认证错误
   */
  isAuthError(): boolean {
    return this.code === '401' || this.code === '403';
  }

  /**
   * 检查是否为验证错误
   */
  isValidationError(): boolean {
    return this.code === '400' || this.code === 'VALIDATION_ERROR';
  }

  /**
   * 检查是否为服务器错误
   */
  isServerError(): boolean {
    return this.code.startsWith('5') || this.code === 'UNKNOWN_ERROR';
  }
}

/**
 * 错误处理工具类
 */
export class ErrorHandler {
  /**
   * 处理 API 响应，如果失败则抛出错误
   */
  static throwIfError<T>(response: ApiResponse<T>): T {
    if (!response.success) {
      throw new CoshubError(response.error!);
    }
    return response.data!;
  }

  /**
   * 安全地处理 API 响应，返回数据或 null
   */
  static safely<T>(response: ApiResponse<T>): T | null {
    return response.success ? response.data! : null;
  }

  /**
   * 从错误中提取用户友好的消息
   */
  static getUserMessage(error: unknown): string {
    if (error instanceof CoshubError) {
      switch (error.code) {
        case 'NETWORK_ERROR':
          return '网络连接失败，请检查网络设置';
        case 'TIMEOUT':
          return '请求超时，请稍后重试';
        case '401':
          return '请先登录';
        case '403':
          return '没有权限执行此操作';
        case '404':
          return '请求的资源不存在';
        case '429':
          return '请求过于频繁，请稍后重试';
        case '500':
          return '服务器内部错误，请稍后重试';
        default:
          return error.message || '操作失败';
      }
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    return '未知错误';
  }

  /**
   * 记录错误到控制台（开发环境）
   */
  static logError(error: unknown, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 CoshubSDK Error${context ? ` [${context}]` : ''}`);
      
      if (error instanceof CoshubError) {
        console.error('Code:', error.code);
        console.error('Message:', error.message);
        console.error('Details:', error.details);
        console.error('Timestamp:', error.timestamp);
      } else {
        console.error(error);
      }
      
      console.groupEnd();
    }
  }
}

/**
 * 重试工具
 */
export class RetryHandler {
  /**
   * 带重试的异步函数执行
   */
  static async withRetry<T>(
    fn: () => Promise<T>,
    options: {
      maxAttempts: number;
      delay: number;
      shouldRetry?: (error: unknown) => boolean;
    }
  ): Promise<T> {
    const { maxAttempts, delay, shouldRetry } = options;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // 如果是最后一次尝试，或者不应该重试，则抛出错误
        if (attempt === maxAttempts || (shouldRetry && !shouldRetry(error))) {
          throw error;
        }
        
        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError;
  }

  /**
   * 判断错误是否应该重试
   */
  static shouldRetryError(error: unknown): boolean {
    if (error instanceof CoshubError) {
      // 网络错误、超时、服务器错误可以重试
      return error.isNetworkError() || error.isServerError();
    }
    return false;
  }
}
