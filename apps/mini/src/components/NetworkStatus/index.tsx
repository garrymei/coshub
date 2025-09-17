import { View, Text } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import "./index.scss";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 检查初始网络状态
    Taro.getNetworkType({
      success: (res) => {
        const online = res.networkType !== "none";
        setIsOnline(online);
        if (!online) {
          setShow(true);
        }
      },
    });

    // 监听网络状态变化
    Taro.onNetworkStatusChange((res) => {
      setIsOnline(res.isConnected);
      setShow(true);

      // 3秒后隐藏提示
      setTimeout(() => {
        setShow(false);
      }, 3000);
    });
  }, []);

  if (!show) {
    return null;
  }

  return (
    <View className={`network-status ${isOnline ? "online" : "offline"}`}>
      <Text className="network-text">
        {isOnline ? "网络已连接" : "网络连接已断开"}
      </Text>
    </View>
  );
}
