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
import { SkillPost, Comment } from "../../types";
import { skillApi, feedApi } from "../../services/api";
import {
  showToast,
  showLoading,
  hideLoading,
  formatDate,
  checkLogin,
  goToLogin,
} from "../../utils/common";
import "./detail.scss";

const SkillDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.params;

  const [skill, setSkill] = useState<SkillPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSkillDetail(id);
      fetchComments(id);
    }
  }, [id]);

  const fetchSkillDetail = async (skillId: string) => {
    try {
      showLoading();
      const data = await skillApi.getSkillDetail(skillId);
      setSkill(data);
    } catch (error) {
      console.error("获取技能详情失败:", error);
      showToast("获取技能详情失败", "error");
    } finally {
      hideLoading();
      setLoading(false);
    }
  };

  const fetchComments = async (skillId: string) => {
    try {
      const data = await feedApi.getComments(skillId);
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

    if (!skill) return;

    try {
      if (skill.isLiked) {
        await feedApi.unlikePost(skill.id);
        setSkill({
          ...skill,
          isLiked: false,
          likeCount: skill.likeCount - 1,
        });
      } else {
        await feedApi.likePost(skill.id);
        setSkill({
          ...skill,
          isLiked: true,
          likeCount: skill.likeCount + 1,
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

    if (!skill) return;

    try {
      if (skill.isCollected) {
        await feedApi.uncollectPost(skill.id);
        setSkill({
          ...skill,
          isCollected: false,
          collectCount: skill.collectCount - 1,
        });
      } else {
        await feedApi.collectPost(skill.id);
        setSkill({
          ...skill,
          isCollected: true,
          collectCount: skill.collectCount + 1,
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

    if (!commentContent.trim() || !skill) {
      showToast("评论内容不能为空");
      return;
    }

    try {
      await feedApi.addComment(skill.id, commentContent);
      showToast("评论成功", "success");
      setCommentContent("");
      fetchComments(skill.id);

      // 更新评论数
      setSkill({
        ...skill,
        commentCount: skill.commentCount + 1,
      });
    } catch (error) {
      console.error("提交评论失败:", error);
      showToast("评论失败", "error");
    }
  };

  const handleContact = () => {
    if (!skill || !skill.author) return;

    // 这里可以实现联系功能，如复制联系方式、打开聊天等
    Taro.setClipboardData({
      data: skill.contactInfo || "",
      success: () => {
        showToast("联系方式已复制", "success");
      },
    });
  };

  if (loading) {
    return (
      <View className="loading-container">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!skill) {
    return (
      <View className="error-container">
        <Text>技能不存在或已被删除</Text>
      </View>
    );
  }

  return (
    <View className="skill-detail-page">
      <ScrollView scrollY className="skill-content">
        <View className="skill-images">
          <ScrollView scrollX className="images-scroll">
            {skill.media.map((image, index) => (
              <Image
                key={index}
                className="skill-image"
                src={image}
                mode="aspectFill"
              />
            ))}
          </ScrollView>
        </View>

        <View className="skill-info">
          <View className="skill-header">
            <View className="skill-title">{skill.caption}</View>
            <View className="skill-price">¥{skill.price}</View>
          </View>

          <View className="skill-tags">
            {skill.skillTags.map((tag, index) => (
              <Text key={index} className="skill-tag">
                {tag}
              </Text>
            ))}
          </View>

          <View className="skill-description">
            <Text className="description-title">服务描述</Text>
            <Text className="description-content">
              {skill.serviceDescription}
            </Text>
          </View>

          <View className="skill-author">
            <Image
              className="author-avatar"
              src={skill.author?.avatar || ""}
              mode="aspectFill"
            />
            <View className="author-info">
              <Text className="author-name">
                {skill.author?.nickname || "用户"}
              </Text>
              <Text className="author-bio">
                {skill.author?.bio || "暂无简介"}
              </Text>
            </View>
          </View>
        </View>

        <View className="skill-comments">
          <View
            className="comments-header"
            onClick={() => setShowComments(!showComments)}
          >
            <Text className="comments-title">评论 ({skill.commentCount})</Text>
            <Text className="comments-toggle">
              {showComments ? "收起" : "展开"}
            </Text>
          </View>

          {showComments && (
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

      <View className="action-bar">
        <View className="action-buttons">
          <View
            className={`action-item ${skill.isLiked ? "active" : ""}`}
            onClick={handleLike}
          >
            <Text className="action-icon">❤</Text>
            <Text className="action-text">{skill.likeCount}</Text>
          </View>
          <View
            className={`action-item ${skill.isCollected ? "active" : ""}`}
            onClick={handleCollect}
          >
            <Text className="action-icon">★</Text>
            <Text className="action-text">{skill.collectCount}</Text>
          </View>
        </View>
        <Button className="contact-button" onClick={handleContact}>
          联系TA
        </Button>
      </View>
    </View>
  );
};

export default SkillDetailPage;
