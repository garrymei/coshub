"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Banner from "@/components/Banner";
import PostCard from "@/components/PostCard";
import MasonryGrid from "@/components/MasonryGrid";
import PostFilter, { PostFilters } from "@/components/PostFilter";
import { Post } from "@/types/post";

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

    // 模拟获取技能区帖子数据
    const fetchSkillPosts = async () => {
      setLoadingPosts(true);

      // 这里应该调用API获取技能区帖子数据
      // const response = await fetch('/api/skill-posts');
      // const postsData = await response.json();

      // 模拟数据
      const mockSkillPosts: Post[] = [
        {
          id: "skill1",
          title: "专业Cosplay摄影服务",
          content:
            "提供专业的Cosplay摄影服务，包括室内外拍摄、后期修图等。有5年摄影经验，擅长各种风格。",
          type: "showcase",
          category: "photography",
          city: "北京",
          images: ["/mock-skill-1.jpg"],
          videos: [],
          tags: ["摄影", "Cosplay", "专业服务"],
          authorId: "user1",
          authorName: "专业摄影师",
          authorAvatar: "/default-avatar.png",
          stats: {
            viewCount: 1200,
            likeCount: 89,
            commentCount: 23,
            shareCount: 12,
          },
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(Date.now() - 86400000),
        },
        {
          id: "skill2",
          title: "道具制作定制服务",
          content:
            "承接各种道具制作定制，包括武器、装备、装饰品等。使用高质量材料，做工精细。",
          type: "showcase",
          category: "prop_making",
          city: "上海",
          images: ["/mock-skill-2.jpg", "/mock-skill-2-2.jpg"],
          videos: [],
          tags: ["道具制作", "定制", "高质量"],
          authorId: "user2",
          authorName: "道具制作师",
          authorAvatar: "/default-avatar.png",
          stats: {
            viewCount: 890,
            likeCount: 67,
            commentCount: 18,
            shareCount: 8,
          },
          createdAt: new Date(Date.now() - 172800000),
          updatedAt: new Date(Date.now() - 172800000),
        },
        {
          id: "skill3",
          title: "Cosplay化妆教学",
          content:
            "提供Cosplay化妆教学服务，一对一指导，从基础到高级技巧。适合新手和有经验的coser。",
          type: "tutorial",
          category: "makeup",
          city: "广州",
          images: ["/mock-skill-3.jpg"],
          videos: [],
          tags: ["化妆", "教学", "一对一"],
          authorId: "user3",
          authorName: "化妆师",
          authorAvatar: "/default-avatar.png",
          stats: {
            viewCount: 650,
            likeCount: 45,
            commentCount: 12,
            shareCount: 5,
          },
          createdAt: new Date(Date.now() - 259200000),
          updatedAt: new Date(Date.now() - 259200000),
        },
        {
          id: "skill4",
          title: "服装制作与修改",
          content:
            "专业服装制作与修改服务，包括设计、裁剪、缝制等。可根据角色图片定制服装。",
          type: "showcase",
          category: "costume_making",
          city: "深圳",
          images: ["/mock-skill-4.jpg"],
          videos: [],
          tags: ["服装制作", "修改", "定制"],
          authorId: "user4",
          authorName: "服装师",
          authorAvatar: "/default-avatar.png",
          stats: {
            viewCount: 780,
            likeCount: 56,
            commentCount: 15,
            shareCount: 7,
          },
          createdAt: new Date(Date.now() - 345600000),
          updatedAt: new Date(Date.now() - 345600000),
        },
      ];

      setPosts(mockSkillPosts);
      setFilteredPosts(mockSkillPosts);
      setLoadingPosts(false);
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
