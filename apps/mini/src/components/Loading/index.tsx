import { View, Text } from "@tarojs/components";
import "./index.scss";

interface LoadingProps {
  text?: string;
  size?: "small" | "medium" | "large";
  type?: "spinner" | "dots" | "pulse";
  className?: string;
}

export default function Loading({
  text = "加载中...",
  size = "medium",
  type = "spinner",
  className = "",
}: LoadingProps) {
  return (
    <View className={`loading-container ${size} ${type} ${className}`}>
      <View className="loading-animation">
        {type === "spinner" && (
          <View className="spinner">
            <View className="spinner-inner"></View>
          </View>
        )}
        {type === "dots" && (
          <View className="dots">
            <View className="dot"></View>
            <View className="dot"></View>
            <View className="dot"></View>
          </View>
        )}
        {type === "pulse" && (
          <View className="pulse">
            <View className="pulse-circle"></View>
          </View>
        )}
      </View>
      {text && <Text className="loading-text">{text}</Text>}
    </View>
  );
}
