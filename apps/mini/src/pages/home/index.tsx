import { useState, useEffect } from "react";
import { View, ScrollView, Text } from "@tarojs/components";
import Banner from "@/components/Banner";
import FeedCard from "@/components/FeedCard";
import Masonry from "@/components/Masonry";
import { api, mockData, Post, Banner as BannerType } from "@/services/api";
import "./index.scss";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  // 获取首页数据
  const fetchHomeData = async (refresh = false) => {
    if (loading) return;

    setLoading(true);
    try {
      // 通过环境变量控制是否使用模拟数据
      if (process.env.TARO_APP_USE_MOCK === "true") {
        setPosts(mockData.posts);
        setBanners(mockData.banners);
        setHasMore(false);
      } else {
        // 生产环境调用真实API
        const [postsRes, bannersRes] = await Promise.all([
          api.posts.getList({ type: "home", cursor: refresh ? null : cursor }),
          api.banners.getList("home"),
        ]);

        setPosts((prev) =>
          refresh ? postsRes.data : [...prev, ...postsRes.data],
        );
        setBanners(bannersRes);
        setCursor(postsRes.nextCursor || null);
        setHasMore(postsRes.hasMore);
      }
    } catch (error) {
      console.error("获取首页数据失败:", error);
      // 降级到模拟数据
      setPosts(mockData.posts);
      setBanners(mockData.banners);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchHomeData(true);
  }, []);

  // 下拉刷新
  const onRefresh = async () => {
    await fetchHomeData(true);
  };

  // 上拉加载更多
  const onScrollToLower = async () => {
    if (hasMore && !loading) {
      await fetchHomeData();
    }
  };

  // 处理点赞
  const handleLike = async (postId: string) => {
    try {
      // 乐观更新
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likeCount: post.isLiked
                  ? post.likeCount - 1
                  : post.likeCount + 1,
              }
            : post,
        ),
      );

      // 调用API
      await api.posts.like(postId);
    } catch (error) {
      console.error("点赞失败:", error);
      // 回滚状态
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likeCount: post.isLiked
                  ? post.likeCount - 1
                  : post.likeCount + 1,
              }
            : post,
        ),
      );
    }
  };

  // 处理收藏
  const handleCollect = async (postId: string) => {
    try {
      // 乐观更新
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isCollected: !post.isCollected,
                collectCount: post.isCollected
                  ? post.collectCount - 1
                  : post.collectCount + 1,
              }
            : post,
        ),
      );

      // 调用API
      await api.posts.collect(postId);
    } catch (error) {
      console.error("收藏失败:", error);
      // 回滚状态
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isCollected: !post.isCollected,
                collectCount: post.isCollected
                  ? post.collectCount - 1
                  : post.collectCount + 1,
              }
            : post,
        ),
      );
    }
  };

  return (
    <View className="home-page h-screen bg-secondary-50 flex flex-col">
      {/* 头部 */}
      <View className="sticky top-0 z-10 bg-white/90 backdrop-blur-soft px-4 py-3 border-b border-gray-100">
        <View className="flex items-center justify-between">
          <Text className="text-xl font-bold text-primary-600">Coshub</Text>
          <View className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <Text className="text-sm">👤</Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        scrollY
        refresherEnabled
        onRefresherRefresh={onRefresh}
        onScrollToLower={onScrollToLower}
      >
        {/* 轮播图 */}
        <Banner
          banners={banners}
          height={200}
          onBannerClick={(banner) => {
            console.log("Banner clicked:", banner);
          }}
        />

        {/* 瀑布流内容 */}
        <Masonry columns={2} gap={3}>
          {posts.map((post) => (
            <FeedCard
              key={post.id}
              post={post}
              layout="masonry"
              onLike={handleLike}
              onCollect={handleCollect}
            />
          ))}
        </Masonry>

        {/* 加载状态 */}
        {loading && (
          <View className="text-center py-4 text-gray-500">加载中...</View>
        )}

        {!hasMore && posts.length > 0 && (
          <View className="text-center py-4 text-gray-500">没有更多内容了</View>
        )}
      </ScrollView>
    </View>
  );
}
