import { View } from "@tarojs/components";
import { ReactNode, useMemo } from "react";

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
  // 将子元素分配到不同的列中
  const columnsData = useMemo(() => {
    const cols: ReactNode[][] = Array.from({ length: columns }, () => []);
    
    children.forEach((child, index) => {
      const columnIndex = index % columns;
      cols[columnIndex].push(child);
    });
    
    return cols;
  }, [children, columns]);

  const gapStyle = {
    gap: `${gap * 0.25}rem`,
  };

  return (
    <View className={`masonry-layout ${className}`} style={gapStyle}>
      <View className="masonry-columns">
        {columnsData.map((columnChildren, columnIndex) => (
          <View key={columnIndex} className="masonry-column" style={gapStyle}>
            {columnChildren.map((child, index) => (
              <View key={`${columnIndex}-${index}`} className="masonry-item">
                {child}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}



