import { View, Image, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from "react";
import { SkillPost } from "../../types";
import { formatDate } from "../../utils/common";
import "./index.scss";

interface SkillCardProps {
  skill: SkillPost;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/skills/detail?id=${skill.id}`,
    });
  };

  return (
    <View className="skill-card" onClick={handleClick}>
      <Image className="skill-image" mode="aspectFill" src={skill.media[0]} />
      <View className="skill-info">
        <View className="skill-header">
          <View className="skill-author">
            <Image
              className="author-avatar"
              mode="aspectFill"
              src={skill.author?.avatar || ""}
            />
            <Text className="author-name">
              {skill.author?.nickname || "用户"}
            </Text>
          </View>
          <View className="skill-price">¥{skill.price}</View>
        </View>
        <Text className="skill-title">{skill.caption}</Text>
        <View className="skill-tags">
          {skill.skillTags.map((tag, index) => (
            <Text key={index} className="skill-tag">
              {tag}
            </Text>
          ))}
        </View>
        <View className="skill-footer">
          <Text className="skill-date">{formatDate(skill.createdAt)}</Text>
          <View className="skill-stats">
            <View className="stat-item">
              <Text className="iconfont icon-like"></Text>
              <Text className="stat-count">{skill.likeCount}</Text>
            </View>
            <View className="stat-item">
              <Text className="iconfont icon-comment"></Text>
              <Text className="stat-count">{skill.commentCount}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SkillCard;
