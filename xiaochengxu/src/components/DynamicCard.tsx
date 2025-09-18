import { Heart, MessageCircle, Bookmark, Share } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DynamicCardProps {
  id: string;
  user: {
    avatar: string;
    name: string;
    location?: string;
  };
  content: {
    text: string;
    images: string[];
    tags: string[];
  };
  stats: {
    likes: number;
    comments: number;
    isLiked: boolean;
    isBookmarked: boolean;
  };
  publishedAt?: string;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
}

export function DynamicCard({
  id,
  user,
  content,
  stats,
  onLike,
  onBookmark,
  onComment,
  onShare,
}: DynamicCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
      {/* User Info */}
      <div className="flex items-center mb-3">
        <ImageWithFallback
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{user.name}</h4>
          {user.location && <p className="text-sm text-gray-500">{user.location}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-gray-800 mb-2 leading-relaxed">{content.text}</p>

        {/* Images */}
        {content.images.length > 0 && (
          <div
            className={`grid gap-2 rounded-xl overflow-hidden ${
              content.images.length === 1
                ? "grid-cols-1"
                : content.images.length === 2
                ? "grid-cols-2"
                : content.images.length === 3
                ? "grid-cols-2"
                : "grid-cols-2"
            }`}
          >
            {content.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={`relative ${
                  content.images.length === 3 && index === 0 ? "row-span-2" : ""
                }`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`Content ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                {content.images.length > 4 && index === 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-medium">
                      +{content.images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {content.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {content.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-pink-100 text-pink-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => onLike?.(id)}
            className="flex items-center space-x-1 text-gray-500 hover:text-pink-500 transition-colors"
            aria-label="点赞"
            aria-pressed={stats.isLiked}
          >
            <Heart
              className={`w-5 h-5 ${stats.isLiked ? "fill-pink-500 text-pink-500" : ""}`}
            />
            <span className="text-sm">{stats.likes}</span>
          </button>

          <button
            type="button"
            onClick={() => onComment?.(id)}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
            aria-label="查看评论"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{stats.comments}</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => onBookmark?.(id)}
            className="text-gray-500 hover:text-yellow-500 transition-colors"
            aria-label="收藏"
            aria-pressed={stats.isBookmarked}
          >
            <Bookmark
              className={`w-5 h-5 ${
                stats.isBookmarked ? "fill-yellow-500 text-yellow-500" : ""
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => onShare?.(id)}
            className="text-gray-500 hover:text-green-500 transition-colors"
            aria-label="分享"
          >
            <Share className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
