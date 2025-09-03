import { useState, useEffect } from "react";
import { View, ScrollView } from "@tarojs/components";
import PostCard from "@/components/PostCard";
import Banner from "@/components/Banner";
import { feedApi } from "@/services/api";
import "./index.scss";

interface Post {
  id: string;
  avatar: string;
  nickname: string;
  time: string;
  content: string;
  images?: string[];
  likeCount: number;
  commentCount: number;
  collectCount: number;
  isLiked: boolean;
  isCollected: boolean;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  // 获取帖子数据
  const fetchPosts = async (refresh = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const res: any = await feedApi.getPosts({
        type: "SHARE",
        cursor: refresh ? null : cursor,
      });
      const list = res?.data?.data || [];
      const nextCursor = res?.data?.cursor ?? null;
      const more = res?.data?.meta?.hasNext ?? list.length > 0;

      setPosts((prev) => (refresh ? list : [...prev, ...list]));
      setCursor(nextCursor);
      setHasMore(more);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchPosts(true);
  }, []);

  // 下拉刷新
  const onRefresh = async () => {
    await fetchPosts(true);
  };

  // 上拉加载更多
  const onScrollToLower = async () => {
    if (hasMore && !loading) {
      await fetchPosts();
    }
  };

  return (
    <ScrollView
      className="feed-page"
      scrollY
      refresherEnabled
      onRefresherRefresh={onRefresh}
      onScrollToLower={onScrollToLower}
    >
      <Banner scene="feed" />

      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}

      {loading && <View className="loading">加载中...</View>}
      {!hasMore && <View className="no-more">没有更多内容了</View>}
    </ScrollView>
  );
}
