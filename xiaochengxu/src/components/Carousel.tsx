import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              {item.subtitle && (
                <p className="text-sm opacity-90">{item.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-2 right-4 flex space-x-1">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}