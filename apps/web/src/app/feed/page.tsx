"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Banner from "@/components/Banner";
import PostCard from "@/components/PostCard";
import MasonryGrid from "@/components/MasonryGrid";
import PostFilter, { PostFilters } from "@/components/PostFilter";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/post";
import { api, type WebPost } from "@/lib/api";

export default function FeedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"work" | "skill">("work");
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [filters, setFilters] = useState<PostFilters>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/feed");
    }
  }, [user, loading, router]);

  // 从 API 获取帖子数据
  useEffect(() => {
    if (activeTab !== "work") {
      router.push("/skills");
      return;
    }
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await api.posts.list({ type: "share", page: 1 });
        const items = (res.items as any as WebPost[]).map(
          (p): Post => ({
            id: p.id,
            title: p.title || "",
            content: p.content || "",
            type: "SHARE",
            category: "COSPLAY_SHOW",
            images: p.images || [],
            videos: p.videos || [],
            tags: p.tags || [],
            authorId: p.authorId,
            authorName: p.authorName || "",
            authorAvatar: p.authorAvatar || "/api/avatars/placeholder.jpg",
            city: p.city,
            stats: p.stats || {
              viewCount: 0,
              likeCount: 0,
              commentCount: 0,
              shareCount: 0,
            },
            createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
            updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          }),
        );
        setPosts(items);
        setFilteredPosts(items);
      } catch (e) {
        console.error("加载帖子失败", e);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, [activeTab, router]);

  // 处理筛选变化
  const handleFilterChange = (newFilters: PostFilters) => {
    setFilters(newFilters);

    let filtered = [...posts];

    // 按关键词筛选
    if (newFilters.keyword) {
      const keyword = newFilters.keyword.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(keyword) ||
          post.content.toLowerCase().includes(keyword) ||
          post.tags.some((tag) => tag.toLowerCase().includes(keyword)),
      );
    }

    // 按类型筛选
    if (newFilters.type) {
      filtered = filtered.filter((post) => post.type === newFilters.type);
    }

    // 按分类筛选
    if (newFilters.category) {
      filtered = filtered.filter(
        (post) => post.category === newFilters.category,
      );
    }

    // 按标签筛选
    if (newFilters.tags && newFilters.tags.length > 0) {
      filtered = filtered.filter((post) =>
        newFilters.tags!.some((tag) => post.tags.includes(tag)),
      );
    }

    // 按城市筛选
    if (newFilters.city) {
      filtered = filtered.filter((post) => post.city === newFilters.city);
    }

    // 排序
    if (newFilters.sortBy) {
      switch (newFilters.sortBy) {
        case "latest":
          filtered.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          break;
        case "popular":
          filtered.sort((a, b) => b.stats.likeCount - a.stats.likeCount);
          break;
        case "mostViewed":
          filtered.sort((a, b) => b.stats.viewCount - a.stats.viewCount);
          break;
      }
    }

    setFilteredPosts(filtered);
  };

  if (loading) {
    return <div className="flex justify-center p-8">加载中...</div>;
  }

  if (!user) {
    return null; // 会被重定向
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner 区域 */}
      <Banner scene="feed" />

      {/* 页签切换 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("work")}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "work"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              交流区
            </button>
            <button
              onClick={() => setActiveTab("skill")}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "skill"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              技能区
            </button>
          </div>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <PostFilter onFilterChange={handleFilterChange} />
      </div>

      {/* 帖子列表 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {loadingPosts ? (
          <div className="text-center py-8">加载中...</div>
        ) : (
          <MasonryGrid columns={3} gap={16}>
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </MasonryGrid>
        )}
      </div>
    </div>
  );
}
