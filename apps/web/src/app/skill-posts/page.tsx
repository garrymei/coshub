'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { SKILL_CATEGORIES, SKILL_ROLES, POPULAR_CITIES } from '@/lib/constants';
import type { SkillPost, SkillPostQueryDTO } from '@/lib/api';

export default function SkillPostsPage() {
  const [skillPosts, setSkillPosts] = useState<SkillPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SkillPostQueryDTO>({
    page: 1,
    limit: 12
  });
  const [total, setTotal] = useState(0);

  const fetchSkillPosts = async () => {
    try {
      setLoading(true);
      const response = await api.skillPosts.list(filters);
      
      if (response.success && response.data) {
        setSkillPosts(response.data.items);
        setTotal(response.data.total);
      } else {
        setError('获取技能帖列表失败');
      }
    } catch (err) {
      setError('网络请求失败');
      console.error('Error fetching skill posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillPosts();
  }, [filters]);

  const handleFilterChange = (key: keyof SkillPostQueryDTO, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // 重置到第一页
    }));
  };

  const formatPrice = (post: SkillPost) => {
    const { price } = post;
    switch (price.type) {
      case 'free':
        return '免费';
      case 'fixed':
        return `¥${price.amount}`;
      case 'range':
        return `¥${price.range?.min}-${price.range?.max}`;
      case 'negotiable':
        return '面议';
      default:
        return '价格面议';
    }
  };

  const getRoleLabel = (role: string) => {
    return SKILL_ROLES.find(r => r.value === role)?.label || role;
  };

  const getCategoryLabel = (category: string) => {
    return SKILL_CATEGORIES.find(c => c.value === category)?.label || category;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchSkillPosts}
            className="bg-coshub-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">技能帖广场</h1>
            <p className="text-gray-600">发现优秀的二次元技能服务提供者</p>
          </div>
          <Link
            href="/skill-posts/create"
            className="bg-coshub-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            发布技能帖
          </Link>
        </div>

        {/* 筛选器 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 分类筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                技能分类
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
              >
                <option value="">全部分类</option>
                {SKILL_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 角色筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                角色类型
              </label>
              <select
                value={filters.role || ''}
                onChange={(e) => handleFilterChange('role', e.target.value || undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
              >
                <option value="">全部角色</option>
                {SKILL_ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 城市筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                城市
              </label>
              <select
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
              >
                <option value="">全部城市</option>
                {POPULAR_CITIES.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* 关键词搜索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                关键词搜索
              </label>
              <input
                type="text"
                placeholder="搜索技能、标签..."
                value={filters.keyword || ''}
                onChange={(e) => handleFilterChange('keyword', e.target.value || undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
              />
            </div>
          </div>
        </div>

        {/* 结果统计 */}
        <div className="mb-6">
          <p className="text-gray-600">
            共找到 {total} 个技能帖
          </p>
        </div>

        {/* 技能帖列表 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillPosts.map(post => (
              <Link
                key={post.id}
                href={`/skill-posts/${post.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* 图片 */}
                  <div className="aspect-video bg-gray-200 rounded-md mb-4 overflow-hidden">
                    {post.images[0] ? (
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        暂无图片
                      </div>
                    )}
                  </div>

                  {/* 标题 */}
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* 标签 */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-coshub-primary/10 text-coshub-primary text-xs px-2 py-1 rounded">
                      {getCategoryLabel(post.category)}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {getRoleLabel(post.role)}
                    </span>
                  </div>

                  {/* 价格和城市 */}
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                    <span className="font-medium text-coshub-primary">
                      {formatPrice(post)}
                    </span>
                    <span>📍 {post.city}</span>
                  </div>

                  {/* 用户信息 */}
                  <div className="flex items-center gap-2">
                    <img
                      src={post.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorName}`}
                      alt={post.authorName}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600">{post.authorName}</span>
                    <span className="text-xs text-gray-400">
                      ⭐ {post.stats.avgRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 空状态 */}
        {!loading && skillPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">暂无符合条件的技能帖</p>
            <Link
              href="/skill-posts/create"
              className="bg-coshub-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              发布第一个技能帖
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
