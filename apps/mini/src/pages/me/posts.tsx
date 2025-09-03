import { View, Text, ScrollView, Picker } from "@tarojs/components";
import Taro, { useRouter, useLoad } from "@tarojs/taro";
import React, { useState, useEffect } from "react";
import { Post, SkillPost } from "../../types";
import { userApi } from "../../services/api";
import {
  showToast,
  showLoading,
  hideLoading,
  checkLogin,
  goToLogin,
} from "../../utils/common";
import FeedCard from "../../components/FeedCard";
import SkillCard from "../../components/SkillCard";
import "./posts.scss";

const PostsPage: React.FC = () => {
  const router = useRouter();
  const { userId } = router.params;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [postType, setPostType] = useState<"all" | "skill" | "share">("all");
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const typeOptions = [
    { label: "全部", value: "all" },
    { label: "技能", value: "skill" },
    { label: "分享", value: "share" },
  ];

  useLoad(() => {
    if (!checkLogin() && !userId) {
      goToLogin();
      return;
    }

    // 判断是否是查看自己的发布
    const currentUser = Taro.getStorageSync("userInfo");
    if (currentUser && (!userId || userId === currentUser.id)) {
      setIsCurrentUser(true);
    }

    fetchPosts();
  });

  const fetchPosts = async () => {
    try {
      if (!refreshing) {
        showLoading();
      }

      let targetUserId = userId;

      if (!targetUserId) {
        const currentUser = Taro.getStorageSync("userInfo");
        if (!currentUser) {
          throw new Error("用户未登录");
        }
        targetUserId = currentUser.id;
      }

      const type = postType === "all" ? undefined : postType;
      const data = await userApi.getUserPosts(targetUserId, type);
      setPosts(data);
    } catch (error) {
      console.error("获取发布列表失败:", error);
      showToast("获取发布列表失败", "error");
    } finally {
      hideLoading();
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleTypeChange = (e) => {
    const value = typeOptions[e.detail.value].value as
      | "all"
      | "skill"
      | "share";
    setPostType(value);
    fetchPosts();
  };

  return (
    <View className="posts-page">
      <View className="filter-bar">
        <Picker
          mode="selector"
          range={typeOptions}
          rangeKey="label"
          onChange={handleTypeChange}
        >
          <View className="picker">
            <Text className="picker-text">
              {typeOptions.find((item) => item.value === postType)?.label}
            </Text>
            <Text className="picker-arrow">▼</Text>
          </View>
        </Picker>
      </View>

      <ScrollView
        className="posts-container"
        scrollY
        enableBackToTop
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {posts.length > 0 ? (
          posts.map((post) =>
            post.type === "skill" ? (
              <SkillCard key={post.id} skill={post as SkillPost} />
            ) : (
              <FeedCard key={post.id} post={post} />
            ),
          )
        ) : (
          <View className="empty-state">
            {loading
              ? "加载中..."
              : isCurrentUser
                ? "你还没有发布内容"
                : "该用户暂无发布内容"}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PostsPage;
