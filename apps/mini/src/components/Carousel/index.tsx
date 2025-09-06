import { useState } from "react";
import { View, Swiper, SwiperItem, Image } from "@tarojs/components";
import "./index.scss";

interface CarouselItem {
  id: string | number;
  image: string;
  title?: string;
  url?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  height?: number;
  autoplay?: boolean;
  interval?: number;
  circular?: boolean;
  indicatorDots?: boolean;
  onItemClick?: (item: CarouselItem) => void;
}

export default function Carousel({
  items = [],
  height = 200,
  autoplay = true,
  interval = 3000,
  circular = true,
  indicatorDots = true,
  onItemClick,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleItemClick = (item: CarouselItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const handleChange = (e: any) => {
    setCurrentIndex(e.detail.current);
  };

  if (!items.length) {
    return null;
  }

  return (
    <View className="carousel-container" style={{ height: `${height}px` }}>
      <Swiper
        className="carousel-swiper"
        indicatorDots={indicatorDots}
        autoplay={autoplay}
        circular={circular}
        interval={interval}
        duration={500}
        onChange={handleChange}
      >
        {items.map((item) => (
          <SwiperItem key={item.id}>
            <View
              className="carousel-item"
              onClick={() => handleItemClick(item)}
            >
              <Image
                className="carousel-image"
                src={item.image}
                mode="aspectFill"
              />
              {item.title && (
                <View className="carousel-title">
                  <View className="title-text">{item.title}</View>
                </View>
              )}
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  );
}
