import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";

export type ThemeMode = "light" | "dark" | "auto";

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export function useTheme(): ThemeState {
  const [mode, setMode] = useState<ThemeMode>("auto");
  const [isDark, setIsDark] = useState(false);

  // 检测系统主题
  const detectSystemTheme = (): boolean => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  };

  // 更新主题状态
  const updateTheme = (newMode: ThemeMode) => {
    setMode(newMode);

    let shouldBeDark = false;
    if (newMode === "dark") {
      shouldBeDark = true;
    } else if (newMode === "light") {
      shouldBeDark = false;
    } else {
      // auto 模式，跟随系统
      shouldBeDark = detectSystemTheme();
    }

    setIsDark(shouldBeDark);

    // 更新页面类名
    const pageElement = document.querySelector("page");
    if (pageElement) {
      pageElement.className = shouldBeDark ? "dark" : "light";
    }

    // 保存到本地存储
    Taro.setStorageSync("theme-mode", newMode);
  };

  // 切换主题
  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    updateTheme(newMode);
  };

  // 设置主题
  const setTheme = (newMode: ThemeMode) => {
    updateTheme(newMode);
  };

  // 初始化主题
  useEffect(() => {
    // 从本地存储读取主题设置
    const savedMode = Taro.getStorageSync("theme-mode") as ThemeMode;
    if (savedMode) {
      updateTheme(savedMode);
    } else {
      updateTheme("auto");
    }

    // 监听系统主题变化
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        if (mode === "auto") {
          setIsDark(mediaQuery.matches);
          const pageElement = document.querySelector("page");
          if (pageElement) {
            pageElement.className = mediaQuery.matches ? "dark" : "light";
          }
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [mode]);

  return {
    mode,
    isDark,
    toggleTheme,
    setTheme,
  };
}
