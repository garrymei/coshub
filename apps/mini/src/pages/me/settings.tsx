import { View, Text, Switch, Button } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import React, { useState } from "react";
import {
  showToast,
  showConfirm,
  checkLogin,
  goToLogin,
} from "../../utils/common";
import ThemeToggle from "@/components/ThemeToggle";
import "./settings.scss";

const SettingsPage: React.FC = () => {
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useLoad(() => {
    if (!checkLogin()) {
      goToLogin();
      return;
    }

    // 从本地存储加载设置
    const settings = Taro.getStorageSync("settings");
    if (settings) {
      setNotificationEnabled(settings.notificationEnabled !== false);
      setDarkModeEnabled(settings.darkModeEnabled === true);
    }
  });

  const handleNotificationChange = (e) => {
    const value = e.detail.value;
    setNotificationEnabled(value);
    saveSettings({ notificationEnabled: value });
  };

  const handleDarkModeChange = (e) => {
    const value = e.detail.value;
    setDarkModeEnabled(value);
    saveSettings({ darkModeEnabled: value });
  };

  const saveSettings = (newSettings) => {
    const settings = Taro.getStorageSync("settings") || {};
    const updatedSettings = { ...settings, ...newSettings };
    Taro.setStorageSync("settings", updatedSettings);
  };

  const handleClearCache = async () => {
    const confirmed = await showConfirm("清除缓存", "确定要清除缓存吗？");
    if (confirmed) {
      try {
        await Taro.clearStorage();
        showToast("缓存已清除", "success");
      } catch (error) {
        console.error("清除缓存失败:", error);
        showToast("清除缓存失败", "error");
      }
    }
  };

  const handleLogout = async () => {
    const confirmed = await showConfirm("退出登录", "确定要退出登录吗？");
    if (confirmed) {
      // 清除登录信息
      Taro.removeStorageSync("token");
      Taro.removeStorageSync("userInfo");

      showToast("已退出登录", "success");

      // 跳转到登录页
      setTimeout(() => {
        Taro.redirectTo({
          url: "/pages/login/index",
        });
      }, 1500);
    }
  };

  return (
    <View className="settings-page">
      <View className="settings-group">
        <View className="settings-item">
          <Text className="settings-label">消息通知</Text>
          <Switch
            checked={notificationEnabled}
            onChange={handleNotificationChange}
            color="var(--coshub-primary)"
          />
        </View>

        <View className="settings-item">
          <Text className="settings-label">主题模式</Text>
          <ThemeToggle />
        </View>
      </View>

      <View className="settings-group">
        <View className="settings-item" onClick={handleClearCache}>
          <Text className="settings-label">清除缓存</Text>
          <Text className="settings-arrow">›</Text>
        </View>

        <View className="settings-item">
          <Text className="settings-label">关于我们</Text>
          <Text className="settings-arrow">›</Text>
        </View>

        <View className="settings-item">
          <Text className="settings-label">用户协议</Text>
          <Text className="settings-arrow">›</Text>
        </View>

        <View className="settings-item">
          <Text className="settings-label">隐私政策</Text>
          <Text className="settings-arrow">›</Text>
        </View>
      </View>

      <Button className="logout-button" onClick={handleLogout}>
        退出登录
      </Button>
    </View>
  );
};

export default SettingsPage;
