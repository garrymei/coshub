'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { SKILL_CATEGORIES, SKILL_ROLES, EXPERIENCE_LEVELS, CONTACT_METHODS } from '@/lib/constants';
import type { SkillPost } from '@/lib/api';

interface SkillPostDetailPageProps {
  params: { id: string };
}

export default function SkillPostDetailPage({ params }: SkillPostDetailPageProps) {
  const [skillPost, setSkillPost] = useState<SkillPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchSkillPost = async () => {
      try {
        setLoading(true);
        const response = await api.client.get(`/skill-posts/${params.id}`);
        
        if (response.success && response.data) {
          setSkillPost(response.data);
        } else {
          setError('技能帖不存在或已被删除');
        }
      } catch (err) {
        setError('获取技能帖详情失败');
        console.error('Error fetching skill post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillPost();
  }, [params.id]);

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

  const getLabel = (value: string, options: { value: string; label: string }[]) => {
    return options.find(option => option.value === value)?.label || value;
  };

  const formatTimeSlots = (timeSlots: { start: string; end: string }[]) => {
    return timeSlots.map(slot => `${slot.start}-${slot.end}`).join(', ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-coshub-primary"></div>
      </div>
    );
  }

  if (error || !skillPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-coshub-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            href="/skill-posts"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            ← 返回技能帖列表
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2">
            {/* 图片展示 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
                {skillPost.images.length > 0 ? (
                  <img
                    src={skillPost.images[currentImageIndex]}
                    alt={skillPost.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    暂无图片
                  </div>
                )}
              </div>
              
              {/* 图片缩略图 */}
              {skillPost.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {skillPost.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                        index === currentImageIndex ? 'border-coshub-primary' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${skillPost.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 详细信息 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {skillPost.title}
              </h1>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-coshub-primary text-white px-3 py-1 rounded-full text-sm">
                  {getLabel(skillPost.category, SKILL_CATEGORIES)}
                </span>
                <span className="bg-coshub-secondary text-white px-3 py-1 rounded-full text-sm">
                  {getLabel(skillPost.role, SKILL_ROLES)}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {getLabel(skillPost.experience, EXPERIENCE_LEVELS)}
                </span>
                {skillPost.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              {/* 描述 */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">服务描述</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {skillPost.description}
                </p>
              </div>

              {/* 可用时间 */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">可用时间</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">可接单时间：</p>
                    <div className="space-y-1">
                      {skillPost.availability.weekdays && (
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">
                          工作日
                        </span>
                      )}
                      {skillPost.availability.weekends && (
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">
                          周末
                        </span>
                      )}
                      {skillPost.availability.holidays && (
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">
                          节假日
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">时间段：</p>
                    <p className="text-gray-700">
                      {formatTimeSlots(skillPost.availability.timeSlots)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      需提前 {skillPost.availability.advance} 天预约
                    </p>
                  </div>
                </div>
              </div>

              {/* 统计信息 */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">服务统计</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-coshub-primary">
                      {skillPost.stats.viewCount}
                    </p>
                    <p className="text-sm text-gray-600">浏览量</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-coshub-primary">
                      {skillPost.stats.avgRating.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600">平均评分</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-coshub-primary">
                      {skillPost.stats.responseRate}%
                    </p>
                    <p className="text-sm text-gray-600">响应率</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-coshub-primary">
                      {skillPost.stats.reviewCount}
                    </p>
                    <p className="text-sm text-gray-600">评价数</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            {/* 价格和联系信息 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-coshub-primary mb-2">
                  {formatPrice(skillPost)}
                </p>
                <p className="text-gray-600">📍 {skillPost.city}</p>
              </div>

              {/* 发布者信息 */}
              <div className="border-t pt-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={skillPost.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${skillPost.authorName}`}
                    alt={skillPost.authorName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{skillPost.authorName}</p>
                    <p className="text-sm text-gray-600">
                      发布于 {new Date(skillPost.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* 联系方式 */}
              <div className="space-y-3">
                <p className="font-medium text-gray-900">联系方式：</p>
                
                {skillPost.contactInfo.wechat && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">💬</span>
                    <span>微信：{skillPost.contactInfo.wechat}</span>
                  </div>
                )}
                
                {skillPost.contactInfo.qq && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-blue-600">🐧</span>
                    <span>QQ：{skillPost.contactInfo.qq}</span>
                  </div>
                )}
                
                {skillPost.contactInfo.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">📞</span>
                    <span>电话：{skillPost.contactInfo.phone}</span>
                  </div>
                )}
                
                {skillPost.contactInfo.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">📧</span>
                    <span>邮箱：{skillPost.contactInfo.email}</span>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  推荐联系方式：{getLabel(skillPost.contactInfo.preferred, CONTACT_METHODS)}
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="mt-6 space-y-3">
                <button className="w-full bg-coshub-primary text-white py-3 rounded-lg hover:opacity-90 transition-opacity">
                  立即联系
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                  收藏
                </button>
              </div>
            </div>

            {/* 安全提示 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">💡 安全提示</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 建议先通过平台沟通</li>
                <li>• 谨慎处理金钱交易</li>
                <li>• 保留聊天和交易记录</li>
                <li>• 如遇问题请及时举报</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
