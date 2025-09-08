import { useState, useEffect } from "react";
import { View, ScrollView } from "@tarojs/components";
import PostCard from "@/components/PostCard";
import Banner from "@/components/Banner";
import { getPosts } from "@/services/post";
import { api, mockData, Banner as BannerType } from "@/services/api";
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
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  // 获取帖子数据
  const fetchPosts = async (refresh = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await getPosts({
        type: "share",
        cursor: refresh ? null : cursor,
      });
      const list = res?.data || [];
      const nextCursor = res?.nextCursor ?? null;
      const more = res?.hasMore ?? list.length > 0;

      setPosts((prev) => (refresh ? list : [...prev, ...list]));
      setCursor(nextCursor);
      setHasMore(more);

      // Fetch banners (mock or real API)
      if (process.env.TARO_APP_USE_MOCK === "true") {
        setBanners((mockData as any).banners || []);
      } else {
        try {
          const bannerRes = await api.banners.getList("home");
          setBanners(bannerRes || []);
        } catch (e) {
          setBanners([]);
        }
      }
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
      <Banner banners={banners} />

      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}

      {loading && <View className="loading">加载中...</View>}
      {!hasMore && <View className="no-more">没有更多内容了</View>}
    </ScrollView>
  );
}
