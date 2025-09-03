"use client";

import { useState } from "react";
import CitySelector from "./CitySelector";

interface PostFilterProps {
  onFilterChange: (filters: PostFilters) => void;
  className?: string;
}

export interface PostFilters {
  type?: string;
  category?: string;
  tags?: string[];
  city?: string;
  keyword?: string;
  sortBy?: "latest" | "popular" | "mostViewed";
}

const postTypes = [
  { value: "SHARE", label: "分享" },
  { value: "TUTORIAL", label: "教程分享" },
  { value: "DISCUSSION", label: "讨论交流" },
  { value: "NEWS", label: "新闻资讯" },
  { value: "EVENT", label: "活动信息" },
];

const postCategories = [
  { value: "COSPLAY_SHOW", label: "Cosplay 展示" },
  { value: "TUTORIAL", label: "教程分享" },
  { value: "EVENT_REPORT", label: "活动报告" },
  { value: "DISCUSSION", label: "话题讨论" },
  { value: "NEWS", label: "圈内资讯" },
  { value: "RESOURCE", label: "资源分享" },
];

const popularTags = [
  "二次元",
  "Cosplay",
  "摄影",
  "化妆",
  "道具",
  "服装",
  "动漫",
  "游戏",
  "手办",
  "绘画",
];

export default function PostFilter({
  onFilterChange,
  className = "",
}: PostFilterProps) {
  const [filters, setFilters] = useState<PostFilters>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (newFilters: Partial<PostFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: PostFilters = {};
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    updateFilters({ tags: newTags });
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      {/* 基础筛选 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-4">
          {/* 关键词搜索 */}
          <div className="flex-1 min-w-48">
            <input
              type="text"
              placeholder="搜索帖子..."
              value={filters.keyword || ""}
              onChange={(e) => updateFilters({ keyword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 城市选择 */}
          <div className="w-32">
            <CitySelector
              value={filters.city}
              onChange={(city) => updateFilters({ city })}
              placeholder="选择城市"
            />
          </div>

          {/* 排序 */}
          <div className="w-32">
            <select
              value={filters.sortBy || "latest"}
              onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">最新发布</option>
              <option value="popular">最受欢迎</option>
              <option value="mostViewed">最多浏览</option>
            </select>
          </div>

          {/* 展开/收起按钮 */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {isExpanded ? "收起筛选" : "更多筛选"}
          </button>

          {/* 清除筛选 */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50"
          >
            清除筛选
          </button>
        </div>
      </div>

      {/* 展开的筛选选项 */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* 类型筛选 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">帖子类型</h4>
            <div className="flex flex-wrap gap-2">
              {postTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() =>
                    updateFilters({
                      type:
                        filters.type === type.value ? undefined : type.value,
                    })
                  }
                  className={`px-3 py-1 text-sm rounded-full border ${
                    filters.type === type.value
                      ? "bg-blue-100 border-blue-300 text-blue-700"
                      : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* 分类筛选 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">帖子分类</h4>
            <div className="flex flex-wrap gap-2">
              {postCategories.map((category) => (
                <button
                  key={category.value}
                  onClick={() =>
                    updateFilters({
                      category:
                        filters.category === category.value
                          ? undefined
                          : category.value,
                    })
                  }
                  className={`px-3 py-1 text-sm rounded-full border ${
                    filters.category === category.value
                      ? "bg-green-100 border-green-300 text-green-700"
                      : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* 标签筛选 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">热门标签</h4>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    filters.tags?.includes(tag)
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
