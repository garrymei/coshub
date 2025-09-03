"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Banner } from "@/types/banner";

interface BannerProps {
  scene: "feed" | "skills";
}

export default function Banner({ scene }: BannerProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取 banner 数据
    const fetchBanners = async () => {
      try {
        // TODO: 替换为真实 API 调用
        const mockBanners: Banner[] = [
          {
            id: "1",
            scene: "feed" as const,
            imageUrl: "/api/banners/1.jpg",
            linkType: "external" as const,
            linkUrl: "https://example.com/event1",
            priority: 1,
            online: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
            scene: "feed" as const,
            imageUrl: "/api/banners/2.jpg",
            linkType: "internal" as const,
            linkUrl: "/events/summer-cosplay",
            priority: 2,
            online: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ].filter((b) => b.online);

        setBanners(mockBanners);
      } catch (error) {
        console.error("获取 Banner 失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [scene]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const handleBannerClick = (banner: Banner) => {
    if (banner.linkType === "external") {
      window.open(banner.linkUrl, "_blank");
    } else {
      window.location.href = banner.linkUrl;
    }

    // TODO: 埋点记录点击
    console.log("Banner 点击:", banner.id);
  };

  if (loading) {
    return <div className="w-full h-32 bg-gray-200 animate-pulse" />;
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-32 bg-gray-100 overflow-hidden">
      {/* Banner 图片 */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={banner.imageUrl}
              alt="Banner"
              fill
              className="object-cover cursor-pointer"
              onClick={() => handleBannerClick(banner)}
            />
          </div>
        ))}
      </div>

      {/* 指示器 */}
      {banners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* 左右箭头 */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + banners.length) % banners.length,
              )
            }
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors"
          >
            ‹
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % banners.length)
            }
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
