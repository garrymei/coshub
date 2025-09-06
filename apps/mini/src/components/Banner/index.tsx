import { View, Swiper, SwiperItem, Image } from "@tarojs/components";
import { Banner as BannerType } from "@/services/api";

interface BannerProps {
  banners: BannerType[];
  height?: number;
  autoplay?: boolean;
  interval?: number;
  onBannerClick?: (banner: BannerType) => void;
}

export default function Banner({
  banners = [],
  height = 200,
  autoplay = true,
  interval = 3000,
  onBannerClick,
}: BannerProps) {
  if (!banners.length) {
    return null;
  }

  const handleBannerClick = (banner: BannerType) => {
    if (onBannerClick) {
      onBannerClick(banner);
    } else if (banner.link) {
      // 默认处理链接跳转
      console.log("Banner clicked:", banner.link);
    }
  };

  return (
    <View className="banner-container rounded-xl overflow-hidden shadow-medium mb-6">
      <Swiper
        className="banner-swiper"
        style={{ height: `${height}px` }}
        indicatorDots
        autoplay={autoplay}
        circular
        interval={interval}
        duration={500}
      >
        {banners.map((banner) => (
          <SwiperItem key={banner.id}>
            <View
              className="banner-item relative h-full cursor-pointer"
              onClick={() => handleBannerClick(banner)}
            >
              <Image
                className="banner-image w-full h-full object-cover"
                src={banner.image}
                mode="aspectFill"
              />
              {banner.title && (
                <View className="banner-title absolute bottom-0 left-0 right-0 p-4 gradient-overlay">
                  <View className="title-text text-white text-lg font-semibold text-shadow">
                    {banner.title}
                  </View>
                </View>
              )}
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  );
}
