import {
  View,
  Image,
  Text,
  ScrollView,
  Input,
  Button,
} from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import React, { useState, useEffect } from "react";
import { Post, Comment } from "../../types";
import { feedApi } from "../../services/api";
import {
  showToast,
  showLoading,
  hideLoading,
  formatDate,
  checkLogin,
  goToLogin,
} from "../../utils/common";
import "./detail.scss";

const FeedDetailPage: React.FC = () => {
  const router = useRouter();
  const { id, showComments } = router.params;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCommentsSection, setShowCommentsSection] = useState(
    showComments === "true",
  );

  useEffect(() => {
    if (id) {
      fetchPostDetail(id);
      fetchComments(id);
    }
  }, [id]);

  const fetchPostDetail = async (postId: string) => {
    try {
      showLoading();
      const data = await feedApi.getPostDetail(postId);
      setPost(data);
    } catch (error) {
      console.error("获取帖子详情失败:", error);
      showToast("获取帖子详情失败", "error");
    } finally {
      hideLoading();
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const data = await feedApi.getComments(postId);
      setComments(data);
    } catch (error) {
      console.error("获取评论失败:", error);
    }
  };

  const handleLike = async () => {
    if (!checkLogin()) {
      goToLogin();
      return;
    }

    if (!post) return;

    try {
      if (post.isLiked) {
        await feedApi.unlikePost(post.id);
        setPost({
          ...post,
          isLiked: false,
          likeCount: post.likeCount - 1,
        });
      } else {
        await feedApi.likePost(post.id);
        setPost({
          ...post,
          isLiked: true,
          likeCount: post.likeCount + 1,
        });
      }
    } catch (error) {
      console.error("点赞操作失败:", error);
      showToast("操作失败", "error");
    }
  };

  const handleCollect = async () => {
    if (!checkLogin()) {
      goToLogin();
      return;
    }

    if (!post) return;

    try {
      if (post.isCollected) {
        await feedApi.uncollectPost(post.id);
        setPost({
          ...post,
          isCollected: false,
          collectCount: post.collectCount - 1,
        });
      } else {
        await feedApi.collectPost(post.id);
        setPost({
          ...post,
          isCollected: true,
          collectCount: post.collectCount + 1,
        });
      }
    } catch (error) {
      console.error("收藏操作失败:", error);
      showToast("操作失败", "error");
    }
  };

  const handleSubmitComment = async () => {
    if (!checkLogin()) {
      goToLogin();
      return;
    }

    if (!commentContent.trim() || !post) {
      showToast("评论内容不能为空");
      return;
    }

    try {
      await feedApi.addComment(post.id, commentContent);
      showToast("评论成功", "success");
      setCommentContent("");
      fetchComments(post.id);

      // 更新评论数
      setPost({
        ...post,
        commentCount: post.commentCount + 1,
      });
    } catch (error) {
      console.error("提交评论失败:", error);
      showToast("评论失败", "error");
    }
  };

  const handleViewAuthor = () => {
    if (!post || !post.author) return;

    Taro.navigateTo({
      url: `/pages/me/index?userId=${post.authorId}`,
    });
  };

  if (loading) {
    return (
      <View className="loading-container">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View className="error-container">
        <Text>帖子不存在或已被删除</Text>
      </View>
    );
  }

  return (
    <View className="feed-detail-page">
      <ScrollView scrollY className="feed-content">
        <View className="author-info" onClick={handleViewAuthor}>
          <Image
            className="author-avatar"
            src={post.author?.avatar || ""}
            mode="aspectFill"
          />
          <View className="author-meta">
            <Text className="author-name">
              {post.author?.nickname || "用户"}
            </Text>
            <Text className="post-time">{formatDate(post.createdAt)}</Text>
          </View>
        </View>

        <View className="post-content">
          <Text className="post-caption">{post.caption}</Text>

          <View className="post-images">
            {post.media.map((image, index) => (
              <Image
                key={index}
                className="post-image"
                src={image}
                mode="widthFix"
              />
            ))}
          </View>

          <View className="post-tags">
            {post.tags &&
              post.tags.map((tag, index) => (
                <Text key={index} className="post-tag">
                  #{tag}
                </Text>
              ))}
          </View>
        </View>

        <View className="post-actions">
          <View
            className={`action-item ${post.isLiked ? "active" : ""}`}
            onClick={handleLike}
          >
            <Text className="action-icon">❤</Text>
            <Text className="action-text">{post.likeCount}</Text>
          </View>
          <View
            className="action-item"
            onClick={() => setShowCommentsSection(!showCommentsSection)}
          >
            <Text className="action-icon">💬</Text>
            <Text className="action-text">{post.commentCount}</Text>
          </View>
          <View
            className={`action-item ${post.isCollected ? "active" : ""}`}
            onClick={handleCollect}
          >
            <Text className="action-icon">★</Text>
            <Text className="action-text">{post.collectCount}</Text>
          </View>
        </View>

        <View className="comments-section">
          <View
            className="comments-header"
            onClick={() => setShowCommentsSection(!showCommentsSection)}
          >
            <Text className="comments-title">评论 ({post.commentCount})</Text>
            <Text className="comments-toggle">
              {showCommentsSection ? "收起" : "展开"}
            </Text>
          </View>

          {showCommentsSection && (
            <View className="comments-list">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <View key={comment.id} className="comment-item">
                    <Image
                      className="comment-avatar"
                      src={comment.user?.avatar || ""}
                      mode="aspectFill"
                    />
                    <View className="comment-content">
                      <Text className="comment-name">
                        {comment.user?.nickname || "用户"}
                      </Text>
                      <Text className="comment-text">{comment.content}</Text>
                      <Text className="comment-time">
                        {formatDate(comment.createdAt)}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View className="empty-comments">暂无评论</View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View className="comment-input-container">
        <Input
          className="comment-input"
          placeholder="说点什么..."
          value={commentContent}
          onInput={(e) => setCommentContent(e.detail.value)}
        />
        <Button className="comment-button" onClick={handleSubmitComment}>
          发送
        </Button>
      </View>
    </View>
  );
};

export default FeedDetailPage;
