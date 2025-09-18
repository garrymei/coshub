import { useEffect, useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CarouselItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
}

export function Carousel({ items, autoPlay = true, interval = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || items.length <= 1) {
      return;
    }

    let timer: number | undefined;

    const start = () => {
      stop();
      timer = window.setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, interval);
    };

    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    if (!document.hidden) {
      start();
    }

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [autoPlay, interval, items.length]);

  return (
    <div className="relative w-full h-52 overflow-hidden rounded-2xl bg-gradient-to-r from-pink-100 to-purple-100">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div key={item.id} className="w-full flex-shrink-0 relative">
            <ImageWithFallback
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              {item.subtitle && <p className="text-sm opacity-90">{item.subtitle}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-2 right-4 flex space-x-1">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`切换到第 ${index + 1} 张`}
            aria-pressed={index === currentIndex}
          />
        ))}
      </div>
    </div>
  );
}