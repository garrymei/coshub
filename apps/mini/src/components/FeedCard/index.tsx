import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Post } from "@/types";
import "./index.scss";

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
      className={`feed-card feed-card--${layout}`}
      hoverClass="feed-card--hover"
      onClick={handleCardClick}
    >
      {/* 用户信息 */}
      <View className="feed-card__header">
        <Image className="feed-card__avatar" src={post.user.avatar} />
        <View className="feed-card__user-info">
          <Text className="feed-card__username">{post.user.nickname}</Text>
          <Text className="feed-card__time">{formatTime(post.createdAt)}</Text>
        </View>
      </View>

      {/* 内容 */}
      <View className="feed-card__content">
        <Text className="feed-card__text">{post.content}</Text>
      </View>

      {/* 图片 */}
      {post.images && post.images.length > 0 && (
        <View className={`feed-card__images feed-card__images--${layout}`}>
          {layout === "masonry" ? (
            post.images.map((img, index) => (
              <Image
                key={index}
                className="feed-card__img"
                src={img}
                mode="aspectFill"
                lazyLoad
              />
            ))
          ) : (
            <View className="feed-card__grid">
              {post.images.slice(0, 4).map((img, index) => (
                <Image
                  key={index}
                  className="feed-card__img feed-card__img--grid"
                  src={img}
                  mode="aspectFill"
                  lazyLoad
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* 互动按钮 */}
      <View className="feed-card__actions">
        <View className="feed-card__action-group">
          <View
            className={`feed-card__action ${post.isLiked ? 'feed-card__action--active' : ''}`}
            onClick={handleLike}
          >
            <Text className="feed-card__action-icon">
              {post.isLiked ? "❤️" : "🤍"}
            </Text>
            <Text className="feed-card__action-count">{post.likeCount}</Text>
          </View>

          <View
            className="feed-card__action"
            onClick={handleComment}
          >
            <Text className="feed-card__action-icon">💬</Text>
            <Text className="feed-card__action-count">{post.commentCount}</Text>
          </View>
        </View>

        <View
          className={`feed-card__action ${post.isCollected ? 'feed-card__action--active' : ''}`}
          onClick={handleCollect}
        >
          <Text className="feed-card__action-icon">
            {post.isCollected ? "⭐" : "☆"}
          </Text>
          <Text className="feed-card__action-count">{post.collectCount}</Text>
        </View>
      </View>
    </View>
  );
}
