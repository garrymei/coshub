import { Swiper, SwiperItem, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useState, useEffect } from "react";
import { Banner as BannerType } from "../../types";
import { bannerApi } from "../../services/api";
import "./index.scss";

interface BannerProps {
  type?: "skill" | "share";
}

const Banner: React.FC<BannerProps> = ({ type }) => {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, [type]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerApi.getBanners(type);
      setBanners(data);
    } catch (error) {
      console.error("获取Banner失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerClick = (banner: BannerType) => {
    switch (banner.linkType) {
      case "post":
        Taro.navigateTo({
          url: `/pages/feed/detail?id=${banner.linkUrl}`,
        });
        break;
      case "skill":
        Taro.navigateTo({
          url: `/pages/skills/detail?id=${banner.linkUrl}`,
        });
        break;
      case "page":
        Taro.navigateTo({
          url: banner.linkUrl,
        });
        break;
      case "external":
        // 处理外部链接，可能需要使用web-view组件
        break;
      default:
        break;
    }
  };

  if (loading || banners.length === 0) {
    return null;
  }

  return (
    <Swiper
      className="banner-swiper"
      indicatorColor="#999"
      indicatorActiveColor="#FF6B9D"
      circular
      indicatorDots
      autoplay
    >
      {banners.map((banner) => (
        <SwiperItem key={banner.id} onClick={() => handleBannerClick(banner)}>
          <Image
            className="banner-image"
            src={banner.imageUrl}
            mode="aspectFill"
          />
        </SwiperItem>
      ))}
    </Swiper>
  );
};

export default Banner;
