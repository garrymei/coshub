import { View, Swiper, SwiperItem, Image } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { api, mockData, Banner as BannerType } from "@/services/api";
import { showToast } from "@/utils/common";
import "./index.scss";

interface BannerProps {
  scene: "feed" | "skills" | "home";
  height?: number;
  autoplay?: boolean;
  interval?: number;
  onBannerClick?: (banner: BannerType) => void;
}

export default function Banner({
  scene,
  height = 200,
  autoplay = true,
  interval = 3000,
  onBannerClick,
}: BannerProps) {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取Banner数据
  const fetchBanners = async () => {
    try {
      setLoading(true);
      if (process.env.TARO_APP_USE_MOCK === "true") {
        setBanners(mockData.banners);
      } else {
        const res = await api.banners.getList({ scene });
        setBanners(res.data || []);
      }
    } catch (error) {
      console.error("获取Banner失败:", error);
      // 降级到模拟数据
      setBanners(mockData.banners);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [scene]);

  const handleBannerClick = (banner: BannerType) => {
    if (onBannerClick) {
      onBannerClick(banner);
    } else if (banner.linkUrl) {
      // 处理链接跳转
      if (banner.linkType === "external") {
        // 外部链接，复制到剪贴板
        Taro.setClipboardData({
          data: banner.linkUrl,
          success: () => {
            showToast("链接已复制到剪贴板", "success");
          },
        });
      } else {
        // 内部链接，跳转页面
        Taro.navigateTo({ url: banner.linkUrl });
      }
    }
  };

  if (loading) {
    return (
      <View className="banner-container rounded-xl overflow-hidden shadow-medium mb-6 mx-4">
        <View
          className="banner-loading flex items-center justify-center bg-gray-100"
          style={{ height: `${height}px` }}
        >
          <View className="text-gray-500">加载中...</View>
        </View>
      </View>
    );
  }

  if (!banners.length) {
    return null;
  }

  return (
    <View className="banner-container rounded-xl overflow-hidden shadow-medium mb-6 mx-4">
      <Swiper
        className="banner-swiper"
        style={{ height: `${height}px` }}
        indicatorDots
        indicatorColor="rgba(255, 255, 255, 0.3)"
        indicatorActiveColor="#D946EF"
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
                src={banner.imageUrl}
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
