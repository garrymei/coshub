"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Banner from "@/components/Banner";
import PostCard from "@/components/PostCard";
import MasonryGrid from "@/components/MasonryGrid";
import PostFilter, { PostFilters } from "@/components/PostFilter";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/post";

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

  // 模拟获取帖子数据
  useEffect(() => {
    if (activeTab === "work") {
      // 模拟交流区帖子数据
      const mockPosts: Post[] = [
        {
          id: "1",
          title: "我的第一个Cosplay作品",
          content:
            "分享我的第一个Cosplay作品，希望大家喜欢！这次cos的是初音未来，虽然还有很多不足，但我会继续努力的！",
          type: "SHARE",
          category: "COSPLAY_SHOW",
          images: ["/api/posts/1.jpg", "/api/posts/1-2.jpg"],
          videos: [],
          tags: ["cosplay", "初音未来", "分享"],
          authorId: "user1",
          authorName: "Cosplayer001",
          authorAvatar: "/api/avatars/1.jpg",
          city: "北京",
          stats: {
            viewCount: 150,
            likeCount: 25,
            commentCount: 8,
            shareCount: 3,
          },
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-15"),
        },
        {
          id: "2",
          title: "摄影技巧分享",
          content: "分享一些Cosplay摄影的技巧和经验，希望对大家有帮助！",
          type: "TUTORIAL",
          category: "TUTORIAL",
          images: ["/api/posts/2.jpg"],
          videos: [],
          tags: ["摄影", "技巧", "分享"],
          authorId: "user2",
          authorName: "摄影师002",
          authorAvatar: "/api/avatars/2.jpg",
          city: "上海",
          stats: {
            viewCount: 89,
            likeCount: 12,
            commentCount: 5,
            shareCount: 2,
          },
          createdAt: new Date("2024-01-14"),
          updatedAt: new Date("2024-01-14"),
        },
        {
          id: "3",
          title: "道具制作过程",
          content: "记录一下道具制作的全过程，从设计到完成，每一步都很重要！",
          type: "SHARE",
          category: "RESOURCE",
          images: [
            "/api/posts/3.jpg",
            "/api/posts/3-2.jpg",
            "/api/posts/3-3.jpg",
          ],
          videos: [],
          tags: ["道具", "制作", "过程"],
          authorId: "user3",
          authorName: "道具师003",
          authorAvatar: "/api/avatars/3.jpg",
          city: "广州",
          stats: {
            viewCount: 234,
            likeCount: 45,
            commentCount: 12,
            shareCount: 8,
          },
          createdAt: new Date("2024-01-13"),
          updatedAt: new Date("2024-01-13"),
        },
      ];
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setLoadingPosts(false);
    } else {
      // 技能区帖子会重定向到技能页面
      router.push("/skills");
    }
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
