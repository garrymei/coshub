"use client";

import { useEffect, useRef, useState } from "react";

interface MasonryGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}

export default function MasonryGrid({
  children,
  columns = 3,
  gap = 16,
  className = "",
}: MasonryGridProps) {
  const [columnHeights, setColumnHeights] = useState<number[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const childrenArray = Array.isArray(children) ? children : [children];

  useEffect(() => {
    const updateLayout = () => {
      if (!gridRef.current) return;

      const grid = gridRef.current;
      const gridWidth = grid.offsetWidth;
      const columnWidth = (gridWidth - gap * (columns - 1)) / columns;

      const newColumnHeights = new Array(columns).fill(0);
      const columnElements: HTMLElement[] = [];

      // 创建列容器
      for (let i = 0; i < columns; i++) {
        let column = grid.querySelector(`[data-column="${i}"]`) as HTMLElement;
        if (!column) {
          column = document.createElement("div");
          column.setAttribute("data-column", i.toString());
          column.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: ${gap}px;
            width: ${columnWidth}px;
          `;
          grid.appendChild(column);
        }
        columnElements.push(column);
      }

      // 清空列内容
      columnElements.forEach((col) => {
        col.innerHTML = "";
      });

      // 重新分配子元素到最短的列
      childrenArray.forEach((child, index) => {
        const shortestColumnIndex = newColumnHeights.indexOf(
          Math.min(...newColumnHeights),
        );
        const column = columnElements[shortestColumnIndex];

        if (column && child) {
          const childElement = document.createElement("div");
          childElement.innerHTML = child as any;
          column.appendChild(childElement);

          // 更新列高度（包含间距）
          const childHeight = childElement.offsetHeight;
          newColumnHeights[shortestColumnIndex] += childHeight + gap;
        }
      });

      setColumnHeights(newColumnHeights);
    };

    // 初始布局
    updateLayout();

    // 监听窗口大小变化
    const resizeObserver = new ResizeObserver(updateLayout);
    if (gridRef.current) {
      resizeObserver.observe(gridRef.current);
    }

    // 监听子元素变化
    const mutationObserver = new MutationObserver(updateLayout);
    if (gridRef.current) {
      mutationObserver.observe(gridRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [children, columns, gap]);

  return (
    <div
      ref={gridRef}
      className={`flex gap-${gap} ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {/* 列容器会在这里动态创建 */}
    </div>
  );
}
