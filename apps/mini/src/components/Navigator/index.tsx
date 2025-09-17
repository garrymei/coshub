import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";

interface TabItem {
  key: string;
  title: string;
  icon: string;
  activeIcon: string;
  path: string;
}

interface NavigatorProps {
  current: string;
  tabs: TabItem[];
  onTabChange?: (key: string) => void;
}

export default function Navigator({
  current,
  tabs,
  onTabChange,
}: NavigatorProps) {
  const handleTabClick = (tab: TabItem) => {
    if (onTabChange) {
      onTabChange(tab.key);
    } else {
      Taro.switchTab({ url: tab.path });
    }
  };

  return (
    <View className="navigator fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around z-50">
      {tabs.map((tab) => (
        <View
          key={tab.key}
          className={`tab-item flex-1 flex flex-col items-center justify-center pt-2 pb-1 text-xs cursor-pointer transition-colors ${
            current === tab.key ? "text-primary-600" : "text-gray-500"
          }`}
          onClick={() => handleTabClick(tab)}
        >
          <View className="tab-icon text-2xl mb-1">
            {current === tab.key ? tab.activeIcon : tab.icon}
          </View>
          <Text className="tab-text">{tab.title}</Text>
        </View>
      ))}
    </View>
  );
}



