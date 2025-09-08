import { View } from "@tarojs/components";
import { ReactNode } from "react";

interface MasonryProps {
  children: ReactNode[];
  columns?: number;
  gap?: number;
  className?: string;
}

export default function Masonry({
  children,
  columns = 2,
  gap = 3,
  className = "",
}: MasonryProps) {
  const gapClass = `gap-${gap}`;

  return (
    <View
      className={`masonry-layout ${className}`}
      style={{
        columnCount: columns,
        columnGap: `${gap * 0.25}rem`,
      }}
    >
      {children.map((child, index) => (
        <View key={index} className="masonry-item">
          {child}
        </View>
      ))}
    </View>
  );
}
