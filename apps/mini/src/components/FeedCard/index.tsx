import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Post } from "@/services/api";

interface FeedCardProps {
  post: Post;
  layout?: "masonry" | "list";
  onLike?: (postId: string) => void;
  onCollect?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export default function FeedCard({
  post,
  layout = "masonry",
  onLike,
  onCollect,
  onComment,
}: FeedCardProps) {
  const handleCardClick = () => {
    Taro.navigateTo({ url: `/pages/feed/detail?id=${post.id}` });
  };

  const handleLike = (e: any) => {
    e.stopPropagation();
    if (onLike) {
      onLike(post.id);
    }
  };

  const handleCollect = (e: any) => {
    e.stopPropagation();
    if (onCollect) {
      onCollect(post.id);
    }
  };

  const handleComment = (e: any) => {
    e.stopPropagation();
    if (onComment) {
      onComment(post.id);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "刚刚";
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
  };

  return (
    <View
      className={`feed-card card transition-transform duration-300 hover:shadow-medium hover:-translate-y-1 ${layout}`}
      onClick={handleCardClick}
    >
      {/* 用户信息 */}
      <View className="flex items-center p-3">
        <Image className="w-8 h-8 rounded-full mr-2" src={post.user.avatar} />
        <View className="flex-1">
          <Text className="text-sm font-semibold text-gray-800">
            {post.user.nickname}
          </Text>
          <Text className="text-xs text-gray-500">
            {formatTime(post.createdAt)}
          </Text>
        </View>
      </View>

      {/* 内容 */}
      <Text className="text-sm text-gray-700 px-3 pb-3 leading-relaxed">
        {post.content}
      </Text>

      {/* 图片 */}
      {post.images && post.images.length > 0 && (
        <View className={`images ${layout === "list" ? "px-3 pb-3" : ""}`}>
          {layout === "masonry" ? (
            post.images.map((img, index) => (
              <Image
                key={index}
                className="w-full object-cover rounded-lg mb-2"
                src={img}
                mode="aspectFill"
                style={{ minHeight: "150px", maxHeight: "300px" }}
              />
            ))
          ) : (
            <View className="grid grid-cols-2 gap-2">
              {post.images.slice(0, 4).map((img, index) => (
                <Image
                  key={index}
                  className="w-full h-24 object-cover rounded-lg"
                  src={img}
                  mode="aspectFill"
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* 互动按钮 */}
      <View className="flex items-center justify-between px-3 py-2 border-t border-gray-100">
        <View className="flex items-center space-x-4">
          <View
            className="flex items-center space-x-1 cursor-pointer"
            onClick={handleLike}
          >
            <Text
              className={`text-lg ${post.isLiked ? "text-red-500" : "text-gray-400"}`}
            >
              {post.isLiked ? "❤️" : "🤍"}
            </Text>
            <Text className="text-xs text-gray-500">{post.likeCount}</Text>
          </View>

          <View
            className="flex items-center space-x-1 cursor-pointer"
            onClick={handleComment}
          >
            <Text className="text-lg text-gray-400">💬</Text>
            <Text className="text-xs text-gray-500">{post.commentCount}</Text>
          </View>
        </View>

        <View
          className="flex items-center space-x-1 cursor-pointer"
          onClick={handleCollect}
        >
          <Text
            className={`text-lg ${post.isCollected ? "text-yellow-500" : "text-gray-400"}`}
          >
            {post.isCollected ? "⭐" : "☆"}
          </Text>
          <Text className="text-xs text-gray-500">{post.collectCount}</Text>
        </View>
      </View>
    </View>
  );
}
