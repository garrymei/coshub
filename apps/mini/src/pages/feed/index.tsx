import { View, ScrollView } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import React, { useState, useEffect } from "react";
import { Post } from "../../types";
import { feedApi } from "../../services/api";
import { showToast, showLoading, hideLoading } from "../../utils/common";
import FeedCard from "../../components/FeedCard";
import Banner from "../../components/Banner";
import "./index.scss";

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [column1, setColumn1] = useState<Post[]>([]);
  const [column2, setColumn2] = useState<Post[]>([]);

  useLoad(() => {
    fetchPosts();
  });

  const fetchPosts = async () => {
    try {
      if (!refreshing) {
        showLoading();
      }

      const data = await feedApi.getPosts();
      setPosts(data);

      // 将帖子分成两列（瀑布流布局）
      const col1: Post[] = [];
      const col2: Post[] = [];

      data.forEach((post, index) => {
        if (index % 2 === 0) {
          col1.push(post);
        } else {
          col2.push(post);
        }
      });

      setColumn1(col1);
      setColumn2(col2);
    } catch (error) {
      console.error("获取分享列表失败:", error);
      showToast("获取分享列表失败", "error");
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

  const handleAddPost = () => {
    Taro.navigateTo({
      url: "/pages/feed/create",
    });
  };

  return (
    <View className="feed-page">
      <Banner type="share" />

      <ScrollView
        className="feed-container"
        scrollY
        enableBackToTop
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {posts.length > 0 ? (
          <View className="waterfall-container">
            <View className="waterfall-column">
              {column1.map((post) => (
                <FeedCard key={post.id} post={post} />
              ))}
            </View>
            <View className="waterfall-column">
              {column2.map((post) => (
                <FeedCard key={post.id} post={post} />
              ))}
            </View>
          </View>
        ) : (
          <View className="empty-state">
            {loading ? "加载中..." : "暂无分享，快来发布吧！"}
          </View>
        )}
      </ScrollView>

      <View className="add-button" onClick={handleAddPost}>
        <View className="add-icon">+</View>
      </View>
    </View>
  );
};

export default FeedPage;
