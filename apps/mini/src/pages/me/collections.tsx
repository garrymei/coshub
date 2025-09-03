import { View, Text, ScrollView } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import React, { useState, useEffect } from "react";
import { Post } from "../../types";
import { userApi } from "../../services/api";
import {
  showToast,
  showLoading,
  hideLoading,
  checkLogin,
  goToLogin,
} from "../../utils/common";
import FeedCard from "../../components/FeedCard";
import "./collections.scss";

const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useLoad(() => {
    if (!checkLogin()) {
      goToLogin();
      return;
    }

    fetchCollections();
  });

  const fetchCollections = async () => {
    try {
      if (!refreshing) {
        showLoading();
      }

      const currentUser = Taro.getStorageSync("userInfo");
      if (!currentUser) {
        throw new Error("用户未登录");
      }

      const data = await userApi.getUserCollections(currentUser.id);
      setCollections(data);
    } catch (error) {
      console.error("获取收藏列表失败:", error);
      showToast("获取收藏列表失败", "error");
    } finally {
      hideLoading();
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCollections();
  };

  return (
    <View className="collections-page">
      <ScrollView
        className="collections-container"
        scrollY
        enableBackToTop
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {collections.length > 0 ? (
          collections.map((post) => <FeedCard key={post.id} post={post} />)
        ) : (
          <View className="empty-state">
            {loading ? "加载中..." : "暂无收藏内容"}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CollectionsPage;
