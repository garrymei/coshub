import { useState, useEffect } from "react";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getUserPosts } from "@/services/user";
import PostCard from "@/components/PostCard";
import "./posts.scss";

interface Post {
  id: string;
  title: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onClick: (postId: string) => void;
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 获取用户发布的内容
  const fetchUserPosts = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await getUserPosts(currentPage);

      if (currentPage === 1) {
        setPosts(res.list);
      } else {
        setPosts((prev) => [...prev, ...res.list]);
      }

      setHasMore(res.hasMore);
    } catch (error) {
      console.error("获取用户发布内容失败", error);
      Taro.showToast({
        title: "获取内容失败",
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  // 下拉刷新
  const onRefresh = async () => {
    setPage(1);
    await fetchUserPosts(1);
  };

  // 上拉加载更多
  const onReachBottom = async () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    setPage(nextPage);
    await fetchUserPosts(nextPage);
  };

  // 跳转到详情页
  const goToDetail = (postId: string) => {
    Taro.navigateTo({
      url: `/pages/post/detail?id=${postId}`,
    });
  };

  useEffect(() => {
    fetchUserPosts(1);
  }, []);

  if (loading && posts.length === 0) {
    return (
      <View className="posts-page loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (posts.length === 0 && !loading) {
    return (
      <View className="posts-page empty">
        <Image className="empty-icon" src="/assets/images/empty.png" />
        <Text className="empty-text">暂无发布内容</Text>
        <Button
          className="create-btn"
          onClick={() => Taro.navigateTo({ url: "/pages/post/new" })}
        >
          去发布
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      className="posts-page"
      scrollY
      refresherEnabled
      refresherTriggered={loading && page === 1}
      onRefresherRefresh={() => onRefresh()}
      onScrollToLower={() => onReachBottom()}
    >
      <View className="post-list">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => goToDetail(post.id)}
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
