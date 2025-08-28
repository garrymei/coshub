import Taro from '@tarojs/taro';
import type { 
  SkillPost, 
  SkillPostListResponse, 
  CreateSkillPostDTO,
  SkillPostQueryDTO,
  ApiResponse 
} from '@coshub/types';

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

// 技能帖 API
export const skillPostApi = {
  // 获取技能帖列表
  getList: (params?: SkillPostQueryDTO): Promise<ApiResponse<SkillPostListResponse>> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    return request(`/skill-posts${queryString ? `?${queryString}` : ''}`);
  },

  // 获取技能帖详情
  getDetail: (id: string): Promise<ApiResponse<SkillPost>> => {
    return request(`/skill-posts/${id}`);
  },

  // 创建技能帖
  create: (data: CreateSkillPostDTO): Promise<ApiResponse<SkillPost>> => {
    return request('/skill-posts', {
      method: 'POST',
      data
    });
  },

  // 获取城市列表
  getCities: (): Promise<ApiResponse<string[]>> => {
    return request('/skill-posts/meta/cities');
  },

  // 获取热门标签
  getTags: (): Promise<ApiResponse<string[]>> => {
    return request('/skill-posts/meta/tags');
  }
};

// 格式化价格显示
export const formatPrice = (post: SkillPost): string => {
  const { price } = post;
  switch (price.type) {
    case 'free':
      return '免费';
    case 'fixed':
      return `¥${price.amount}`;
    case 'range':
      return `¥${price.range?.min}-${price.range?.max}`;
    case 'negotiable':
      return '面议';
    default:
      return '价格面议';
  }
};

// 显示 Toast
export const showToast = (title: string, icon: 'success' | 'error' | 'loading' | 'none' = 'none') => {
  Taro.showToast({
    title,
    icon,
    duration: 2000
  });
};

// 显示加载中
export const showLoading = (title: string = '加载中...') => {
  Taro.showLoading({ title });
};

// 隐藏加载中
export const hideLoading = () => {
  Taro.hideLoading();
};
