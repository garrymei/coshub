import { View, ScrollView, Image, Text } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { api, mockData, Post } from "@/services/api";
import { showToast } from "@/utils/common";
import Banner from "@/components/Banner";
import "./index.scss";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // 获取首页数据
  const fetchPosts = async (refresh = false) => {
    if (loading) return;

    setLoading(true);
    try {
      if (process.env.TARO_APP_USE_MOCK === "true") {
        setPosts(mockData.posts);
        setHasMore(false);
      } else {
        const res = await api.posts.getList({
          type: "home",
          cursor: refresh ? null : cursor,
          limit: 10,
          sortBy: "latest",
        });

        setPosts((prev) => (refresh ? res.data : [...prev, ...res.data]));
        setCursor(res.nextCursor || null);
        setHasMore(res.hasMore);
      }
    } catch (error) {
      console.error("获取首页数据失败:", error);
      showToast("加载失败", "error");
      // 降级到模拟数据
      setPosts(mockData.posts);
      setHasMore(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 下拉刷新
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts(true);
  };

  // 上拉加载更多
  const onScrollToLower = async () => {
    if (hasMore && !loading) {
      await fetchPosts();
    }
  };

  // 跳转到详情页
  const goToDetail = (postId: string) => {
    Taro.navigateTo({ url: `/pages/feed/detail?id=${postId}` });
  };

  // 跳转到发布页
  const goToCreate = () => {
    Taro.navigateTo({ url: "/pages/feed/create" });
  };

  // 初始化加载
  useEffect(() => {
    fetchPosts(true);
  }, []);

  return (
    <View className="home-page h-screen bg-gray-50 flex flex-col">
      {/* Banner区域 */}
      <Banner scene="feed" />

      <ScrollView
        className="flex-1"
        scrollY
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={onRefresh}
        onScrollToLower={onScrollToLower}
      >
        {/* 内容区域 */}
        <View className="px-4 py-4 space-y-4">
          {posts.map((post) => (
            <View
              key={post.id}
              className="bg-white rounded-xl shadow-soft overflow-hidden"
              onClick={() => goToDetail(post.id)}
            >
              {/* 用户信息 */}
              <View className="flex items-center p-4 pb-2">
                <Image
                  className="w-10 h-10 rounded-full mr-3"
                  src={post.author?.avatar || "https://via.placeholder.com/40"}
                />
                <View className="flex-1">
                  <View className="text-sm font-semibold text-gray-800">
                    {post.author?.nickname || "匿名用户"}
                  </View>
                  <View className="text-xs text-gray-500">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : "刚刚"}
                  </View>
                </View>
                <View className="text-xs text-gray-400">
                  {post.type === "share" ? "分享" : "技能"}
                </View>
              </View>

              {/* 内容 */}
              <View className="px-4 pb-2">
                <View className="text-base text-gray-800 mb-3 line-clamp-3">
                  {post.content}
                </View>
              </View>

              {/* 图片 */}
              {post.images && post.images.length > 0 && (
                <View className="px-4 pb-3">
                  {post.images.length === 1 ? (
                    <Image
                      className="w-full h-64 rounded-lg object-cover"
                      src={post.images[0]}
                      mode="aspectFill"
                    />
                  ) : (
                    <View className="grid grid-cols-2 gap-2">
                      {post.images.slice(0, 4).map((image, index) => (
                        <Image
                          key={index}
                          className="w-full h-32 rounded-lg object-cover"
                          src={image}
                          mode="aspectFill"
                        />
                      ))}
                    </View>
                  )}
                  {post.images.length > 4 && (
                    <View className="text-center text-sm text-gray-500 mt-2">
                      还有 {post.images.length - 4} 张图片
                    </View>
                  )}
                </View>
              )}

              {/* 标签 */}
              {post.tags && post.tags.length > 0 && (
                <View className="px-4 pb-3">
                  <View className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <View
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        #{tag}
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* 互动区域 */}
              <View className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <View className="flex items-center gap-6">
                  <View className="flex items-center gap-1">
                    <View className="text-lg">❤️</View>
                    <View className="text-sm text-gray-600">
                      {post.likeCount || 0}
                    </View>
                  </View>
                  <View className="flex items-center gap-1">
                    <View className="text-lg">💬</View>
                    <View className="text-sm text-gray-600">
                      {post.commentCount || 0}
                    </View>
                  </View>
                  <View className="flex items-center gap-1">
                    <View className="text-lg">⭐</View>
                    <View className="text-sm text-gray-600">
                      {post.collectCount || 0}
                    </View>
                  </View>
                </View>
                <View className="text-sm text-gray-400">
                  {post.city || "未知位置"}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 加载状态 */}
        {loading && (
          <View className="text-center py-4 text-gray-500">加载中...</View>
        )}

        {!hasMore && posts.length > 0 && (
          <View className="text-center py-4 text-gray-500">没有更多内容了</View>
        )}

        {posts.length === 0 && !loading && (
          <View className="text-center py-20">
            <View className="text-6xl mb-4">📝</View>
            <View className="text-gray-500 mb-4">暂无内容</View>
            <View
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-full text-sm"
              onClick={goToCreate}
            >
              发布第一条内容
            </View>
          </View>
        )}
      </ScrollView>

      {/* 悬浮发布按钮 */}
      <View
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center shadow-lg z-50"
        onClick={goToCreate}
      >
        <Text className="text-white text-2xl">+</Text>
      </View>
    </View>
  );
}
