import { View, Form, Input, Button, Image } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import "./index.scss";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    nickname: "",
    avatar: "",
    bio: "",
    city: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await Taro.request({
      url: "/api/users/current",
      method: "GET",
    });
    setProfile(res.data.data);
  };

  const handleSubmit = async () => {
    try {
      await Taro.request({
        url: "/api/users/current",
        method: "PUT",
        data: profile,
      });
      Taro.showToast({ title: "保存成功", icon: "success" });
    } catch (error) {
      Taro.showToast({ title: "保存失败", icon: "none" });
    }
  };

  const chooseAvatar = async () => {
    const res = await Taro.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album"],
    });
    setProfile({ ...profile, avatar: res.tempFilePaths[0] });
  };

  return (
    <View className="profile-page">
      <Form onSubmit={handleSubmit}>
        <View className="avatar-section" onClick={chooseAvatar}>
          <Image
            src={profile.avatar || "/assets/default-avatar.png"}
            className="avatar"
          />
          <View className="change-text">点击更换头像</View>
        </View>

        <View className="form-item">
          <Input
            placeholder="昵称"
            value={profile.nickname}
            onChange={(e) =>
              setProfile({ ...profile, nickname: e.detail.value })
            }
          />
        </View>

        <View className="form-item">
          <Input
            placeholder="城市"
            value={profile.city}
            onChange={(e) => setProfile({ ...profile, city: e.detail.value })}
          />
        </View>

        <View className="form-item">
          <Input
            placeholder="个人简介"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.detail.value })}
          />
        </View>

        <Button formType="submit" type="primary">
          保存资料
        </Button>
      </Form>
    </View>
  );
}
