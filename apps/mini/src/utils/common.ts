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
export const showLoading = (title: string = "加载中...") => {
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

// 上传图片
export const uploadImage = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    Taro.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];

        // 这里应该调用实际的上传API，这里只是模拟
        showLoading("上传中...");

        // 模拟上传延迟
        setTimeout(() => {
          hideLoading();
          // 返回模拟的图片URL
          resolve(tempFilePath);
        }, 1000);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

// 上传多张图片
export const uploadImages = (count: number = 9): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    Taro.chooseImage({
      count,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;

        // 这里应该调用实际的上传API，这里只是模拟
        showLoading("上传中...");

        // 模拟上传延迟
        setTimeout(() => {
          hideLoading();
          // 返回模拟的图片URL数组
          resolve(tempFilePaths);
        }, 1000);
      },
      fail: (err) => {
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
