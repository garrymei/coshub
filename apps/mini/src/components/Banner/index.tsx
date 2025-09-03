import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getBanners } from "@/services/banner";
import { useEffect, useState } from "react";
import "./index.scss";

interface BannerItem {
  id: string;
  imageUrl: string;
  linkType: string;
  linkUrl: string;
}

export default function Banner({ scene }: { scene: "feed" | "skills" }) {
  const [banners, setBanners] = useState<BannerItem[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await getBanners({ scene });
        if (!res) {
          throw new Error("Empty banner response");
        }
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
        setBanners(list);
      } catch (error) {
        Taro.showToast({
          title: "轮播图加载失败",
          icon: "none",
        });
        console.error("Banner加载失败:", error);
      }
    };
    fetchBanners();
  }, [scene]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const res = await getBanners({ scene });
        if (!res) {
          throw new Error("Empty banner response");
        }
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
        setBanners(list);
      } catch (error) {
        Taro.showToast({
          title: "轮播图加载失败",
          icon: "none",
        });
        console.error("Banner加载失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, [scene]);

  if (loading)
    return (
      <View className="banner-loading">
        <View className="loading-text">加载中...</View>
      </View>
    );

  if (banners.length === 0) return null;

  return (
    <View className="banner">
      <Swiper
        className="swiper"
        indicatorDots
        autoplay
        circular
        indicatorColor="#999"
        indicatorActiveColor="#FF6B9D"
      >
        {banners.map((banner) => (
          <SwiperItem key={banner.id}>
            <Image
              className="image"
              src={banner.imageUrl}
              mode="aspectFill"
              onClick={() => {
                const lt = banner.linkType?.toLowerCase();
                if (lt === "internal" || lt === "page") {
                  Taro.navigateTo({ url: banner.linkUrl });
                } else if (lt === "external" || lt === "web") {
                  Taro.navigateTo({
                    url: `/pages/webview/index?url=${encodeURIComponent(banner.linkUrl)}`,
                  });
                }
              }}
            />
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  );
}
