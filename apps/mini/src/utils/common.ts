import Taro from "@tarojs/taro";

// 显示提示信息
export const showToast = (
  title: string,
  icon: "success" | "error" | "loading" | "none" = "none",
) => {
  Taro.showToast({
    title,
    icon,
    duration: 2000,
  });
};

// 显示加载中
export const showLoading = (title = "加载中...") => {
  Taro.showLoading({
    title,
    mask: true,
  });
};

// 隐藏加载中
export const hideLoading = () => {
  Taro.hideLoading();
};

// 显示确认对话框
export const showConfirm = (
  title: string,
  content: string,
): Promise<boolean> => {
  return new Promise((resolve) => {
    Taro.showModal({
      title,
      content,
      success: (res) => {
        if (res.confirm) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      fail: () => {
        resolve(false);
      },
    });
  });
};

// 格式化时间
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) {
    return "刚刚";
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}分钟前`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}小时前`;
  } else if (diff < 2592000) {
    return `${Math.floor(diff / 86400)}天前`;
  } else {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
};

// 上传图片到服务器
const uploadToServer = async (filePath: string): Promise<string> => {
  try {
    const token = Taro.getStorageSync("token");
    
    const uploadResult = await Taro.uploadFile({
      url: `${process.env.TARO_APP_API_BASE_URL || "http://localhost:3001/api"}/upload/image`,
      filePath,
      name: "file",
      header: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (uploadResult.statusCode === 200) {
      const result = JSON.parse(uploadResult.data);
      if (result.success && result.data?.url) {
        return result.data.url;
      } else {
        throw new Error(result.message || "上传失败");
      }
    } else {
      throw new Error(`上传失败: ${uploadResult.statusCode}`);
    }
  } catch (error) {
    console.error("上传图片失败:", error);
    throw error;
  }
};

// 上传图片
export const uploadImage = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    Taro.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: async (res) => {
        const tempFilePath = res.tempFilePaths[0];
        
        try {
          showLoading("上传中...");
          
          if (process.env.TARO_APP_USE_MOCK === "true") {
            // 模拟上传
            setTimeout(() => {
              hideLoading();
              resolve(tempFilePath);
            }, 1000);
          } else {
            // 真实上传
            const imageUrl = await uploadToServer(tempFilePath);
            hideLoading();
            resolve(imageUrl);
          }
        } catch (error) {
          hideLoading();
          showToast("上传失败", "error");
          reject(error);
        }
      },
      fail: (err) => {
        showToast("选择图片失败", "error");
        reject(err);
      },
    });
  });
};

// 上传多张图片
export const uploadImages = (count = 9): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    Taro.chooseImage({
      count,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: async (res) => {
        const tempFilePaths = res.tempFilePaths;
        
        try {
          showLoading("上传中...");
          
          if (process.env.TARO_APP_USE_MOCK === "true") {
            // 模拟上传
            setTimeout(() => {
              hideLoading();
              resolve(tempFilePaths);
            }, 1000);
          } else {
            // 真实上传
            const uploadPromises = tempFilePaths.map(filePath => uploadToServer(filePath));
            const imageUrls = await Promise.all(uploadPromises);
            hideLoading();
            resolve(imageUrls);
          }
        } catch (error) {
          hideLoading();
          showToast("上传失败", "error");
          reject(error);
        }
      },
      fail: (err) => {
        showToast("选择图片失败", "error");
        reject(err);
      },
    });
  });
};

// 检查登录状态
export const checkLogin = (): boolean => {
  const token = Taro.getStorageSync("token");
  const userInfo = Taro.getStorageSync("userInfo");

  return !!(token && userInfo);
};

// 跳转到登录页
export const goToLogin = () => {
  Taro.navigateTo({
    url: "/pages/login/index",
  });
};

// 获取当前用户信息
export const getCurrentUser = () => {
  return Taro.getStorageSync("userInfo");
};

// 检查网络状态
export const checkNetworkStatus = (): Promise<boolean> => {
  return new Promise((resolve) => {
    Taro.getNetworkType({
      success: (res) => {
        if (res.networkType === "none") {
          showToast("网络连接不可用", "error");
          resolve(false);
        } else {
          resolve(true);
        }
      },
      fail: () => {
        showToast("网络状态检查失败", "error");
        resolve(false);
      },
    });
  });
};

// 网络状态监听
export const onNetworkStatusChange = (callback: (isConnected: boolean) => void) => {
  Taro.onNetworkStatusChange((res) => {
    callback(res.isConnected);
    if (!res.isConnected) {
      showToast("网络连接已断开", "error");
    }
  });
};
