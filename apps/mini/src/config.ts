// 环境配置
export const Config = {
  // API基础URL - 可被 TARO_APP_API_BASE_URL 覆盖
  API_BASE_URL:
    (process.env.TARO_APP_API_BASE_URL as string | undefined) ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3001/api"
      : "https://api.coshub.com"),

  // Banner相关配置
  BANNER: {
    // 默认Banner图片，当API请求失败时使用
    DEFAULT_IMAGES: [
      "https://coshub.oss-cn-hangzhou.aliyuncs.com/banners/default1.jpg",
      "https://coshub.oss-cn-hangzhou.aliyuncs.com/banners/default2.jpg",
    ],

    // 请求超时时间(毫秒)
    TIMEOUT: 5000,
  },
};

// 导出类型定义
export type ConfigType = typeof Config;
