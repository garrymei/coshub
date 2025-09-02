'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { 
  SKILL_CATEGORIES, 
  SKILL_ROLES, 
  EXPERIENCE_LEVELS, 
  PRICE_TYPES, 
  CONTACT_METHODS,
  POPULAR_CITIES,
  POPULAR_TAGS 
} from '@/lib/constants';
import type { CreateSkillPostDTO, SkillCategory, SkillRole, ExperienceLevel, PriceType, ContactMethod } from '@/lib/api';

interface FormData extends Omit<CreateSkillPostDTO, 'images'> {
  images: string[];
  imageUrls: string; // 用于输入图片URL的临时字段
}

function CreateSkillPostPageLegacy() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: SkillCategory.COSPLAY,
    role: SkillRole.COSER,
    city: '',
    price: {
      type: PriceType.FIXED,
      amount: 0,
      currency: 'CNY',
      negotiable: false
    },
    images: [],
    imageUrls: '',
    tags: [],
    experience: ExperienceLevel.INTERMEDIATE,
    availability: {
      weekdays: true,
      weekends: true,
      holidays: false,
      timeSlots: [{ start: '09:00', end: '18:00' }],
      advance: 3
    },
    contactInfo: {
      wechat: '',
      qq: '',
      phone: '',
      email: '',
      preferred: ContactMethod.WECHAT
    }
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parentField: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField as keyof FormData],
        [field]: value
      }
    }));
  };

  const handleImageUrlsChange = (urls: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: urls,
      images: urls.split('\n').filter(url => url.trim()).slice(0, 9)
    }));
  };

  const handleTagsChange = (tagText: string) => {
    const tags = tagText.split(/[,，\s]+/).filter(tag => tag.trim()).slice(0, 10);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: [
          ...prev.availability.timeSlots,
          { start: '09:00', end: '18:00' }
        ]
      }
    }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: prev.availability.timeSlots.filter((_, i) => i !== index)
      }
    }));
  };

  const updateTimeSlot = (index: number, field: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: prev.availability.timeSlots.map((slot, i) => 
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim() || formData.title.length < 5) {
      return '标题至少需要5个字符';
    }
    if (!formData.description.trim() || formData.description.length < 20) {
      return '描述至少需要20个字符';
    }
    if (!formData.city.trim()) {
      return '请填写城市';
    }
    if (formData.images.length === 0) {
      return '至少需要添加1张图片';
    }
    if (formData.price.type === 'fixed' && (!formData.price.amount || formData.price.amount <= 0)) {
      return '请设置正确的固定价格';
    }
    if (formData.price.type === 'range' && (!formData.price.range || formData.price.range.min >= formData.price.range.max)) {
      return '请设置正确的价格区间';
    }
    
    // 检查联系方式
    const { contactInfo } = formData;
    const hasContact = contactInfo.wechat || contactInfo.qq || contactInfo.phone || contactInfo.email;
    if (!hasContact) {
      return '至少需要填写一种联系方式';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 准备提交数据，移除临时字段
      const { imageUrls, ...submitData } = formData;
      
      const response = await api.skillPosts.create(submitData as any);
      
      if (response.success) {
        router.push(`/skill-posts/${response.data.id}`);
      } else {
        setError(response.error?.message || '发布失败');
      }
    } catch (err) {
      setError('网络请求失败，请稍后重试');
      console.error('Error creating skill post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/skill-posts"
            className="text-gray-600 hover:text-gray-900"
          >
            ← 返回
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">发布技能帖</h1>
            <p className="text-gray-600">分享你的技能，连接志同道合的伙伴</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 主要表单 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 基本信息 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
                
                <div className="space-y-4">
                  {/* 标题 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      标题 *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="简明扼要地描述你的技能服务"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.title.length}/100 字符
                    </p>
                  </div>

                  {/* 分类和角色 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        技能分类 *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                      >
                        {SKILL_CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        角色类型 *
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                      >
                        {SKILL_ROLES.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 城市和经验 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        所在城市 *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="选择或输入城市"
                        list="cities"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                      />
                      <datalist id="cities">
                        {POPULAR_CITIES.map(city => (
                          <option key={city} value={city} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        经验等级 *
                      </label>
                      <select
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                      >
                        {EXPERIENCE_LEVELS.map(level => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 描述 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      详细描述 *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="详细介绍你的技能、经验、提供的服务内容等"
                      rows={6}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                      maxLength={2000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description.length}/2000 字符
                    </p>
                  </div>

                  {/* 图片 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      作品图片 * (最多9张)
                    </label>
                    {/* 文件上传直传 */}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        setLoading(true);
                        try {
                          const resp = await api.upload.uploadFiles(files);
                          if (resp.success && resp.data) {
                            setFormData(prev => ({
                              ...prev,
                              images: [...prev.images, ...resp.data.urls].slice(0, 9),
                              imageUrls: [...prev.images, ...resp.data.urls].slice(0, 9).join('\n')
                            }));
                          } else {
                            setError(resp.error?.message || '图片上传失败');
                          }
                        } finally {
                          setLoading(false);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none mb-3"
                    />
                    <textarea
                      value={formData.imageUrls}
                      onChange={(e) => handleImageUrlsChange(e.target.value)}
                      placeholder="请输入图片URL，每行一个&#10;例如：&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      已添加 {formData.images.length} 张图片
                    </p>
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {formData.images.slice(0, 3).map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`预览 ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Zu+54mH6ZSZ6K+vPC90ZXh0Pjwvc3ZnPg==';
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 标签 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      标签 (用逗号分隔，最多10个)
                    </label>
                    <input
                      type="text"
                      value={formData.tags.join(', ')}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      placeholder="二次元, 写真, 精修, 专业器材"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                    />
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">推荐标签：</p>
                      <div className="flex flex-wrap gap-1">
                        {POPULAR_TAGS.slice(0, 8).map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              if (!formData.tags.includes(tag)) {
                                handleTagsChange([...formData.tags, tag].join(', '));
                              }
                            }}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 价格设置 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">价格设置</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      价格类型 *
                    </label>
                    <select
                      value={formData.price.type}
                      onChange={(e) => handleNestedInputChange('price', 'type', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                    >
                      {PRICE_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.price.type === 'fixed' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        固定价格 (元) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.price.amount || ''}
                        onChange={(e) => handleNestedInputChange('price', 'amount', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                      />
                    </div>
                  )}

                  {formData.price.type === 'range' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          最低价格 (元) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.price.range?.min || ''}
                          onChange={(e) => handleNestedInputChange('price', 'range', {
                            ...formData.price.range,
                            min: Number(e.target.value)
                          })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          最高价格 (元) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.price.range?.max || ''}
                          onChange={(e) => handleNestedInputChange('price', 'range', {
                            ...formData.price.range,
                            max: Number(e.target.value)
                          })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="negotiable"
                      checked={formData.price.negotiable}
                      onChange={(e) => handleNestedInputChange('price', 'negotiable', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="negotiable" className="text-sm text-gray-700">
                      价格可商议
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 侧边栏 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 可用时间 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">可用时间</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      可接单时间
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.availability.weekdays}
                          onChange={(e) => handleNestedInputChange('availability', 'weekdays', e.target.checked)}
                          className="mr-2"
                        />
                        工作日
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.availability.weekends}
                          onChange={(e) => handleNestedInputChange('availability', 'weekends', e.target.checked)}
                          className="mr-2"
                        />
                        周末
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.availability.holidays}
                          onChange={(e) => handleNestedInputChange('availability', 'holidays', e.target.checked)}
                          className="mr-2"
                        />
                        节假日
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      时间段
                    </label>
                    {formData.availability.timeSlots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <span>-</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        {formData.availability.timeSlots.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTimeSlot(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            删除
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTimeSlot}
                      className="text-coshub-primary hover:text-coshub-secondary text-sm"
                    >
                      + 添加时间段
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      需要提前预约 (天)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={formData.availability.advance}
                      onChange={(e) => handleNestedInputChange('availability', 'advance', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                    />
                  </div>
                </div>
              </div>

              {/* 联系方式 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">联系方式</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      微信号
                    </label>
                    <input
                      type="text"
                      value={formData.contactInfo.wechat}
                      onChange={(e) => handleNestedInputChange('contactInfo', 'wechat', e.target.value)}
                      placeholder="微信号"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      QQ号
                    </label>
                    <input
                      type="text"
                      value={formData.contactInfo.qq}
                      onChange={(e) => handleNestedInputChange('contactInfo', 'qq', e.target.value)}
                      placeholder="QQ号"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      手机号
                    </label>
                    <input
                      type="tel"
                      value={formData.contactInfo.phone}
                      onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
                      placeholder="手机号"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱
                    </label>
                    <input
                      type="email"
                      value={formData.contactInfo.email}
                      onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
                      placeholder="邮箱地址"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      推荐联系方式 *
                    </label>
                    <select
                      value={formData.contactInfo.preferred}
                      onChange={(e) => handleNestedInputChange('contactInfo', 'preferred', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coshub-primary"
                    >
                      {CONTACT_METHODS.map(method => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-coshub-primary text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {loading ? '发布中...' : '发布技能帖'}
                </button>
                
                <p className="text-xs text-gray-500 mt-2 text-center">
                  发布即表示同意平台相关协议
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
