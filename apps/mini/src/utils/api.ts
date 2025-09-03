import Taro from "@tarojs/taro";
import { STORAGE_KEYS, STATUS_CODES } from "./constants";

// API基础URL
const BASE_URL = "https://api.coshub.com";

// 请求方法类型
type Method = "GET" | "POST" | "PUT" | "DELETE";

// 请求选项接口
interface RequestOptions {
  url: string;
  method?: Method;
  data?: any;
  header?: Record<string, string>;
  withToken?: boolean;
}

// 通用请求函数
export const request = async ({
  url,
  method = "GET",
  data = {},
  header = {},
  withToken = true,
}: RequestOptions) => {
  // 如果需要携带token
  if (withToken) {
    const token = Taro.getStorageSync(STORAGE_KEYS.TOKEN);
    if (token) {
      header.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await Taro.request({
      url: url.startsWith("http") ? url : `${BASE_URL}${url}`,
      method,
      data,
      header: {
        "Content-Type": "application/json",
        ...header,
      },
    });

    // 处理响应
    if (response.statusCode === STATUS_CODES.SUCCESS) {
      return response.data;
    } else if (response.statusCode === STATUS_CODES.UNAUTHORIZED) {
      // 未授权，可能是token过期
      Taro.removeStorageSync(STORAGE_KEYS.TOKEN);
      Taro.showToast({
        title: "登录已过期，请重新登录",
        icon: "none",
      });
      // 跳转到登录页
      setTimeout(() => {
        Taro.navigateTo({ url: "/pages/login/index" });
      }, 1500);
      return Promise.reject(new Error("未授权"));
    } else {
      return Promise.reject(response.data);
    }
  } catch (error) {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
};

// 显示加载提示
export const showLoading = (title = "加载中...") => {
  Taro.showLoading({
    title,
    mask: true,
  });
};

// 隐藏加载提示
export const hideLoading = () => {
  Taro.hideLoading();
};

// 显示消息提示
export const showToast = (
  title: string,
  icon: "success" | "error" | "loading" | "none" = "none",
  duration = 2000,
) => {
  Taro.showToast({
    title,
    icon,
    duration,
  });
};

// 技能相关API
export const skillsApi = {
  // 获取技能列表
  getSkills: (params: any = {}) => {
    return request({
      url: "/skills",
      method: "GET",
      data: params,
    });
  },

  // 获取技能详情
  getSkillDetail: (id: string) => {
    return request({
      url: `/skills/${id}`,
      method: "GET",
    });
  },

  // 创建技能
  createSkill: (data: any) => {
    return request({
      url: "/skills",
      method: "POST",
      data,
    });
  },

  // 更新技能
  updateSkill: (id: string, data: any) => {
    return request({
      url: `/skills/${id}`,
      method: "PUT",
      data,
    });
  },

  // 删除技能
  deleteSkill: (id: string) => {
    return request({
      url: `/skills/${id}`,
      method: "DELETE",
    });
  },
};

// 分享相关API
export const feedApi = {
  // 获取分享列表
  getPosts: (params: any = {}) => {
    return request({
      url: "/posts",
      method: "GET",
      data: params,
    });
  },

  // 获取分享详情
  getPostDetail: (id: string) => {
    return request({
      url: `/posts/${id}`,
      method: "GET",
    });
  },

  // 创建分享
  createPost: (data: any) => {
    return request({
      url: "/posts",
      method: "POST",
      data,
    });
  },

  // 更新分享
  updatePost: (id: string, data: any) => {
    return request({
      url: `/posts/${id}`,
      method: "PUT",
      data,
    });
  },

  // 删除分享
  deletePost: (id: string) => {
    return request({
      url: `/posts/${id}`,
      method: "DELETE",
    });
  },

  // 点赞
  likePost: (id: string) => {
    return request({
      url: `/posts/${id}/like`,
      method: "POST",
    });
  },

  // 取消点赞
  unlikePost: (id: string) => {
    return request({
      url: `/posts/${id}/unlike`,
      method: "POST",
    });
  },

  // 收藏
  collectPost: (id: string) => {
    return request({
      url: `/posts/${id}/collect`,
      method: "POST",
    });
  },

  // 取消收藏
  uncollectPost: (id: string) => {
    return request({
      url: `/posts/${id}/uncollect`,
      method: "POST",
    });
  },

  // 评论
  commentPost: (id: string, content: string) => {
    return request({
      url: `/posts/${id}/comment`,
      method: "POST",
      data: { content },
    });
  },

  // 获取评论列表
  getComments: (postId: string, params: any = {}) => {
    return request({
      url: `/posts/${postId}/comments`,
      method: "GET",
      data: params,
    });
  },
};

// 用户相关API
export const userApi = {
  // 登录
  login: (code: string) => {
    return request({
      url: "/auth/login",
      method: "POST",
      data: { code },
      withToken: false,
    });
  },

  // 获取用户信息
  getUserInfo: () => {
    return request({
      url: "/user",
      method: "GET",
    });
  },

  // 更新用户信息
  updateUserInfo: (data: any) => {
    return request({
      url: "/user",
      method: "PUT",
      data,
    });
  },

  // 获取用户发布的内容
  getUserPosts: (userId: string, params: any = {}) => {
    return request({
      url: `/user/${userId}/posts`,
      method: "GET",
      data: params,
    });
  },

  // 获取用户收藏的内容
  getUserCollections: (params: any = {}) => {
    return request({
      url: "/user/collections",
      method: "GET",
      data: params,
    });
  },
};

export default {
  request,
  showLoading,
  hideLoading,
  showToast,
  skillsApi,
  feedApi,
  userApi,
};
