import { View, Text } from "@tarojs/components";
import { useState } from "react";
import { InteractionType } from "@coshub/types";
import "./index.scss";

interface IProps {
  postId: string;
  initialStats: {
    likeCount: number;
    commentCount: number;
    collectCount: number;
  };
}

export default function InteractionBar({ postId, initialStats }: IProps) {
  const [stats, setStats] = useState(initialStats);
  const [interacted, setInteracted] = useState({
    like: false,
    collect: false,
  });

  const handleInteraction = async (type: InteractionType) => {
    try {
      // 调用API
      const action = interacted[type] ? "delete" : "create";
      const res = await Taro.request({
        url: `/api/posts/${postId}/interactions`,
        method: action === "create" ? "POST" : "DELETE",
        data: { type },
      });

      if (res.data.success) {
        setStats((prev) => ({
          ...prev,
          [`${type}Count`]:
            action === "create"
              ? prev[`${type}Count`] + 1
              : prev[`${type}Count`] - 1,
        }));
        setInteracted((prev) => ({ ...prev, [type]: !prev[type] }));
      }
    } catch (error) {
      Taro.showToast({ title: "操作失败", icon: "none" });
    }
  };

  return (
    <View className="interaction-bar">
      <View className="action" onClick={() => handleInteraction("like")}>
        <Text className={`icon ${interacted.like ? "active" : ""}`}>❤️</Text>
        <Text>{stats.likeCount}</Text>
      </View>
      <View className="action">
        <Text className="icon">💬</Text>
        <Text>{stats.commentCount}</Text>
      </View>
      <View className="action" onClick={() => handleInteraction("collect")}>
        <Text className={`icon ${interacted.collect ? "active" : ""}`}>⭐</Text>
        <Text>{stats.collectCount}</Text>
      </View>
    </View>
  );
}
