import { View, Text, Input, Textarea, Image, Button } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import React, { useState } from "react";
import { User } from "../../types";
import { userApi } from "../../services/api";
import {
  showToast,
  showLoading,
  hideLoading,
  uploadImage,
  checkLogin,
  goToLogin,
} from "../../utils/common";
import "./profile.scss";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useLoad(() => {
    if (!checkLogin()) {
      goToLogin();
      return;
    }

    fetchUserInfo();
  });

  const fetchUserInfo = () => {
    try {
      const currentUser = Taro.getStorageSync("userInfo");
      if (!currentUser) {
        throw new Error("用户未登录");
      }

      setUser(currentUser);
      setNickname(currentUser.nickname || "");
      setBio(currentUser.bio || "");
      setAvatar(currentUser.avatar || "");
      setLocation(currentUser.location || "");
    } catch (error) {
      console.error("获取用户信息失败:", error);
      showToast("获取用户信息失败", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAvatar = async () => {
    try {
      const newAvatar = await uploadImage();
      setAvatar(newAvatar);
    } catch (error) {
      console.error("上传头像失败:", error);
      showToast("上传头像失败", "error");
    }
  };

  const handleSave = async () => {
    if (!nickname.trim()) {
      showToast("昵称不能为空");
      return;
    }

    try {
      showLoading("保存中...");

      const updatedUser = await userApi.updateUserInfo({
        nickname,
        bio,
        avatar,
        location,
      });

      // 更新本地存储的用户信息
      Taro.setStorageSync("userInfo", updatedUser);

      hideLoading();
      showToast("保存成功", "success");

      // 返回个人中心页
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (error) {
      console.error("保存用户信息失败:", error);
      hideLoading();
      showToast("保存失败", "error");
    }
  };

  if (loading) {
    return (
      <View className="loading-container">
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View className="profile-page">
      <View className="form-section">
        <Text className="section-title">头像</Text>
        <View className="avatar-container" onClick={handleUploadAvatar}>
          <Image
            className="avatar-image"
            src={avatar || "https://via.placeholder.com/100"}
            mode="aspectFill"
          />
          <Text className="avatar-tip">点击更换头像</Text>
        </View>
      </View>

      <View className="form-section">
        <Text className="section-title">昵称</Text>
        <Input
          className="input-field"
          placeholder="请输入昵称"
          maxlength={20}
          value={nickname}
          onInput={(e) => setNickname(e.detail.value)}
        />
      </View>

      <View className="form-section">
        <Text className="section-title">个人简介</Text>
        <Textarea
          className="textarea-field"
          placeholder="介绍一下自己吧"
          maxlength={100}
          value={bio}
          onInput={(e) => setBio(e.detail.value)}
        />
      </View>

      <View className="form-section">
        <Text className="section-title">所在地</Text>
        <Input
          className="input-field"
          placeholder="请输入所在地"
          value={location}
          onInput={(e) => setLocation(e.detail.value)}
        />
      </View>

      <Button className="save-button" onClick={handleSave}>
        保存
      </Button>
    </View>
  );
};

export default ProfilePage;
