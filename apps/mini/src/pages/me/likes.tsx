import { useState, useEffect } from "react";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getUserLikes } from "@/services/user";
import PostCard from "@/components/PostCard";
import "./likes.scss";

interface Like {
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
  likedAt: string;
}

export default function MyLikesPage() {
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 获取用户点赞内容
  const fetchUserLikes = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await getUserLikes(currentPage);

      if (currentPage === 1) {
        setLikes(res.list);
      } else {
        setLikes((prev) => [...prev, ...res.list]);
      }

      setHasMore(res.hasMore);
    } catch (error) {
      console.error("获取用户点赞内容失败", error);
      Taro.showToast({
        title: "获取点赞内容失败",
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  // 下拉刷新
  const onRefresh = async () => {
    setPage(1);
    await fetchUserLikes(1);
  };

  // 上拉加载更多
  const onReachBottom = async () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    setPage(nextPage);
    await fetchUserLikes(nextPage);
  };

  // 跳转到详情页
  const goToDetail = (postId: string) => {
    Taro.navigateTo({
      url: `/pages/post/detail?id=${postId}`,
    });
  };

  useEffect(() => {
    fetchUserLikes(1);
  }, []);

  if (loading && likes.length === 0) {
    return (
      <View className="likes-page loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (likes.length === 0 && !loading) {
    return (
      <View className="likes-page empty">
        <Image className="empty-icon" src="/assets/images/empty.png" />
        <Text className="empty-text">暂无点赞内容</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="likes-page"
      scrollY
      refresherEnabled
      refresherTriggered={loading && page === 1}
      onRefresherRefresh={() => onRefresh()}
      onScrollToLower={() => onReachBottom()}
    >
      <View className="like-list">
        {likes.map((like) => (
          <PostCard
            key={like.id}
            post={like.post}
            onClick={() => goToDetail(like.post.id)}
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
