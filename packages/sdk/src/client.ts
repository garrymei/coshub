/**
 * HTTP 客户端封装
 */

import type { ApiResponse, ApiError } from "@coshub/types";

export interface ClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  retry?: {
    attempts: number;
    delay: number;
  };
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  skipAuth?: boolean;
}

export class CoshubClient {
  private config: ClientConfig;
  private authToken?: string;

  constructor(config: ClientConfig) {
    this.config = {
      timeout: 10000,
      retry: { attempts: 3, delay: 1000 },
      ...config,
    };
  }

  /**
   * 设置认证 Token
   */
  setAuthToken(token: string) {
    this.authToken = token;
  }

  /**
   * 清除认证 Token
   */
  clearAuthToken() {
    this.authToken = undefined;
  }

  /**
   * 发送 HTTP 请求
   */
  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      headers = {},
      params,
      data,
      timeout = this.config.timeout,
      skipAuth = false,
    } = options;

    const url = this.buildURL(endpoint, params);
    const requestHeaders = this.buildHeaders(headers, skipAuth);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await this.handleResponse<T>(response);
      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  /**
   * POST 请求
   */
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "POST", data });
  }

  /**
   * PUT 请求
   */
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", data });
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  /**
   * 构建完整 URL
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.config.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * 构建请求头
   */
  private buildHeaders(
    headers: Record<string, string>,
    skipAuth: boolean,
  ): Record<string, string> {
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.config.headers,
      ...headers,
    };

    if (!skipAuth && this.authToken) {
      requestHeaders["Authorization"] = `Bearer ${this.authToken}`;
    }

    return requestHeaders;
  }

  /**
   * 处理响应
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const text = await response.text();

    try {
      const data = text ? JSON.parse(text) : null;

      if (response.ok) {
        return {
          success: true,
          data: data as T,
          timestamp: new Date().toISOString(),
        };
      } else {
        return {
          success: false,
          error: {
            code: String(response.status),
            message: data?.message || response.statusText,
            details: data,
          },
          timestamp: new Date().toISOString(),
        };
      }
    } catch (parseError) {
      return {
        success: false,
        error: {
          code: "PARSE_ERROR",
          message: "Failed to parse response",
          details: { originalText: text },
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 处理错误
   */
  private handleError<T>(error: any): ApiResponse<T> {
    let apiError: ApiError;

    if (error.name === "AbortError") {
      apiError = {
        code: "TIMEOUT",
        message: "Request timeout",
      };
    } else if (error instanceof TypeError && error.message.includes("fetch")) {
      apiError = {
        code: "NETWORK_ERROR",
        message: "Network connection failed",
      };
    } else {
      apiError = {
        code: "UNKNOWN_ERROR",
        message: error.message || "An unknown error occurred",
        details: error,
      };
    }

    return {
      success: false,
      error: apiError,
      timestamp: new Date().toISOString(),
    };
  }
}
