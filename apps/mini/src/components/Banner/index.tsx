import { View, Image } from "@tarojs/components";

import "./index.scss";

interface IProps {
  id: string;
  imageUrl: string;
  linkUrl?: string;
  onClick?: () => void;
}

export default function Banner({ id, imageUrl, linkUrl, onClick }: IProps) {
  const handleClick = () => {
    try {
      onClick?.();
      if (linkUrl) {
        Taro.navigateTo({ url: linkUrl });
      }
    } catch (error) {
      Taro.showToast({ title: "跳转失败", icon: "none" });
    }
  };

  return (
    <View className="banner" onClick={handleClick}>
      <Image 
        src={imageUrl} 
        mode="aspectFill" 
        className="banner-image" 
        onError={() => Taro.showToast({ title: "图片加载失败", icon: "none" })}
      />
    </View>
  );
}
