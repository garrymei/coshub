import { useState, useEffect } from "react";
import { View, Text, Image, Button } from "@tarojs/components";
import { getUserProfile } from "@/services/user";
import "./index.scss";

interface UserProfile {
  id: string;
  nickname: string;
  avatar: string;
  bio: string;
  gender: string;
  city: string;
}

export default function MePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取用户资料
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error("获取用户资料失败", error);
    } finally {
      setLoading(false);
    }
  };

  // 检查登录状态
  const checkLoginStatus = () => {
    try {
      const token = wx.getStorageSync("token");
      const userInfo = wx.getStorageSync("userInfo");

      if (!token || !userInfo) {
        // 未登录，跳转到登录页
        wx.navigateTo({
          url: "/pages/login/index",
        });
      } else {
        // 已登录，获取用户资料
        fetchUserProfile();
      }
    } catch (error) {
      console.error("检查登录状态失败", error);
    }
  };

  // 跳转到资料编辑页
  const goToProfile = () => {
    wx.navigateTo({
      url: "/pages/me/profile",
    });
  };

  // 跳转到我的发布页
  const goToPosts = () => {
    wx.navigateTo({
      url: "/pages/me/posts",
    });
  };

  // 跳转到我的收藏页
  const goToCollections = () => {
    wx.navigateTo({
      url: "/pages/me/collections",
    });
  };

  // 退出登录
  const logout = () => {
    wx.showModal({
      title: "提示",
      content: "确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync("token");
          wx.removeStorageSync("userInfo");
          wx.reLaunch({
            url: "/pages/login/index",
          });
        }
      },
    });
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <View className="me-page loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View className="me-page error">
        <Text>获取用户信息失败</Text>
        <Button onClick={checkLoginStatus}>重试</Button>
      </View>
    );
  }

  return (
    <View className="me-page">
      <View className="user-header">
        <Image className="avatar" src={userProfile.avatar} />
        <View className="user-info">
          <Text className="nickname">{userProfile.nickname}</Text>
          <Text className="bio">
            {userProfile.bio || "这个人很懒，什么都没留下~"}
          </Text>
        </View>
        <Button className="edit-btn" onClick={goToProfile}>
          编辑资料
        </Button>
      </View>

      <View className="menu-list">
        <View className="menu-item" onClick={goToPosts}>
          <Text className="menu-icon">📝</Text>
          <Text className="menu-text">我的发布</Text>
          <Text className="menu-arrow">{">"}</Text>
        </View>

        <View className="menu-item" onClick={goToCollections}>
          <Text className="menu-icon">⭐</Text>
          <Text className="menu-text">我的收藏</Text>
          <Text className="menu-arrow">{">"}</Text>
        </View>

        <View className="menu-item">
          <Text className="menu-icon">🔔</Text>
          <Text className="menu-text">消息通知</Text>
          <Text className="menu-arrow">{">"}</Text>
        </View>

        <View className="menu-item">
          <Text className="menu-icon">⚙️</Text>
          <Text className="menu-text">设置</Text>
          <Text className="menu-arrow">{">"}</Text>
        </View>
      </View>

      <Button className="logout-btn" onClick={logout}>
        退出登录
      </Button>
    </View>
  );
}
