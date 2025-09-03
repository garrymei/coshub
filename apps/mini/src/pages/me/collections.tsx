import { useState, useEffect } from "react";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getUserCollections } from "@/services/user";
import PostCard from "@/components/PostCard";
import "./collections.scss";

interface Collection {
  id: string;
  post: {
    id: string;
    title: string;
    content: string;
    images: string[];
    likes: number;
    comments: number;
    createdAt: string;
  };
  collectedAt: string;
}

export default function MyCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 获取用户收藏内容
  const fetchUserCollections = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await getUserCollections(currentPage);

      if (currentPage === 1) {
        setCollections(res.list);
      } else {
        setCollections((prev) => [...prev, ...res.list]);
      }

      setHasMore(res.hasMore);
    } catch (error) {
      console.error("获取用户收藏内容失败", error);
      Taro.showToast({
        title: "获取收藏内容失败",
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  // 下拉刷新
  const onRefresh = async () => {
    setPage(1);
    await fetchUserCollections(1);
  };

  // 上拉加载更多
  const onReachBottom = async () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    setPage(nextPage);
    await fetchUserCollections(nextPage);
  };

  // 跳转到详情页
  const goToDetail = (postId: string) => {
    Taro.navigateTo({
      url: `/pages/post/detail?id=${postId}`,
    });
  };

  useEffect(() => {
    fetchUserCollections(1);
  }, []);

  if (loading && collections.length === 0) {
    return (
      <View className="collections-page loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (collections.length === 0 && !loading) {
    return (
      <View className="collections-page empty">
        <Image className="empty-icon" src="/assets/images/empty.png" />
        <Text className="empty-text">暂无收藏内容</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="collections-page"
      scrollY
      refresherEnabled
      refresherTriggered={loading && page === 1}
      onRefresherRefresh={() => onRefresh()}
      onScrollToLower={() => onReachBottom()}
    >
      <View className="collection-list">
        {collections.map((collection) => (
          <PostCard
            key={collection.id}
            post={collection.post}
            onClick={() => goToDetail(collection.post.id)}
          />
        ))}
      </View>

      {loading && page > 1 && (
        <View className="loading-more">
          <Text>加载中...</Text>
        </View>
      )}

      {!hasMore && (
        <View className="no-more">
          <Text>没有更多内容了</Text>
        </View>
      )}
    </ScrollView>
  );
}
