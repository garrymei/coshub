import { useState, useEffect } from "react";
import {
  View,
  Text,
  Form,
  Input,
  Button,
  Picker,
  Textarea,
  Image,
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getUserProfile, updateUserProfile } from "@/services/user";
import { uploadFile } from "@/services/upload";
import "./profile.scss";

interface UserProfile {
  id: string;
  nickname: string;
  avatar: string;
  bio: string;
  gender: string;
  city: string;
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    avatar: "",
    bio: "",
    gender: "",
    city: "",
  });

  const genderOptions = ["保密", "男", "女"];

  // 获取用户资料
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile();
      setUserProfile(profile);
      setFormData({
        nickname: profile.nickname || "",
        avatar: profile.avatar || "",
        bio: profile.bio || "",
        gender: profile.gender || "保密",
        city: profile.city || "",
      });
    } catch (error) {
      console.error("获取用户资料失败", error);
      Taro.showToast({
        title: "获取用户资料失败",
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  // 上传头像
  const handleUploadAvatar = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
      });

      const tempFilePath = res.tempFilePaths[0];
      Taro.showLoading({ title: "上传中..." });

      const uploadResult = await uploadFile(tempFilePath, "avatar");

      setFormData((prev) => ({
        ...prev,
        avatar: uploadResult.url,
      }));

      Taro.hideLoading();
      Taro.showToast({
        title: "上传成功",
        icon: "success",
      });
    } catch (error) {
      console.error("上传头像失败", error);
      Taro.hideLoading();
      Taro.showToast({
        title: "上传头像失败",
        icon: "none",
      });
    }
  };

  // 处理输入变化
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 处理性别选择
  const handleGenderChange = (e: { detail: { value: number } }) => {
    const genderIndex = e.detail.value;
    setFormData((prev) => ({
      ...prev,
      gender: genderOptions[genderIndex],
    }));
  };

  // 处理城市选择
  const handleCitySelect = async () => {
    try {
      const res = await Taro.chooseCity({
        showLocatedCity: true,
        showHotCities: true,
      });

      if (res.city) {
        setFormData((prev) => ({
          ...prev,
          city: res.city,
        }));
      }
    } catch (error) {
      console.error("选择城市失败", error);
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      // 表单验证
      if (!formData.nickname) {
        Taro.showToast({
          title: "昵称不能为空",
          icon: "none",
        });
        return;
      }

      setSubmitting(true);

      // 提交更新
      await updateUserProfile(formData);

      Taro.showToast({
        title: "保存成功",
        icon: "success",
      });

      // 返回上一页
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (error) {
      console.error("更新用户资料失败", error);
      Taro.showToast({
        title: "保存失败",
        icon: "none",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <View className="profile-page loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View className="profile-page">
      <Form className="profile-form">
        <View className="form-group avatar-group">
          <Text className="form-label">头像</Text>
          <View className="avatar-wrapper" onClick={handleUploadAvatar}>
            {formData.avatar ? (
              <Image className="avatar" src={formData.avatar} />
            ) : (
              <View className="avatar-placeholder">
                <Text>+</Text>
              </View>
            )}
          </View>
        </View>

        <View className="form-group">
          <Text className="form-label">昵称</Text>
          <Input
            className="form-input"
            value={formData.nickname}
            onInput={(e) => handleInputChange("nickname", e.detail.value)}
            placeholder="请输入昵称"
            maxlength={20}
          />
        </View>

        <View className="form-group">
          <Text className="form-label">个人简介</Text>
          <Textarea
            className="form-textarea"
            value={formData.bio}
            onInput={(e) => handleInputChange("bio", e.detail.value)}
            placeholder="介绍一下自己吧"
            maxlength={100}
          />
          <Text className="char-count">{formData.bio.length}/100</Text>
        </View>

        <View className="form-group">
          <Text className="form-label">性别</Text>
          <Picker
            mode="selector"
            range={genderOptions}
            onChange={handleGenderChange}
            value={genderOptions.indexOf(formData.gender)}
          >
            <View className="picker-value">
              {formData.gender || "请选择性别"}
              <Text className="picker-arrow">{">"}</Text>
            </View>
          </Picker>
        </View>

        <View className="form-group">
          <Text className="form-label">所在城市</Text>
          <View className="city-picker" onClick={handleCitySelect}>
            <Text>{formData.city || "请选择城市"}</Text>
            <Text className="picker-arrow">{">"}</Text>
          </View>
        </View>

        <Button
          className="submit-btn"
          onClick={handleSubmit}
          loading={submitting}
          disabled={submitting}
        >
          保存
        </Button>
      </Form>
    </View>
  );
}
