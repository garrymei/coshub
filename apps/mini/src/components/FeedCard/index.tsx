import { View, Image, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from "react";
import { Post } from "../../types";
import { formatDate } from "../../utils/common";
import "./index.scss";

interface FeedCardProps {
  post: Post;
  style?: React.CSSProperties;
}

const FeedCard: React.FC<FeedCardProps> = ({ post, style }) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/feed/detail?id=${post.id}`,
    });
  };

  const handleLike = (e) => {
    e.stopPropagation();
    // 处理点赞逻辑
  };

  const handleComment = (e) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: `/pages/feed/detail?id=${post.id}&showComments=true`,
    });
  };

  const handleCollect = (e) => {
    e.stopPropagation();
    // 处理收藏逻辑
  };

  return (
    <View className="feed-card" style={style} onClick={handleClick}>
      <Image className="feed-image" mode="aspectFill" src={post.media[0]} />
      <View className="feed-info">
        <Text className="feed-caption">{post.caption}</Text>
        <View className="feed-author">
          <Image
            className="author-avatar"
            mode="aspectFill"
            src={post.author?.avatar || ""}
          />
          <Text className="author-name">{post.author?.nickname || "用户"}</Text>
        </View>
        <View className="feed-footer">
          <View className="feed-actions">
            <View
              className={`action-item ${post.isLiked ? "active" : ""}`}
              onClick={handleLike}
            >
              <Text className="iconfont icon-like"></Text>
              <Text className="action-count">{post.likeCount}</Text>
            </View>
            <View className="action-item" onClick={handleComment}>
              <Text className="iconfont icon-comment"></Text>
              <Text className="action-count">{post.commentCount}</Text>
            </View>
            <View
              className={`action-item ${post.isCollected ? "active" : ""}`}
              onClick={handleCollect}
            >
              <Text className="iconfont icon-collect"></Text>
              <Text className="action-count">{post.collectCount}</Text>
            </View>
          </View>
          <Text className="feed-date">{formatDate(post.createdAt)}</Text>
        </View>
      </View>
    </View>
  );
};

export default FeedCard;
