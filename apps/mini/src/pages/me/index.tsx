import { View, Image, Text, Button } from "@tarojs/components";
import Taro, { useRouter, useLoad } from "@tarojs/taro";
import React, { useState, useEffect } from "react";
import { User, Post } from "../../types";
import { userApi } from "../../services/api";
import {
  showToast,
  showLoading,
  hideLoading,
  checkLogin,
  goToLogin,
} from "../../utils/common";
import "./index.scss";

const MePage: React.FC = () => {
  const router = useRouter();
  const { userId } = router.params;

  const [user, setUser] = useState<User | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useLoad(() => {
    if (!checkLogin() && !userId) {
      goToLogin();
      return;
    }

    fetchUserInfo();
  });

  const fetchUserInfo = async () => {
    try {
      showLoading();

      let userData: User;

      if (userId) {
        // 查看其他用户的个人中心
        userData = await userApi.getUserInfo(userId);
        setIsCurrentUser(false);
      } else {
        // 查看自己的个人中心
        const currentUser = Taro.getStorageSync("userInfo");
        if (currentUser) {
          userData = currentUser;
        } else {
          // 如果本地没有用户信息，则获取当前用户信息
          userData = await userApi.getUserInfo("me");
          Taro.setStorageSync("userInfo", userData);
        }
        setIsCurrentUser(true);
      }

      setUser(userData);
    } catch (error) {
      console.error("获取用户信息失败:", error);
      showToast("获取用户信息失败", "error");
    } finally {
      hideLoading();
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    Taro.navigateTo({
      url: "/pages/me/profile",
    });
  };

  const handleViewPosts = () => {
    Taro.navigateTo({
      url: `/pages/me/posts?userId=${user?.id || ""}`,
    });
  };

  const handleViewCollections = () => {
    Taro.navigateTo({
      url: "/pages/me/collections",
    });
  };

  const handleSettings = () => {
    Taro.navigateTo({
      url: "/pages/me/settings",
    });
  };

  if (loading) {
    return (
      <View className="loading-container">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="error-container">
        <Text>用户不存在或已被删除</Text>
      </View>
    );
  }

  return (
    <View className="me-page">
      <View className="user-header">
        <Image
          className="user-background"
          src="https://via.placeholder.com/750x300"
          mode="aspectFill"
        />
        <View className="user-info">
          <Image
            className="user-avatar"
            src={user.avatar || "https://via.placeholder.com/100"}
            mode="aspectFill"
          />
          <Text className="user-name">{user.nickname}</Text>
          <Text className="user-bio">
            {user.bio || "这个人很懒，什么都没留下"}
          </Text>

          <View className="user-stats">
            <View className="stat-item">
              <Text className="stat-count">{user.followingCount}</Text>
              <Text className="stat-label">关注</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-count">{user.followersCount}</Text>
              <Text className="stat-label">粉丝</Text>
            </View>
          </View>

          {isCurrentUser ? (
            <Button className="edit-button" onClick={handleEditProfile}>
              编辑资料
            </Button>
          ) : (
            <Button className="follow-button">关注</Button>
          )}
        </View>
      </View>

      <View className="menu-list">
        <View className="menu-item" onClick={handleViewPosts}>
          <Text className="menu-icon">📝</Text>
          <Text className="menu-text">我的发布</Text>
          <Text className="menu-arrow">›</Text>
        </View>

        {isCurrentUser && (
          <View className="menu-item" onClick={handleViewCollections}>
            <Text className="menu-icon">⭐</Text>
            <Text className="menu-text">我的收藏</Text>
            <Text className="menu-arrow">›</Text>
          </View>
        )}

        {isCurrentUser && (
          <View className="menu-item" onClick={handleSettings}>
            <Text className="menu-icon">⚙️</Text>
            <Text className="menu-text">设置</Text>
            <Text className="menu-arrow">›</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MePage;
