import { View, Text, Button, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useState } from "react";
import { userApi } from "../../services/api";
import { showToast, showLoading, hideLoading } from "../../utils/common";
import "./index.scss";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      showLoading("登录中...");

      // 获取微信登录凭证
      const { code } = await Taro.login();

      // 调用后端登录接口
      const { token, user } = await userApi.login(code);

      // 存储登录信息
      Taro.setStorageSync("token", token);
      Taro.setStorageSync("userInfo", user);

      hideLoading();
      showToast("登录成功", "success");

      // 返回上一页或首页
      setTimeout(() => {
        const pages = Taro.getCurrentPages();
        if (pages.length > 1) {
          Taro.navigateBack();
        } else {
          Taro.switchTab({
            url: "/pages/skills/index",
          });
        }
      }, 1500);
    } catch (error) {
      console.error("登录失败:", error);
      hideLoading();
      showToast("登录失败", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="login-page">
      <View className="login-container">
        <Image
          className="logo"
          src="https://via.placeholder.com/200"
          mode="aspectFit"
        />
        <Text className="app-name">Coshub</Text>
        <Text className="app-desc">二次元技能服务与日常分享社区</Text>

        <Button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          微信一键登录
        </Button>

        <Text className="privacy-tip">
          登录即表示您同意《用户协议》和《隐私政策》
        </Text>
      </View>
    </View>
  );
};

export default LoginPage;
