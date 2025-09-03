"use client";

import { useState } from "react";
import { Post } from "@/types/post";
import Link from "next/link";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
  };

  const renderMedia = () => {
    if (post.videos.length > 0) {
      return (
        <div className="relative">
          <video
            className="w-full h-48 object-cover rounded-lg"
            controls
            poster={post.images[0]}
          >
            <source src={post.videos[0]} type="video/mp4" />
          </video>
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            🎥 视频
          </div>
        </div>
      );
    }

    if (post.images.length === 1) {
      return (
        <img
          src={imageError ? "/api/placeholder.jpg" : post.images[0]}
          alt={post.title}
          className="w-full h-48 object-cover rounded-lg"
          onError={handleImageError}
        />
      );
    }

    if (post.images.length > 1) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          {post.images.slice(0, 4).map((image, index) => (
            <div key={index} className="relative">
              <img
                src={imageError ? "/api/placeholder.jpg" : image}
                alt={`${post.title} ${index + 1}`}
                className="w-full h-24 object-cover"
                onError={handleImageError}
              />
              {index === 3 && post.images.length > 4 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    +{post.images.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">暂无图片</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* 媒体内容 */}
      <div className="relative">
        {renderMedia()}
        {post.type === "tutorial" && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
            📚 教程
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        {/* 标题 */}
        <Link href={`/post/${post.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* 内容预览 */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {post.content}
        </p>

        {/* 标签 */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 作者信息和统计 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              className="h-8 w-8 rounded-full"
              src={post.authorAvatar}
              alt={post.authorName}
            />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {post.authorName}
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(post.createdAt)}
              </div>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <span>👁️</span>
              <span>{post.stats.viewCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>❤️</span>
              <span>{post.stats.likeCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>💬</span>
              <span>{post.stats.commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
