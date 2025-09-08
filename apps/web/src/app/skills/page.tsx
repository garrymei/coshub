"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Banner from "@/components/Banner";
import PostCard from "@/components/PostCard";
import MasonryGrid from "@/components/MasonryGrid";
import PostFilter, { PostFilters } from "@/components/PostFilter";
import { Post } from "@/types/post";
import { api, type WebSkill } from "@/lib/api";

export default function SkillsPage() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [filters, setFilters] = useState<PostFilters>({});

  useEffect(() => {
    if (!loading && !user) {
      // 技能区可以公开访问，不需要登录
      return;
    }

    // 通过 API 获取技能数据
    const fetchSkillPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await api.skills.list({ page: 1 });
        const items = (res.items as any as WebSkill[]).map(
          (s): Post => ({
            id: s.id,
            title: s.title,
            content: s.description || "",
            type: "SHARE",
            category: "RESOURCE",
            city: s.city,
            images: s.images || [],
            videos: [],
            tags: s.tags || [],
            authorId: s.authorId || "",
            authorName: s.authorName || "",
            authorAvatar: s.authorAvatar || "/default-avatar.png",
            stats: {
              viewCount: 0,
              likeCount: 0,
              commentCount: 0,
              shareCount: 0,
            },
            createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
            updatedAt: s.updatedAt ? new Date(s.updatedAt) : new Date(),
          }),
        );
        setPosts(items);
        setFilteredPosts(items);
      } catch (e) {
        console.error("加载技能失败", e);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchSkillPosts();
  }, [user, loading]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner 区域 */}
      <Banner scene="skills" />

      {/* 页面标题 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">技能区</h1>
          <p className="mt-2 text-gray-600">
            发现优秀的Cosplay技能服务，找到你需要的专业人才
          </p>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <PostFilter onFilterChange={handleFilterChange} />
      </div>

      {/* 技能帖子列表 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {loadingPosts ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              没有找到匹配的技能服务
            </h3>
            <p className="text-gray-600">尝试调整筛选条件或搜索关键词</p>
          </div>
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
