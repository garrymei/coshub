import Taro from '@tarojs/taro';
import type { ApiResponse } from '@coshub/types';

const BASE_URL = 'http://localhost:3001/api';

// 封装请求方法
const request = async <T>(url: string, options: any = {}): Promise<ApiResponse<T>> => {
  try {
    const response = await Taro.request({
      url: `${BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...options.header
      }
    });

    return response.data as ApiResponse<T>;
  } catch (error) {
    console.error('API请求失败:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: '网络请求失败'
      },
      timestamp: new Date().toISOString()
    };
  }
};

// 技能（MVP 内存版） API
export const skillsApi = {
  // 列表
  getList: (params?: { city?: string; role?: string; page?: number }): Promise<ApiResponse<{ total: number; page: number; pageSize: number; items: any[] }>> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    return request(`/skills${queryString ? `?${queryString}` : ''}`);
  },
  // 详情
  getDetail: (id: string): Promise<ApiResponse<any>> => request(`/skills/${id}`),
  // 创建
  create: (data: { title: string; city: string; role: string; description?: string; images?: string[] }): Promise<ApiResponse<any>> => request('/skills', { method: 'POST', data }),
};

// 格式化价格显示
export const formatPrice = (_post: any): string => '价格面议';

// 显示 Toast
export const showToast = (title: string, icon: 'success' | 'error' | 'loading' | 'none' = 'none') => {
  Taro.showToast({
    title,
    icon,
    duration: 2000
  });
};

// 显示加载中
export const showLoading = (title = '加载中...') => {
  Taro.showLoading({ title });
};

// 隐藏加载中
export const hideLoading = () => {
  Taro.hideLoading();
};
