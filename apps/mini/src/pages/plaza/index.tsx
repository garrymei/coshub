import { useState, useEffect } from "react";
import { View, ScrollView, Input } from "@tarojs/components";
import Banner from "@/components/Banner";
import FeedCard from "@/components/FeedCard";
import Masonry from "@/components/Masonry";
import { api, mockData, Post, Banner as BannerType } from "@/services/api";
import "./index.scss";

export default function PlazaPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [viewMode, setViewMode] = useState<"masonry" | "list">("masonry");

  // 获取广场数据
  const fetchPlazaData = async (refresh = false) => {
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
          api.posts.getList({
            type: "plaza",
            cursor: refresh ? null : cursor,
            search: searchValue || undefined,
          }),
          api.banners.getList("plaza"),
        ]);

        setPosts((prev) =>
          refresh ? postsRes.data : [...prev, ...postsRes.data],
        );
        setBanners(bannersRes);
        setCursor(postsRes.nextCursor || null);
        setHasMore(postsRes.hasMore);
      }
    } catch (error) {
      console.error("获取广场数据失败:", error);
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
    fetchPlazaData(true);
  }, []);

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchValue(value);
    fetchPlazaData(true);
  };

  // 视图切换
  const toggleViewMode = () => {
    setViewMode(viewMode === "masonry" ? "list" : "masonry");
  };

  // 下拉刷新
  const onRefresh = async () => {
    await fetchPlazaData(true);
  };

  // 上拉加载更多
  const onScrollToLower = async () => {
    if (hasMore && !loading) {
      await fetchPlazaData();
    }
  };

  return (
    <View className="plaza-page h-screen bg-secondary-50 flex flex-col">
      {/* 搜索栏 */}
      <View className="sticky top-0 z-10 bg-white/90 backdrop-blur-soft px-4 py-3 border-b border-gray-100">
        <View className="flex items-center gap-3">
          <View className="flex-1 relative">
            <Input
              className="search-input"
              placeholder="搜索coser、番剧、技能"
              value={searchValue}
              onInput={(e) => handleSearch(e.detail.value)}
            />
            <View className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </View>
          </View>
          <View className="flex items-center gap-2">
            <View
              className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full cursor-pointer"
              onClick={toggleViewMode}
            >
              {viewMode === "masonry" ? "📋" : "🔲"}
            </View>
            <View
              className="w-9 h-9 flex items-center justify-center text-white rounded-full cursor-pointer"
              style={{ backgroundColor: "#D946EF" }}
            >
              ➕
            </View>
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
        <Banner banners={banners} height={200} />

        {/* 内容区域 */}
        {viewMode === "masonry" ? (
          <Masonry columns={2} gap={3}>
            {posts.map((post) => (
              <FeedCard key={post.id} post={post} layout="masonry" />
            ))}
          </Masonry>
        ) : (
          <View className="space-y-4">
            {posts.map((post) => (
              <FeedCard key={post.id} post={post} layout="list" />
            ))}
          </View>
        )}

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
