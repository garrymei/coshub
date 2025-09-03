import { View, Image } from "@tarojs/components";
import { Banner as IBanner } from "@coshub/types";
import './index.scss';

interface IProps {
  data: {
    id: string;
    imageUrl: string;
    linkUrl?: string;
  };
  onClick?: () => void;
}

export default function Banner({ data, onClick }: IProps) {
  return (
    <View className="banner" onClick={onClick}>
      <Image 
        src={data.imageUrl} 
        mode="aspectFill" 
        className="banner-image"
      />
    </View>
  );
}